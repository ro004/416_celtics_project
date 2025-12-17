//ComparisonTable.jsx
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";
//import { useEffect, useState } from "react";
// import { getDelawareData, getSouthCarolinaData } from "../../api/stateVotes";

export default function ComparisonTable({ mode, data }) {
	let headers = [];
	let rows = [];

	// Data states for each state that can show up in comparison tables
	// const [delawareData, setDelawareData] = useState(null);
	// const [southCarolinaData, setSouthCarolinaData] = useState(null);
	// const [coloradoData, setColoradoData] = useState(null);

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
					Metric: "Opt-In State",
					RegAbs: "—",
					RegPct: "—",
					TurnAbs: "—",
					TurnPct: "—",
				},
				{
					Metric: "Opt-Out State",
					RegAbs: "—",
					RegPct: "—",
					TurnAbs: "—",
					TurnPct: "—",
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
					Metric: "Opt-In State",
					RegAbs: "—",
					RegPct: "—",
					TurnAbs: "—",
					TurnPct: "—",
				},
				{
					Metric: "Opt-Out State",
					RegAbs: "—",
					RegPct: "—",
					TurnAbs: "—",
					TurnPct: "—",
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
					Metric: "Republican State",
					TotAbs: "—",
					TotPct: "—",
					InAbs: "—",
					InPct: "—",
					MailAbs: "—",
					MailPct: "—",
				},
				{
					Metric: "Democratic State",
					TotAbs: "—",
					TotPct: "—",
					InAbs: "—",
					InPct: "—",
					MailAbs: "—",
					MailPct: "—",
				},
			];
			break;

		// --- Default fallback (GUI-15 etc.) ---
		default:
			headers = ["Metric", "Republican State", "Democratic State"];
			if (!data) {
				rows = [];
				break;
			}

			rows = [
				{
					Metric: "Felony Voting Rights",
					Republican: data.republican.felonyRights,
					Democratic: data.democratic.felonyRights,
				},
				{
					Metric: "% Mail Ballots",
					Republican: `${data.republican.percentMail.toFixed(1)}%`,
					Democratic: `${data.democratic.percentMail.toFixed(1)}%`,
				},
				{
					Metric: "% Drop Box Ballots",
					Republican: `${data.republican.percentDropbox.toFixed(1)}%`,
					Democratic: `${data.democratic.percentDropbox.toFixed(1)}%`,
				},
				{
					Metric: "Voter Turnout",
					Republican: `${data.republican.percentTurnout.toFixed(1)}%`,
					Democratic: `${data.democratic.percentTurnout.toFixed(1)}%`,
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
