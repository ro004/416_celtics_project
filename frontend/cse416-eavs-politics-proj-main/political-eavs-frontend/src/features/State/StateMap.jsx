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
const pseudoValue = (str, min = 10, max = 500) => {
	let h = 0;
	for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i);
	const r = Math.abs(h % 997) / 997;
	return Math.round(min + r * (max - min));
};

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

export default function StateMap({
	stateFeature, // GeoJSON feature for the selected state
	stateFips, // e.g. "08"
	isDetailed, // boolean
	dataCategory, // "provisional" | future: "active" | "deletions" | ...
	equipmentMode, // "none" | "type"
	countyFeatures, // full county geojson Feature[] (all 4 detailed states)
	showBubbles, // boolean, whether to show voter bubbles (OK only for now)
	choroplethTotal, // same as GUI-4 data.counties (array of county objects)
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
		const id = feature.properties.GEOID || feature.properties.NAME || `${feature.properties.COUNTYFP}`;
		if (equipmentMode === "type") {
			// deterministic mock assignment
			const pool = Object.keys(EQUIP_COLORS);
			const idx = pseudoValue(id, 0, pool.length - 1) % pool.length;
			const cat = pool[idx];
			return {
				fillColor: EQUIP_COLORS[cat],
				color: "#111",
				weight: 0.8,
				fillOpacity: 0.8,
			};
		}
		return { color: "#555", weight: 0.8, fillOpacity: 0 };
	};

	// GUI-5 choropleth style – monochrome orange bins
	const choroplethStyle = (feature) => {
		if (!isDetailed) {
			return { fillOpacity: 0 };
		}
		const geoid = feature.properties.GEOID;
		let value = provTotalByCounty.get(geoid);
		if (value == null) value = 0;

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
				const from = i === 0 ? 0 : bins[i - 1] + 1;
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
