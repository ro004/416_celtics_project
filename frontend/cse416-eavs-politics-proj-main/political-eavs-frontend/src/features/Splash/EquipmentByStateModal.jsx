import { useEffect, useRef } from "react";
import { Box, Dialog, DialogTitle, DialogContent, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import * as d3 from "d3";

const EQUIPMENT_TYPES = ["DRE no VVPAT", "DRE with VVPAT", "Ballot Marking Device", "Scanner"];

// Generate mock data for every year 2016–2024
const generateMockData = () =>
	Array.from({ length: 9 }, (_, i) => {
		const year = 2016 + i; // 2016 → 2024
		return { year, value: Math.floor(Math.random() * 4000 + 1000) };
	});

function BarChart({ title, data }) {
	const ref = useRef();
	const wrapperRef = useRef();

	useEffect(() => {
		if (!data.length) return;
		const svg = d3.select(ref.current);
		svg.selectAll("*").remove();

		const { width, height } = wrapperRef.current.getBoundingClientRect();
		const margin = { top: 30, right: 20, bottom: 50, left: 60 };
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;

		const x = d3
			.scaleBand()
			.domain(data.map((d) => d.year))
			.range([0, innerWidth])
			.padding(0.2);
		const y = d3
			.scaleLinear()
			.domain([0, d3.max(data, (d) => d.value)])
			.nice()
			.range([innerHeight, 0]);

		const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

		// Axes
		g.append("g")
			.attr("transform", `translate(0,${innerHeight})`)
			.call(d3.axisBottom(x).tickFormat(d3.format("d")))
			.selectAll("text")
			.style("fill", "#ddd")
			.style("font-size", "12px");

		g.append("g").call(d3.axisLeft(y)).selectAll("text").style("fill", "#ddd").style("font-size", "12px");

		// Bars
		g.selectAll("rect")
			.data(data)
			.enter()
			.append("rect")
			.attr("x", (d) => x(d.year))
			.attr("y", (d) => y(d.value))
			.attr("height", (d) => innerHeight - y(d.value))
			.attr("width", x.bandwidth())
			.attr("fill", "#2196f3");

		// Chart title
		svg.append("text")
			.attr("x", width / 2)
			.attr("y", 20)
			.attr("text-anchor", "middle")
			.style("fill", "#eee")
			.style("font-size", "14px")
			.text(title);

		// Axis labels
		svg.append("text")
			.attr("x", width / 2)
			.attr("y", height - 10)
			.attr("text-anchor", "middle")
			.style("fill", "#eee")
			.style("font-size", "13px")
			.text("Federal Year");

		svg.append("text")
			.attr("transform", "rotate(-90)")
			.attr("x", -height / 2)
			.attr("y", 10)
			.attr("text-anchor", "middle")
			.style("fill", "#eee")
			.style("font-size", "13px")
			.text("Quantity");
	}, [data, title]);

	return (
		<Box ref={wrapperRef} sx={{ height: 220, width: "100%" }}>
			<svg ref={ref} style={{ width: "100%", height: "100%" }} />
		</Box>
	);
}

export default function EquipmentByStateModal({ open, stateName, onClose }) {
	const mockCharts = EQUIPMENT_TYPES.map((type) => ({
		title: type,
		data: generateMockData(),
	}));

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="md"
			fullWidth
			PaperProps={{
				sx: {
					backgroundColor: "#1e1e1e",
					color: "#fff",
					borderRadius: 2,
				},
			}}>
			<DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
				<Typography variant="h6">Voting Equipment By Category — {stateName}</Typography>
				<IconButton onClick={onClose} sx={{ color: "#fff" }}>
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent
				dividers
				sx={{
					maxHeight: "75vh",
					overflow: "hidden", // prevent scrolling
					backgroundColor: "#242424",
					display: "grid",
					gridTemplateColumns: "1fr 1fr", // 2 columns
					gridTemplateRows: "1fr 1fr", // 2 rows
					gap: 3, // space between charts
					p: 3,
				}}>
				{mockCharts.map((chart, idx) => (
					<Box
						key={idx}
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							height: "100%",
							width: "100%",
						}}>
						<BarChart title={chart.title} data={chart.data} />
					</Box>
				))}
			</DialogContent>
		</Dialog>
	);
}
