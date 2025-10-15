// src/features/State/CategoryTable.jsx
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TablePagination,
	Paper,
} from "@mui/material";
import { useState } from "react";

const CATEGORY_COLUMNS = {
	provisional: ["E2a", "E2b", "E2c", "E2d", "E2e", "E2f", "E2g", "E2h", "E2i", "Other"],
	active: ["Active", "Inactive"],
	deletions: ["A12b", "A12c", "A12d", "A12e", "A12f", "A12g", "A12h"],
	mail_rejects: [
		"C9b",
		"C9c",
		"C9d",
		"C9e",
		"C9f",
		"C9g",
		"C9h",
		"C9i",
		"C9j",
		"C9k",
		"C9l",
		"C9m",
		"C9n",
		"C9o",
		"C9p",
		"C9q",
	],
};

export default function CategoryTable({ category = "provisional" }) {
	const codes = CATEGORY_COLUMNS[category] || CATEGORY_COLUMNS.provisional;
	const rows = Array.from({ length: 10 }, (_, i) => {
		const row = { region: `Region ${i + 1}` };
		let sum = 0;
		codes.forEach((c) => {
			const val = Math.floor(Math.random() * 200);
			row[c] = val;
			sum += val;
		});
		row.total = sum;
		return row;
	});

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(3);

	const handleChangePage = (event, newPage) => setPage(newPage);
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	return (
		<>
			<TableContainer component={Paper} sx={{ overflowX: "auto" }}>
				<Table size="small" stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell>Region</TableCell>
							{codes.map((code) => (
								<TableCell key={code} align="right">
									{code}
								</TableCell>
							))}
							<TableCell align="right">Total</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => (
							<TableRow key={idx}>
								<TableCell>{row.unit}</TableCell>
								{codes.map((code) => (
									<TableCell key={code} align="right">
										{row[code]}
									</TableCell>
								))}
								<TableCell align="right">{row.total}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<TablePagination
				component="div"
				count={rows.length}
				page={page}
				onPageChange={handleChangePage}
				rowsPerPage={rowsPerPage}
				onRowsPerPageChange={handleChangeRowsPerPage}
				rowsPerPageOptions={[3, 5]}
				sx={{ overflow: "hidden" }}
			/>
		</>
	);
}
