// src/features/State/CategoryBarChart.jsx
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Box, Typography } from "@mui/material";

// Category definitions
const CATEGORY_DEFS = {
	provisional: {
		axisX: "Provisional Ballot Data Categories",
		axisY: "Ballots Cast",
		labels: {
			E2a: "Total",
			E2b: "Not Registered",
			E2c: "Wrong Jurisdiction",
			E2d: "Wrong Precinct",
			E2e: "No ID",
			E2f: "Incomplete",
			E2g: "Ballot Missing",
			E2h: "No Signature",
			E2i: "Non-matching Signature",
			Other: "Miscellaneous / Other",
		},
	},
	active: {
		axisX: "Active Voter Categories",
		axisY: "Voters",
		labels: { Act: "Active Voters", Inact: "Inactive Voters", Tot: "Total Registered" },
	},
	deletions: {
		axisX: "Pollbook Deletion Categories",
		axisY: "Deletions",
		labels: {
			A12b: "Moved Outside of Jurisdiction",
			A12c: "Deceased",
			A12d: "Disqualified (Conviction/Incarceration)",
			A12e: "Failed to Respond/Not Voted",
			A12f: "Declared Incompetent",
			A12g: "Requested Removal",
			A12h: "Duplicate Record",
		},
	},
	mail_rejects: {
		axisX: "Mail Ballot Rejection Categories",
		axisY: "Rejections",
		labels: {
			C9b: "Missed Deadline",
			C9c: "No Voter Signature",
			C9d: "No Witness Signature",
			C9e: "Non-matching/Incomplete Signature",
			C9f: "Unofficial Envelope",
			C9g: "Missing From Envelope",
			C9h: "Missing Required Envelope",
			C9i: "Multiple in One Envelope",
			C9j: "Unsealed Envelope",
			C9k: "No Postmark",
			C9l: "No Resident Address",
			C9m: "Deceased",
			C9n: "Already Cast Another",
			C9o: "Incomplete Documentation",
			C9p: "Not Eligible",
			C9q: "No Application on Record",
		},
	},
};

export default function CategoryBarChart({ category = "provisional" }) {
	const ref = useRef();
	const wrapperRef = useRef();
	const [data, setData] = useState([]);

	// pick defs based on category
	const defs = CATEGORY_DEFS[category] || CATEGORY_DEFS.provisional; // (2) use CATEGORY_DEFS
	const categoryLabels = defs.labels;

	useEffect(() => {
		// generate random demo data based on chosen labels
		const mock = Object.keys(categoryLabels).map((code) => ({
			category: code,
			value: Math.floor(Math.random() * 120 + 20),
		}));
		setData(mock);
	}, [category, categoryLabels]); // (3) regenerate when category changes

	useEffect(() => {
		if (!data.length) return;

		const svg = d3.select(ref.current);
		svg.selectAll("*").remove();

		const { width, height } = wrapperRef.current.getBoundingClientRect();

		const margin = { top: 40, right: 20, bottom: 80, left: 70 };
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;

		const x = d3
			.scaleBand()
			.domain(data.map((d) => d.category))
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
			.call(d3.axisBottom(x))
			.selectAll("text")
			.attr("transform", "rotate(-45)")
			.style("text-anchor", "end")
			.style("fill", "#ddd")
			.style("font-size", "12px");

		g.append("g").call(d3.axisLeft(y)).selectAll("text").style("fill", "#ddd").style("font-size", "12px");

		// Bars
		g.selectAll("rect")
			.data(data)
			.enter()
			.append("rect")
			.attr("x", (d) => x(d.category))
			.attr("y", (d) => y(d.value))
			.attr("height", (d) => innerHeight - y(d.value))
			.attr("width", x.bandwidth())
			.attr("fill", "#2196f3");

		// Axis labels
		svg.append("text")
			.attr("x", width / 2)
			.attr("y", height - 27)
			.attr("text-anchor", "middle")
			.style("fill", "#eee")
			.style("font-size", "14px")
			.text(defs.axisX);

		svg.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 20)
			.attr("x", -(height / 2))
			.attr("text-anchor", "middle")
			.style("fill", "#eee")
			.style("font-size", "14px")
			.text(defs.axisY);
	}, [data, category, defs.axisX, defs.axisY]);

	return (
		<Box sx={{ display: "flex", height: "100%", width: "100%" }}>
			{/* chart */}
			<div ref={wrapperRef} style={{ flex: 1, height: "100%" }}>
				<svg ref={ref} style={{ width: "100%", height: "100%" }} />
			</div>

			{/* legend rendered with MUI */}
			<Box
				sx={{
					ml: 2,
					pr: 1,
					display: "flex",
					flexDirection: "column",
					justifyContent: "flex-start",
					maxHeight: "100%",
					overflowY: "auto",
				}}>
				{Object.entries(categoryLabels).map(([code, name]) => (
					<Box key={code} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
						<Box sx={{ width: 14, height: 14, bgcolor: "#2196f3", mr: 1 }} />
						<Typography variant="caption" sx={{ color: "#ddd" }}>
							{code}: {name}
						</Typography>
					</Box>
				))}
			</Box>
		</Box>
	);
}
