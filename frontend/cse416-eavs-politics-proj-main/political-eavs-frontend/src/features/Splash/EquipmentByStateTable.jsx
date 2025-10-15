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

export default function EquipmentByStateTable({ onSelectState }) {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);

	const filteredStates = usStates.features.filter((f) => f.id !== "11" && f.id !== "72");
	const rows = filteredStates.map((f) => {
		const row = { state: f.properties.name };
		equipmentCategories.forEach((cat) => (row[cat] = Math.floor(Math.random() * 9000 + 1000)));
		return row;
	});

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
