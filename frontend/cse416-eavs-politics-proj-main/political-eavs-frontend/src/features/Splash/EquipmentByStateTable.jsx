import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TablePagination,
	Paper,
	Typography,
} from "@mui/material";
import { useState } from "react";
import usStates from "../../data/us-states.json";

const equipmentCategories = ["DRE no VVPAT", "DRE with VVPAT", "Ballot Marking Device", "Scanner"];

const STATE_NAME_BY_FIPS = new Map(usStates.features.map((f) => [f.id, f.properties.name]));

export default function EquipmentByStateTable({ onSelectState, rowsData = [] }) {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);

	const rows = Array.isArray(rowsData)
		? rowsData
				.filter((r) => r.state_fips && r.state_fips !== "11" && r.state_fips <= "56") // exclude DC and invalid
				.map((r) => ({
					state: STATE_NAME_BY_FIPS.get(r.state_fips),
					"DRE no VVPAT": Number(r.dre_no_vvpat_total),
					"DRE with VVPAT": Number(r.dre_with_vvpat_total),
					"Ballot Marking Device": Number(r.bmd_total),
					Scanner: Number(r.scanner_total),
				}))
		: [];

	return (
		<Paper
			sx={{
				bgcolor: "background.default",
				color: "text.primary",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				overflow: "hidden",
			}}>
			<Typography variant="subtitle1" sx={{ p: 2, pb: 1, fontWeight: 600 }}>
				Voting Equipment by State (2024)
			</Typography>

			{/* Table body scrolls independently */}
			<Box sx={{ flex: 1, overflowY: "auto", overflowX: "auto" }}>
				<TableContainer sx={{ overflow: "visible" }}>
					<Table size="small" stickyHeader>
						<TableHead>
							<TableRow>
								<TableCell align="left">State</TableCell>
								{equipmentCategories.map((c) => (
									<TableCell key={c} align="left">
										{c}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
								<TableRow key={i}>
									<TableCell
										onClick={() => onSelectState(row.state)}
										sx={{
											cursor: "pointer",
											color: "#2196f3",
											"&:hover": { textDecoration: "underline" },
										}}>
										{row.state}
									</TableCell>
									{equipmentCategories.map((c) => (
										<TableCell key={c} align="right">
											{row[c]}
										</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>

			{/* Pagination anchored at bottom, never scrolls */}
			<Box sx={{ flexShrink: 0 }}>
				<TablePagination
					component="div"
					count={rows.length}
					page={page}
					onPageChange={(_, p) => setPage(p)}
					rowsPerPage={rowsPerPage}
					onRowsPerPageChange={(e) => {
						setRowsPerPage(parseInt(e.target.value, 10));
						setPage(0);
					}}
					rowsPerPageOptions={[3, 5, 10]}
					sx={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
				/>
			</Box>
		</Paper>
	);
}
