// src/features/State/VoterBubbleOverlay.jsx
import { useEffect } from "react";
import * as d3 from "d3";
import L from "leaflet";
import { useMap } from "react-leaflet";

export default function VoterBubbleOverlay() {
	const map = useMap();

	useEffect(() => {
		if (!map) return;

		// --- Create a unique SVG layer for each mount ---
		const svgLayer = L.svg({ clickable: true });
		svgLayer.addTo(map);

		const svg = d3.select(map.getPanes().overlayPane).select("svg");
		const g = svg.append("g").attr("class", "voter-bubbles");

		const blocks = [
			{ lat: 35.4676, lng: -97.5164, party: "Republican" },
			{ lat: 36.1539, lng: -95.9928, party: "Democratic" },
			{ lat: 34.7304, lng: -97.0861, party: "Republican" },
			{ lat: 36.7473, lng: -96.3567, party: "Republican" },
			{ lat: 35.3859, lng: -97.6015, party: "Democratic" },
			{ lat: 35.333, lng: -97.278, party: "Republican" },
			{ lat: 36.101, lng: -97.084, party: "Republican" },
			{ lat: 34.603, lng: -98.395, party: "Democratic" },
			{ lat: 36.568, lng: -96.858, party: "Republican" },
			{ lat: 34.996, lng: -95.878, party: "Republican" },
		];

		const color = (party) => (party === "Republican" ? "#e74c3c" : party === "Democratic" ? "#3498db" : "#95a5a6");

		const update = () => {
			const project = (d) => {
				const point = map.latLngToLayerPoint([d.lat, d.lng]);
				return { x: point.x, y: point.y };
			};

			const projected = blocks.map((d) => ({
				...d,
				...project(d),
			}));

			const circles = g.selectAll("circle").data(projected);
			circles
				.join("circle")
				.attr("cx", (d) => d.x)
				.attr("cy", (d) => d.y)
				.attr("r", 8)
				.attr("fill", (d) => color(d.party))
				.attr("fill-opacity", 0.7)
				.attr("stroke", "#111")
				.attr("stroke-width", 0.5);
		};

		update();
		map.on("zoomend moveend", update);

		// --- Proper cleanup on toggle off ---
		return () => {
			map.off("zoomend moveend", update);
			svg.selectAll(".voter-bubbles").remove(); // remove bubbles specifically
			map.removeLayer(svgLayer); // properly remove layer
		};
	}, [map]);

	return null;
}
