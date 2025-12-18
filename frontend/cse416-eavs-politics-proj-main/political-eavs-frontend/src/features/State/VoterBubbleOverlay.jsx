// src/features/State/VoterBubbleOverlay.jsx
import { useEffect } from "react";
import * as d3 from "d3";
import L from "leaflet";
import { useMap } from "react-leaflet";

export default function VoterBubbleOverlay({ bubbles = [] }) {
	const map = useMap();

	useEffect(() => {
		if (!map || !Array.isArray(bubbles) || bubbles.length === 0) return;

		// --- Create SVG overlay ---
		const svgLayer = L.svg({ clickable: true });
		svgLayer.addTo(map);

		const svg = d3.select(map.getPanes().overlayPane).select("svg");
		const g = svg.append("g").attr("class", "voter-bubbles");

		const blocks = bubbles.map((d) => ({
			lat: d.lat,
			lng: d.lon, // backend uses "lon"
			party: d.majorityParty, // backend uses "majorityParty"
		}));

		const color = (party) =>
			party === "R"
				? "#e74c3c" // red
				: party === "D"
				? "#3498db" // blue
				: "#95a5a6"; // fallback

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
				.attr("r", 6) // fixed size per spec
				.attr("fill", (d) => color(d.party))
				.attr("fill-opacity", 0.7)
				.attr("stroke", "#111")
				.attr("stroke-width", 0.5);
		};

		update();
		map.on("zoomend moveend", update);

		return () => {
			map.off("zoomend moveend", update);
			svg.selectAll(".voter-bubbles").remove();
			map.removeLayer(svgLayer);
		};
	}, [map, bubbles]);

	return null;
}
