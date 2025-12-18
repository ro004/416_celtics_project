// EquipmentTable.jsx
import {
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
import MOCK_EQUIPMENT_DATA from "./EquipmentSummaryData";

// mock rows; later, load from backend
const ROWS = MOCK_EQUIPMENT_DATA;
const COLS = [
	{ key: "makeModel", label: "Make & Model" },
	{ key: "quantity", label: "Quantity", align: "right" },
	{ key: "equipmentType", label: "Equipment Type" },
	{ key: "age", label: "Age (Years)", align: "right" },
	{ key: "os", label: "Operating System" },
	{ key: "certification", label: "Certification" },
	{ key: "scanRate", label: "Scan Rate", align: "right" },
	{ key: "errorRate", label: "Error Rate", align: "right" },
	{ key: "reliability", label: "Reliability", align: "right" },
];

export default function EquipmentTable() {
	const [page, setPage] = useState(0);
	const [rpp, setRpp] = useState(5);

	return (
		<Paper sx={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
			<Typography variant="subtitle1" sx={{ p: 2, pb: 0 }}>
				Voting Equipment Summary
			</Typography>

			<TableContainer sx={{ flex: 1, overflow: "auto" }}>
				<Table size="small" stickyHeader>
					<TableHead>
						<TableRow>
							{COLS.map((c) => (
								<TableCell key={c.key} align={c.align || "left"}>
									{c.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{ROWS.slice(page * rpp, page * rpp + rpp).map((row, i) => (
							<TableRow key={i}>
								{/* Make & Model (red if discontinued) */}
								<TableCell
									sx={{
										color: row.discontinued ? "error.main" : "inherit",
										fontWeight: 500,
									}}>
									{row.manufacturer} {row.model}
								</TableCell>

								<TableCell align="right">{row.quantity}</TableCell>
								<TableCell>{row.equipmentType}</TableCell>
								<TableCell align="right">{row.age}</TableCell>
								<TableCell>{row.os || "—"}</TableCell>
								<TableCell>{row.certification}</TableCell>
								<TableCell align="right">{row.scanRate || "—"}</TableCell>
								<TableCell align="right">{row.errorRate}</TableCell>
								<TableCell align="right">{row.reliability}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<TablePagination
				component="div"
				count={ROWS.length}
				page={page}
				onPageChange={(_, p) => setPage(p)}
				rowsPerPage={rpp}
				onRowsPerPageChange={(e) => {
					setRpp(parseInt(e.target.value, 10));
					setPage(0);
				}}
				rowsPerPageOptions={[5, 10]}
			/>
		</Paper>
	);
}
