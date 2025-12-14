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

// mock rows; later, load from backend
// const ROWS = [
// 	{
// 		makeModel: "Acme ScanMaster 3000",
// 		available: true,
// 		quantity: 420,
// 		type: "Scanner",
// 		description: "Precinct-count optical scanner",
// 		ageYears: 5,
// 		os: "Embedded Linux",
// 		certification: "VVSG 2.0 certified",
// 		scanRate: "60%",
// 		errorRate: "0.3%",
// 		reliability: "82%",
// 	},
// 	{
// 		makeModel: "Votex Touch-1",
// 		available: false,
// 		quantity: 180,
// 		type: "DRE no VVPAT",
// 		description: "Legacy touchscreen DRE",
// 		ageYears: 12,
// 		os: "Windows CE",
// 		certification: "VVSG 1.0 certified",
// 		scanRate: "70%",
// 		errorRate: "0.8%",
// 		reliability: "84%",
// 	},
// 	{
// 		makeModel: "Electra Mark-B",
// 		available: true,
// 		quantity: 260,
// 		type: "Ballot Marking Device",
// 		description: "ADA-compliant BMD",
// 		ageYears: 3,
// 		os: "Android",
// 		certification: "VVSG 2.0 applied",
// 		scanRate: "75%",
// 		errorRate: "0.2%",
// 		reliability: "88%",
// 	},
// ];

const COLS = [
	{ key: "makeModel", label: "Make / Model" },
	{ key: "quantity", label: "Qty", align: "right" },
	{ key: "type", label: "Type" },
	{ key: "description", label: "Description" },
	{ key: "ageYears", label: "Age (yrs)", align: "right" },
	{ key: "os", label: "OS" },
	{ key: "certification", label: "Certification" },
	{ key: "scanRate", label: "Scan Rate" },
	{ key: "errorRate", label: "Error Rate" },
	{ key: "reliability", label: "Reliability" },
];

export default function EquipmentTable({ rows = [] }) {
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
						{rows.slice(page * rpp, page * rpp + rpp).map((row, i) => (
							<TableRow key={i}>
								<TableCell sx={{ color: row.available ? "inherit" : "error.main", fontWeight: 500 }}>
									{row.makeModel}
								</TableCell>
								<TableCell align="right">{row.quantity}</TableCell>
								<TableCell>{row.type}</TableCell>
								<TableCell>{row.description}</TableCell>
								<TableCell align="right">{row.ageYears}</TableCell>
								<TableCell>{row.os}</TableCell>
								<TableCell>{row.certification}</TableCell>
								<TableCell align="right">{row.scanRate}</TableCell>
								<TableCell align="right">{row.errorRate}</TableCell>
								<TableCell align="right">{row.reliability}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<TablePagination
				component="div"
				count={rows.length}
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
