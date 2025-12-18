import { useRef, useEffect } from "react";
import * as d3 from "d3";

export default function EquipmentQualityBubbleChart({ data }) {
	const ref = useRef();

	useEffect(() => {
		if (!Array.isArray(data) || data.length === 0) return;

		const width = 700;
		const height = 450;
		const margin = { top: 30, right: 30, bottom: 50, left: 60 };

		d3.select(ref.current).selectAll("*").remove();

		const svg = d3.select(ref.current).append("svg").attr("width", width).attr("height", height);

		// ---- Scales ----
		const xScale = d3
			.scaleLinear()
			.domain([0, 5])
			.range([margin.left, width - margin.right]);

		const yScale = d3
			.scaleLinear()
			.domain([0, d3.max(data, (d) => d.rejectedBallotPct) || 1])
			.nice()
			.range([height - margin.bottom, margin.top]);

		// ---- Axes ----
		svg.append("g")
			.attr("transform", `translate(0,${height - margin.bottom})`)
			.call(d3.axisBottom(xScale));

		svg.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(yScale));

		// ---- Axis labels ----
		svg.append("text")
			.attr("x", width / 2)
			.attr("y", height - 10)
			.attr("text-anchor", "middle")
			.style("fill", "#eee")
			.text("Voting Equipment Quality");

		svg.append("text")
			.attr("transform", "rotate(-90)")
			.attr("x", -height / 2)
			.attr("y", 15)
			.attr("text-anchor", "middle")
			.style("fill", "#eee")
			.text("Rejected Ballots (%)");

		// ---- Tooltip ----
		const tooltip = d3
			.select(ref.current)
			.append("div")
			.style("position", "absolute")
			.style("background", "rgba(0,0,0,0.7)")
			.style("color", "#fff")
			.style("padding", "6px")
			.style("border-radius", "4px")
			.style("font-size", "12px")
			.style("opacity", 0);

		// ---- Bubbles ----
		svg.selectAll("circle")
			.data(data)
			.enter()
			.append("circle")
			.attr("cx", (d) => xScale(d.equipmentQuality))
			.attr("cy", (d) => yScale(d.rejectedBallotPct))
			.attr("r", 7)
			.attr("fill", "#169618ff")
			.attr("opacity", 0.75)
			.on("mouseover", (event, d) => {
				tooltip.style("opacity", 1).html(
					`<strong>${d.juris_name}</strong><br/>
						Quality: ${d.equipmentQuality}<br/>
						Rejected: ${d.rejectedBallotPct.toFixed(2)}%`
				);
			})
			.on("mousemove", (event) => {
				tooltip.style("left", event.offsetX + 15 + "px").style("top", event.offsetY + "px");
			})
			.on("mouseout", () => tooltip.style("opacity", 0));
	}, [data]);

	return <div ref={ref} style={{ position: "relative" }} />;
}
