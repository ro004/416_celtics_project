// StateMap.jsx
import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import VoterBubbleOverlay from "./VoterBubbleOverlay";

// small helper to fit bounds to a feature
function FitBounds({ feature }) {
	const map = useMap();
	useEffect(() => {
		if (!feature) return;
		const layer = L.geoJSON(feature);
		map.fitBounds(layer.getBounds(), { padding: [10, 10] });
	}, [feature, map]);
	return null;
}

// simple seeded-ish value so counties are stable without real data
// const pseudoValue = (str, min = 10, max = 500) => {
// 	let h = 0;
// 	for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i);
// 	const r = Math.abs(h % 997) / 997;
// 	return Math.round(min + r * (max - min));
// };

// categorical palette (avoid red/blue)
const EQUIP_COLORS = {
	"DRE no VVPAT": "#8e44ad", // purple
	"DRE with VVPAT": "#16a085", // teal
	"Ballot Marking Device": "#e67e22", // orange
	Scanner: "#ede617ff", // yellow
};

function EquipmentLegend({ mode }) {
	const map = useMap(); // safe, always called
	useEffect(() => {
		if (!map || mode === "none") return;
		const ctrl = L.control({ position: "bottomright" });
		ctrl.onAdd = () => {
			const div = L.DomUtil.create("div", "leaflet-control equipment-legend");
			div.style.padding = "8px";
			div.style.background = "rgba(0,0,0,0.6)";
			div.style.color = "#fff";
			div.style.borderRadius = "6px";
			div.style.font = "12px sans-serif";
			if (mode === "type") {
				div.innerHTML = `<strong>Equipment Type</strong><br>${Object.entries(EQUIP_COLORS)
					.map(
						([k, c]) =>
							`<div style="margin:4px 0"><span style="display:inline-block;width:12px;height:12px;background:${c};margin-right:6px;border-radius:2px"></span>${k}</div>`
					)
					.join("")}`;
			} else if (mode === "age") {
				div.innerHTML = `<strong>Relative Age</strong><br><div>Light = Newer</div><div>Dark = Older</div>`;
			}
			return div;
		};
		ctrl.addTo(map);
		return () => ctrl.remove();
	}, [map, mode]);
	return null;
}
// Helper for stripe pattern for GUI-10 map
function EquipmentPatterns() {
	const map = useMap();

	useEffect(() => {
		const svg = map.getPanes().overlayPane.querySelector("svg");
		if (!svg || svg.querySelector("#equip-patterns")) return;

		const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
		defs.setAttribute("id", "equip-patterns");

		Object.entries(EQUIP_COLORS).forEach(([, color], idx) => {
			const pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
			pattern.setAttribute("id", `equip-stripe-${idx}`);
			pattern.setAttribute("patternUnits", "userSpaceOnUse");
			pattern.setAttribute("width", "8");
			pattern.setAttribute("height", "8");
			pattern.setAttribute("patternTransform", "rotate(45)");

			const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
			rect.setAttribute("width", "8");
			rect.setAttribute("height", "8");
			rect.setAttribute("fill", color);

			const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
			line.setAttribute("x1", "0");
			line.setAttribute("y1", "0");
			line.setAttribute("x2", "0");
			line.setAttribute("y2", "8");
			line.setAttribute("stroke", "white");
			line.setAttribute("stroke-width", "2");

			pattern.appendChild(rect);
			pattern.appendChild(line);
			defs.appendChild(pattern);
		});

		svg.insertBefore(defs, svg.firstChild);
	}, [map]);

	return null;
}

export default function StateMap({
	stateFeature, // GeoJSON feature for the selected state
	stateFips, // e.g. "08"
	isDetailed, // boolean
	dataCategory, // "provisional" | "active" | "deletions" | "mail_rejects" | "voter_reg"
	equipmentMode, // "none" | "type"
	equipmentByCounty, // GUI-10 data (array of county equipment objects)
	countyFeatures, // full county geojson Feature[] (all 4 detailed states)
	showBubbles, // boolean, whether to show voter bubbles (OK only for now)
	choroplethTotal, // same as GUI-4 data.counties (array of county objects) | voter reg
}) {
	// filter counties for this state only once
	const counties = useMemo(() => {
		if (!isDetailed || !stateFips) return [];
		return countyFeatures.filter((f) => f.properties.STATEFP === stateFips);
	}, [isDetailed, stateFips, countyFeatures]);

	const asFeatureCollection = useMemo(
		() => ({
			type: "FeatureCollection",
			features: counties,
		}),
		[counties]
	);

	// Build county GEOID -> prov_total_cast lookup (GUI-5)
	const provTotalByCounty = useMemo(() => {
		const map = new Map();

		if (!Array.isArray(choroplethTotal)) return map;

		choroplethTotal.forEach((row) => {
			// county_fips is already a full GEOID (e.g. "35001")
			if (!row.county_fips) return;
			map.set(row.county_fips, Number(row.prov_total_cast));
		});

		return map;
	}, [choroplethTotal]);

	// Build county GEOID -> active voter percentage lookup (GUI-7)
	const activePctByCounty = useMemo(() => {
		const map = new Map();

		if (!Array.isArray(choroplethTotal)) return map;

		choroplethTotal.forEach((row) => {
			if (!row.county_fips) return;

			const active = Number(row.a12_active);
			const total = Number(row.a12_total);

			if (!Number.isFinite(active) || !Number.isFinite(total) || total <= 0) {
				map.set(row.county_fips, 0); // lowest bin if missing/bad county
			} else {
				map.set(row.county_fips, (active / total) * 100);
			}
		});

		return map;
	}, [choroplethTotal]);

	// build county GEOID -> mail rejects percentage lookup (GUI-9)
	const mailRejectsPctByCounty = useMemo(() => {
		const map = new Map();

		if (!Array.isArray(choroplethTotal)) return map;

		choroplethTotal.forEach((row) => {
			if (!row.county_fips) return;

			const mailRejected = Number(row.rejection_pct_of_state);

			if (!Number.isFinite(mailRejected) || mailRejected <= 0) {
				map.set(row.county_fips, 0); // lowest bin if missing/bad county
			} else {
				map.set(row.county_fips, mailRejected);
			}
		});

		return map;
	}, [choroplethTotal]);

	// build county GEOID -> pollbook deletions percentage lookup (GUI-8)
	const pollbookDeletionsPctByCounty = useMemo(() => {
		const map = new Map();
		if (!Array.isArray(choroplethTotal)) return map;

		choroplethTotal.forEach((row) => {
			if (!row.county_fips) return;

			const deletionsPct = Number(row.deletion_pct_of_registered);
			if (!Number.isFinite(deletionsPct) || deletionsPct <= 0) {
				map.set(row.county_fips, 0); // lowest bin if missing/bad county
			} else {
				map.set(row.county_fips, deletionsPct);
			}
		});

		return map;
	}, [choroplethTotal]);

	// build county name -> voter registration percentage lookup (GUI-9)
	const voterRegPctByCounty = useMemo(() => {
		const map = new Map();
		if (!Array.isArray(choroplethTotal)) return map;

		choroplethTotal.forEach((r) => {
			if (!r.county) return;
			map.set(r.county.toUpperCase(), Number(r.percent_registered));
		});

		return map;
	}, [choroplethTotal]);

	// build county GEOID -> array of equipment types (GUI-10)
	const equipmentByCountyGEOID = useMemo(() => {
		const map = new Map();

		if (!Array.isArray(equipmentByCounty)) return map;

		equipmentByCounty.forEach((r) => {
			if (!r.county_fips) return;

			const types = [];
			if (r.dreNoVvpat) types.push("DRE no VVPAT");
			if (r.dreWithVvpat) types.push("DRE with VVPAT");
			if (r.bmd) types.push("Ballot Marking Device");
			if (r.scanner) types.push("Scanner");

			map.set(r.county_fips, types);
		});

		return map;
	}, [equipmentByCounty]);

	// style for base state outline
	const baseStyle = useMemo(
		() => ({
			fillColor: "#4caf50",
			weight: 2,
			color: "black",
			fillOpacity: isDetailed ? 0.3 : 0.5,
		}),
		[isDetailed]
	);

	// equipment overlay style
	const equipmentStyle = (feature) => {
		if (equipmentMode !== "type") {
			return { color: "#555", weight: 0.8, fillOpacity: 0 };
		}

		const geoid = feature.properties.GEOID;
		const types = equipmentByCountyGEOID.get(geoid);

		// No data --> leave as-is
		if (!types || types.length === 0) {
			return {
				fillOpacity: 0,
			};
		}

		// Single equipment type → solid fill
		if (types.length === 1) {
			return {
				fillColor: EQUIP_COLORS[types[0]],
				color: "#111",
				weight: 0.8,
				fillOpacity: 0.85,
			};
		}

		// Multiple equipment types → fill + colored stripes
		const fillType = types[0];
		const stripeType = types[1]; // second type determines stripe color

		return {
			fillColor: EQUIP_COLORS[fillType],
			color: EQUIP_COLORS[stripeType], // stripe color
			weight: 1.2,
			fillOpacity: 0.85,
			dashArray: "6 4", // diagonal stripe effect
		};
	};

	// GUI-5 choropleth style – monochrome orange bins
	const choroplethStyle = (feature) => {
		if (!isDetailed) {
			return { fillOpacity: 0 };
		}

		const geoid = feature.properties.GEOID;
		let value = 0;
		if (dataCategory === "provisional") {
			value = provTotalByCounty.get(geoid);
			if (value == null) value = 0; // lowest bin if missing/bad county
		} else if (dataCategory === "active") {
			value = activePctByCounty.get(geoid);
			if (value == null) value = 0;
		} else if (dataCategory === "mail_rejects") {
			value = mailRejectsPctByCounty.get(geoid);
			if (value == null) value = 0;
		} else if (dataCategory === "deletions") {
			value = pollbookDeletionsPctByCounty.get(geoid);
			if (value == null) value = 0;
		} else if (dataCategory === "voter_reg") {
			const countyName = feature.properties.NAME || feature.properties.NAMELSAD;

			value = voterRegPctByCounty.get(countyName?.toUpperCase());
			if (value == null) value = 0;

			const bins = [1, 2, 3, 4, 5, 100];
			const colors = ["#fff5e6", "#ffd9b3", "#ffbf80", "#ff9933", "#cc7a00", "#994d00"];

			let idx = bins.findIndex((b) => value <= b);
			if (idx === -1) idx = bins.length - 1;

			return {
				fillColor: colors[idx],
				color: "#111",
				weight: 0.6,
				fillOpacity: 0.85,
			};
		}

		// Binning
		const bins = dataCategory === "provisional" ? [100, 250, 400, 600, 800, 1000] : [20, 40, 60, 80, 100];

		const colors =
			dataCategory === "provisional"
				? ["#fff5e6", "#ffd9b3", "#ffbf80", "#ff9933", "#cc7a00", "#994d00"]
				: ["#fff5e6", "#ffd9b3", "#ffbf80", "#ff9933", "#994d00"];

		let idx = bins.findIndex((b) => value <= b);
		if (idx === -1) idx = bins.length - 1;

		return {
			fillColor: colors[idx],
			color: "#111",
			weight: 0.6,
			fillOpacity: 0.85,
		};
	};

	return (
		<div style={{ height: "100%", width: "100%" }}>
			{stateFeature && (
				<MapContainer
					style={{ height: "100%", width: "100%" }}
					zoom={6}
					center={[37.8, -96]}
					zoomControl={true}>
					<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

					{/* SVG patterns for equipment overlay */}
					{equipmentMode === "type" && <EquipmentPatterns />}

					{/* Base state outline */}
					<GeoJSON data={stateFeature} style={baseStyle} />

					{/* UC-10 Overlay Legend */}
					{isDetailed && counties.length > 0 && equipmentMode !== "none" && (
						<>
							<GeoJSON data={asFeatureCollection} style={equipmentStyle} />
							<EquipmentLegend mode={equipmentMode} />
						</>
					)}

					{/* Choropleth Legend */}
					{isDetailed && counties.length > 0 && equipmentMode === "none" && (
						<>
							{dataCategory === "provisional" && (
								<>
									<GeoJSON data={asFeatureCollection} style={choroplethStyle} />
									<ChoroplethLegend
										title="Total Provisional Ballots Cast (E1a)"
										bins={[100, 250, 400, 600, 800, 1000]}
										colors={["#fff5e6", "#ffd9b3", "#ffbf80", "#ff9933", "#cc7a00", "#994d00"]}
										isPercent={false}
									/>
								</>
							)}
							{dataCategory === "active" && (
								<>
									<GeoJSON data={asFeatureCollection} style={choroplethStyle} />
									<ChoroplethLegend
										title="Active Registered Voters (%)"
										bins={[20, 40, 60, 80, 100]}
										colors={["#fff5e6", "#ffd9b3", "#ffbf80", "#ff9933", "#994d00"]}
										isPercent={true}
									/>
								</>
							)}
							{dataCategory === "deletions" && (
								<>
									<GeoJSON data={asFeatureCollection} style={choroplethStyle} />
									<ChoroplethLegend
										title="Pollbook Deletions (%)"
										bins={[20, 40, 60, 80, 100]}
										colors={["#fff5e6", "#ffd9b3", "#ffbf80", "#ff9933", "#994d00"]}
										isPercent={true}
									/>
								</>
							)}
							{dataCategory === "mail_rejects" && (
								<>
									<GeoJSON data={asFeatureCollection} style={choroplethStyle} />
									<ChoroplethLegend
										title="Mail Ballot Rejections (%)"
										bins={[20, 40, 60, 80, 100]}
										colors={["#fff5e6", "#ffd9b3", "#ffbf80", "#ff9933", "#994d00"]}
										isPercent={true}
									/>
								</>
							)}
							{dataCategory === "voter_reg" && (
								<>
									<GeoJSON data={asFeatureCollection} style={choroplethStyle} />
									<ChoroplethLegend
										title="Voter Registration (%)"
										bins={[1, 2, 3, 4, 5, 100]}
										colors={["#fff5e6", "#ffd9b3", "#ffbf80", "#ff9933", "#cc7a00", "#994d00"]}
										isPercent={true}
									/>
								</>
							)}
						</>
					)}

					{/* Voter Bubble Overlay (OK only for now) */}
					{isDetailed && stateFips === "40" && showBubbles && <VoterBubbleOverlay />}

					<FitBounds feature={stateFeature} />
				</MapContainer>
			)}
		</div>
	);
}

// Legend for choropleth
function ChoroplethLegend({ title, bins, colors, isPercent }) {
	const map = useMap();
	useEffect(() => {
		const ctrl = L.control({ position: "bottomright" });
		ctrl.onAdd = () => {
			const div = L.DomUtil.create("div", "choropleth-legend");
			div.style.padding = "8px";
			div.style.background = "rgba(0,0,0,0.7)";
			div.style.color = "#fff";
			div.style.borderRadius = "6px";
			div.style.font = "12px sans-serif";
			div.innerHTML = `<strong>${title}</strong><br>`;
			for (let i = 0; i < colors.length; i++) {
				const from = i === 0 ? 0 : bins[i - 1];

				const to = bins[i] || (isPercent ? "100%" : `${bins[bins.length - 1]}+`);
				div.innerHTML += `<div><span style="display:inline-block;width:14px;height:14px;background:${
					colors[i]
				};margin-right:6px"></span>${from}-${to}${isPercent ? "%" : ""}</div>`;
			}
			return div;
		};
		ctrl.addTo(map);
		return () => ctrl.remove();
	}, [map, title, bins, colors, isPercent]);
	return null;
}
