// VoterRegistrationTable.jsx
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Typography,
	TablePagination,
} from "@mui/material";
import { useState } from "react";

export default function VoterRegistrationTable({ rowsData = [] }) {
	const [page, setPage] = useState(0);
	const [rpp, setRpp] = useState(10);

	return (
		<Paper sx={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
			<Typography variant="subtitle1" sx={{ mb: 1 }}>
				Voter Registration by County
			</Typography>

			<TableContainer sx={{ flex: 1, overflowX: "auto", overflowY: "hidden" }}>
				<Table size="small" stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell>County</TableCell>
							<TableCell align="right">Total Registered Voters</TableCell>
							<TableCell align="right">Democratic</TableCell>
							<TableCell align="right">Republican</TableCell>
							<TableCell align="right">Independent</TableCell>
							<TableCell align="right">Other</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{rowsData.slice(page * rpp, page * rpp + rpp).map((r, i) => (
							<TableRow key={i}>
								<TableCell>{r.county.toUpperCase()} COUNTY</TableCell>
								<TableCell align="right">{r.registered_total.toLocaleString()}</TableCell>
								<TableCell align="right">{r.democratic.toLocaleString()}</TableCell>
								<TableCell align="right">{r.republican.toLocaleString()}</TableCell>
								<TableCell align="right">{r.independent.toLocaleString()}</TableCell>
								<TableCell align="right">{r.other.toLocaleString()}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<TablePagination
				component="div"
				count={rowsData.length}
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
