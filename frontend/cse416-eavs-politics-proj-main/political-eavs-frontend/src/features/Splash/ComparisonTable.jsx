//ComparisonTable.jsx
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";
//import { useEffect, useState } from "react";
// import { getDelawareData, getSouthCarolinaData } from "../../api/stateVotes";

export default function ComparisonTable({ mode, data }) {
	// HARD GUARD: data shape must match mode
	const expectsArray = mode === "opt-in-out" || mode === "reg-comp" || mode === "early-voting";

	if ((expectsArray && !Array.isArray(data)) || (!expectsArray && Array.isArray(data))) {
		return (
			<Paper sx={{ p: 2 }}>
				<Typography variant="body2" color="text.secondary">
					Loading comparison data…
				</Typography>
			</Paper>
		);
	}

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
				"State / Policy",
				"Registered Voters (Absolute)",
				"Registration Rate (%)",
				"Turnout (Absolute)",
				"Turnout Rate (%)",
			];

			rows = Array.isArray(data)
				? data.map((r) => ({
						Metric: r.registrationPolicy,
						RegAbs: typeof r.registeredTotal === "number" ? r.registeredTotal.toLocaleString() : "—",
						RegPct: typeof r.registrationRate === "number" ? r.registrationRate.toFixed(1) + "%" : "—",
						TurnAbs: typeof r.ballotsCast === "number" ? r.ballotsCast.toLocaleString() : "—",
						TurnPct: typeof r.turnoutRate === "number" ? r.turnoutRate.toFixed(1) + "%" : "—",
				  }))
				: [];
			break;

		// --- GUI-22 ---
		case "reg-comp":
			headers = [
				"State / Party",
				"Registered Voters (Absolute)",
				"Registration Rate (%)",
				"Turnout (Absolute)",
				"Turnout Rate (%)",
			];

			rows = Array.isArray(data)
				? data.map((r) => ({
						Metric: `${r.state} (${r.party})`,
						RegAbs: r.registeredTotal ? r.registeredTotal.toLocaleString() : "—",
						RegPct: typeof r.registrationRate === "number" ? r.registrationRate.toFixed(1) + "%" : "—",
						TurnAbs: typeof r.ballotsCast === "number" ? r.ballotsCast.toLocaleString() : "—",
						TurnPct: typeof r.turnoutRate === "number" ? r.turnoutRate.toFixed(1) + "%" : "—",
				  }))
				: [];
			break;

		// --- GUI-23 ---
		case "early-voting":
			headers = [
				"State / Party",
				"Total Early Votes (Absolute)",
				"Early Voting Rate (%)",
				"In-Person Early (Absolute)",
				"In-Person Early (%)",
				"Mail Early (Absolute)",
				"Mail Early (%)",
			];

			rows = Array.isArray(data)
				? data.map((r) => ({
						Metric: `${r.state} (${r.party})`,
						TotAbs: typeof r.earlyTotalAbs === "number" ? r.earlyTotalAbs.toLocaleString() : "—",
						TotPct: typeof r.earlyVotingRate === "number" ? r.earlyVotingRate.toFixed(1) + "%" : "—",
						InAbs: typeof r.inPersonEarlyAbs === "number" ? r.inPersonEarlyAbs.toLocaleString() : "—",
						InPct: typeof r.inPersonEarlyRate === "number" ? r.inPersonEarlyRate.toFixed(1) + "%" : "—",
						MailAbs: typeof r.mailEarlyAbs === "number" ? r.mailEarlyAbs.toLocaleString() : "—",
						MailPct: typeof r.mailEarlyRate === "number" ? r.mailEarlyRate.toFixed(1) + "%" : "—",
				  }))
				: [];
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
					Republican: typeof data.republican.felonyRights === "string" ? data.republican.felonyRights : "—",
					Democratic: typeof data.democratic.felonyRights === "string" ? data.democratic.felonyRights : "—",
				},
				{
					Metric: "% Mail Ballots",
					Republican:
						typeof data.republican.percentMail === "number"
							? `${data.republican.percentMail.toFixed(1)}%`
							: "—",
					Democratic:
						typeof data.democratic.percentMail === "number"
							? `${data.democratic.percentMail.toFixed(1)}%`
							: "—",
				},
				{
					Metric: "% Drop Box Ballots",
					Republican:
						typeof data.republican.percentDropbox === "number"
							? `${data.republican.percentDropbox.toFixed(1)}%`
							: "—",
					Democratic:
						typeof data.democratic.percentDropbox === "number"
							? `${data.democratic.percentDropbox.toFixed(1)}%`
							: "—",
				},
				{
					Metric: "Voter Turnout",
					Republican:
						typeof data.republican.percentTurnout === "number"
							? `${data.republican.percentTurnout.toFixed(1)}%`
							: "—",
					Democratic:
						typeof data.democratic.percentTurnout === "number"
							? `${data.democratic.percentTurnout.toFixed(1)}%`
							: "—",
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
