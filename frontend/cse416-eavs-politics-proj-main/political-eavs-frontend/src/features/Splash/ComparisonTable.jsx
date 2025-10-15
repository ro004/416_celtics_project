import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";
import {useEffect, useState} from "react";
import { getDelawareData, getSouthCarolinaData } from "../../api/stateVotes";

export default function ComparisonTable({ mode }) {
	let headers = [];
	let rows = [];
	//add state variables instead later when we have data for all columns
	//const [rows, setRows] = useState([]);
	//const [headers, setHeaders] = useState([]);
	//for now, we store in temp variables
	const [delawareTotal, setDelawareTotal] = useState(0);
	const [southCarolinaTotal, setSouthCarolinaTotal] = useState(0);

	//Get total voters in dem delaware and rep SC
	useEffect(() => {
		async function fetchTotals(){
			if (mode === "reg-comp" || mode === "opt-in-out") {
				try {
					const [delaware, southCarolina] = await Promise.all([
						getDelawareData(), getSouthCarolinaData(),
					]);
					let delaware_dem = 0, delaware_rep = 0;
					console.log("Delaware: ", delaware);
					console.log("SouthC:", southCarolina);
					//helper function to parseCount from string to int
					const parseCount = (count) => parseInt(count.replace(/,/g, ""), 10) || 0;
					delaware.forEach((county) => {
						delaware_dem += parseCount(county.votes.democrat.count);
						delaware_rep += parseCount(county.votes.republican.count);
					});
					setDelawareTotal(delaware_dem + delaware_rep);

					let sC_dem = 0, sC_rep = 0;
					southCarolina.forEach((county) => {
						sC_dem += parseCount(county.votes.democrat.count);
						sC_rep += parseCount(county.votes.republican.count);
					});
					setSouthCarolinaTotal(sC_dem + sC_rep);
				} catch (err){
					console.error("Error fetching state totals:", err);
				}
			}
		}
		fetchTotals();
	}, [mode]);

	switch (mode) {
		// --- GUI-21 ---
		case "opt-in-out":
			headers = [
				"State Type",
				"Registered Voters (Absolute)",
				"Registration Rate (%)",
				"Turnout (Absolute)",
				"Turnout Rate (%)",
			];

			rows = [
				{
					Metric: "South Carolina: Opt-In",
					RegAbs: southCarolinaTotal ? southCarolinaTotal.toLocaleString() : "Data fetching...",
					RegPct: "72%",
					TurnAbs: "2,150,000",
					TurnPct: "61%",
				},
				{
					Metric: "Colorado: Opt-Out (Same-Day Registration)",
					RegAbs: "3,870,000",
					RegPct: "86%",
					TurnAbs: "3,050,000",
					TurnPct: "68%",
				},
				{
					Metric: "Delaware: Opt-Out (No Same-Day Registration)",
					RegAbs: "3,240,000",
					RegPct: "80%",
					TurnAbs: "2,580,000",
					TurnPct: "64%",
				},
			];
			break;

		// --- GUI-22 ---
		case "reg-comp":
			headers = [
				"State Type",
				"Registered Voters (Absolute)",
				"Registration Rate (%)",
				"Turnout (Absolute)",
				"Turnout Rate (%)",
			];

			rows = [
				{
					Metric: "South Carolina (Rep)",
					RegAbs: southCarolinaTotal ? southCarolinaTotal.toLocaleString() : "Data fetching...",
					//RegPct: "51%",
					RegPct: southCarolinaTotal ? ((southCarolinaTotal * 100)/5479000.0).toFixed(1) + "%": "Data Fetching...",
					TurnAbs: "2,540,000",
					TurnPct: "66%",
				},
				{
					Metric: "Delaware (Dem)",
					RegAbs: delawareTotal ? delawareTotal.toLocaleString() : "Data fetching...",
					//RegPct: "52%",
					RegPct: delawareTotal ? ((delawareTotal * 100)/1052000.0).toFixed(1) + "%": "Data Fetching...",
					TurnAbs: "570,000",
					TurnPct: "72%",
				},
			];
			break;

		// --- GUI-23 ---
		case "early-voting":
			headers = [
				"State Type",
				"Total Early Votes (Absolute)",
				"Early Voting Rate (%)",
				"In-Person Early (Abs)",
				"In-Person Early (%)",
				"Mail Early (Abs)",
				"Mail Early (%)",
			];

			rows = [
				{
					Metric: "Republican",
					TotAbs: "1,820,000",
					TotPct: "47%",
					InAbs: "1,100,000",
					InPct: "28%",
					MailAbs: "720,000",
					MailPct: "19%",
				},
				{
					Metric: "Democratic",
					TotAbs: "370,000",
					TotPct: "63%",
					InAbs: "220,000",
					InPct: "38%",
					MailAbs: "150,000",
					MailPct: "25%",
				},
			];
			break;

		// --- Default fallback (GUI-15 etc.) ---
		default:
			headers = ["Metric", "Republican State", "Democratic State"];
			rows = [
				{
					Metric: "Felony Voting Rights",
					Republican: "Restricted",
					Democratic: "Restored After Parole",
				},
				{
					Metric: "% Mail Ballots",
					Republican: "12%",
					Democratic: "34%",
				},
				{
					Metric: "% Drop Box Ballots",
					Republican: "5%",
					Democratic: "21%",
				},
				{
					Metric: "Voter Turnout",
					Republican: "64%",
					Democratic: "72%",
				},
			];
			break;
	}


	return (
		<Paper sx={{ p: 2, overflowX: "auto" }}>
			<TableContainer>
				<Table size="small" stickyHeader>
					<TableHead>
						<TableRow>
							{headers.map((h, i) => (
								<TableCell key={i} align={i === 0 ? "left" : "right"}>
									{h}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.map((r, i) => (
							<TableRow key={i}>
								{Object.values(r).map((v, j) => (
									<TableCell
										key={j}
										align={
											j === 0
												? "left"
												: r.Metric.toLowerCase().includes("felony voting rights")
												? "center"
												: "right"
										}>
										{v}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
}
