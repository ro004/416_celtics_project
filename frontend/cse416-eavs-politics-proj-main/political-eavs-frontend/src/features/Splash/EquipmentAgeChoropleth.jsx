import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import usStates from "../../data/us-states.json";

const pseudoAge = (id) => {
	let h = 0;
	for (let i = 0; i < id.length; i++) h = (h << 5) - h + id.charCodeAt(i);
	return Math.abs(h % 12) + 1; // 1–12 years
};

const ageStyle = (feature) => {
	const val = pseudoAge(feature.id);
	const bins = [1, 2, 4, 6, 8, 10];
	const colors = ["#fff5e6", "#ffe0b3", "#ffcc80", "#ff9933", "#e67300", "#b35900", "#663300"];
	let idx = bins.findIndex((b) => val <= b);
	if (idx === -1) idx = colors.length - 1;
	return { fillColor: colors[idx], color: "#333", weight: 1, fillOpacity: 0.85 };
};

function AgeLegend() {
	const map = useMap();
	useEffect(() => {
		const ctrl = L.control({ position: "bottomright" });
		ctrl.onAdd = () => {
			const div = L.DomUtil.create("div", "age-legend");
			div.style.padding = "8px";
			div.style.background = "rgba(0,0,0,0.7)";
			div.style.color = "#fff";
			div.style.borderRadius = "6px";
			div.style.font = "12px sans-serif";

			const labels = ["≤ 1 year", "2–3 years", "4–5 years", "6–7 years", "8–10 years", "> 10 years"];
			const colors = ["#fff5e6", "#ffe0b3", "#ffcc80", "#ff9933", "#e67300", "#b35900"];
			div.innerHTML = `<strong>Average Age of Voting Equipment</strong><br>`;
			for (let i = 0; i < colors.length; i++) {
				div.innerHTML += `
          <div style="margin:2px 0">
            <span style="display:inline-block;width:14px;height:14px;background:${colors[i]};margin-right:6px;border-radius:2px"></span>
            ${labels[i]}
          </div>`;
			}
			div.innerHTML += `<div style="margin-top:4px;font-size:11px;color:#ccc">Darker = Older Equipment</div>`;
			return div;
		};
		ctrl.addTo(map);
		return () => ctrl.remove();
	}, [map]);
	return null;
}

export default function EquipmentAgeChoropleth() {
	const navigate = useNavigate();

	const onEachState = (feature, layer) => {
		layer.on({
			click: () => {
				const stateId = feature.id;
				navigate(`/state/${stateId}`);
			},
		});
	};

	return (
		<MapContainer center={[37.8, -96]} zoom={5} style={{ height: "100%", width: "100%" }}>
			<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
			<GeoJSON data={usStates} style={ageStyle} onEachFeature={onEachState} />
			<AgeLegend />
		</MapContainer>
	);
}
