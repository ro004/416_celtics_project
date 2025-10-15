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

const providers = ["ES&S", "Dominion", "Hart", "MicroVote", "Unisyn"];
const models = ["Model X", "Model Y", "Model Z"];

export default function EquipmentSummaryTable() {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(3);

	const rows = [];
	for (let p of providers) {
		for (let m of models) {
			rows.push({
				provider: p,
				model: m,
				quantity: Math.floor(Math.random() * 2000 + 200),
				age: Math.floor(Math.random() * 10 + 1),
				os: "Embedded Linux",
				certification: [
					"VVSG 2.0 certified",
					"VVSG 2.0 applied",
					"VVSG 1.1 certified",
					"VVSG 1.0 certified",
					"Not Certified",
				][Math.floor(Math.random() * 5)],
				scanRate: `${Math.floor(Math.random() * 50) + 50}%`,
				errorRate: `${(Math.random() * 2).toFixed(2)}%`,
				reliability: `${Math.floor(Math.random() * 10 + 80)}%`,
				qualityMeasure: `${Math.floor(Math.random() * 10 + 80)}%`,
			});
		}
	}

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
				U.S. Voting Equipment Summary (2024)
			</Typography>

			{/* Table section scrolls independently */}
			<Box sx={{ flex: 1, overflowY: "auto", overflowX: "auto" }}>
				<TableContainer sx={{ overflow: "visible" }}>
					<Table size="small" stickyHeader>
						<TableHead>
							<TableRow>
								<TableCell>Provider</TableCell>
								<TableCell>Model</TableCell>
								<TableCell>Quantity</TableCell>
								<TableCell>Age (yrs)</TableCell>
								<TableCell>OS</TableCell>
								<TableCell>Certification</TableCell>
								<TableCell>Scan Rate</TableCell>
								<TableCell>Error Rate</TableCell>
								<TableCell>Reliability</TableCell>
								<TableCell>Quality Measure</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((r, i) => (
								<TableRow key={i}>
									<TableCell>{r.provider}</TableCell>
									<TableCell>{r.model}</TableCell>
									<TableCell align="right">{r.quantity}</TableCell>
									<TableCell align="right">{r.age}</TableCell>
									<TableCell>{r.os}</TableCell>
									<TableCell>{r.certification}</TableCell>
									<TableCell align="right">{r.scanRate}</TableCell>
									<TableCell align="right">{r.errorRate}</TableCell>
									<TableCell align="right">{r.reliability}</TableCell>
									<TableCell align="right">{r.qualityMeasure}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>

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
