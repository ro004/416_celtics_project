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

export default function CategoryTable({ category = "provisional", rowsData }) {
	const codes = CATEGORY_COLUMNS[category] || CATEGORY_COLUMNS.provisional;

	let rows = [];
	if (category === "provisional") {
		rows = Array.isArray(rowsData)
			? rowsData.map((r) => {
					const row = {
						region: r.juris_name,

						E2a: Number(r.prov_rejected_total_detail),
						E2b: Number(r.prov_rejected_not_registered),
						E2c: Number(r.prov_rejected_wrong_jurisdiction),
						E2d: Number(r.prov_rejected_wrong_precinct),
						E2e: Number(r.prov_rejected_no_id),
						E2f: Number(r.prov_rejected_incomplete),
						E2g: Number(r.prov_rejected_ballot_missing),
						E2h: Number(r.prov_rejected_no_signature),
						E2i: Number(r.prov_rejected_bad_signature),
						Other: 0,
					};

					// total (sum of E2 columns)
					row.total =
						row.E2a +
						row.E2b +
						row.E2c +
						row.E2d +
						row.E2e +
						row.E2f +
						row.E2g +
						row.E2h +
						row.E2i +
						row.Other;

					return row;
			  })
			: [];
	} else if (category === "active") {
		rows = Array.isArray(rowsData)
			? rowsData.map((r) => {
					const row = {
						region: r.juris_name,
						Active: Number(r.a12_active),
						Inactive: Number(r.a12_inactive),
					};
					row.total = row.Active + row.Inactive;
					return row;
			  })
			: [];
	} else if (category === "mail_rejects") {
		rows = Array.isArray(rowsData)
			? rowsData.map((r) => {
					const row = {
						region: r.juris_name,
						C9b: Number(r.C9b),
						C9c: Number(r.C9c),
						C9d: Number(r.C9d),
						C9e: Number(r.C9e),
						C9f: Number(r.C9f),
						C9g: Number(r.C9g),
						C9h: Number(r.C9h),
						C9i: Number(r.C9i),
						C9j: Number(r.C9j),
						C9k: Number(r.C9k),
						C9l: Number(r.C9l),
						C9m: Number(r.C9m),
						C9n: Number(r.C9n),
						C9o: Number(r.C9o),
						C9p: Number(r.C9p),
						C9q: Number(r.C9q),
					};
					// total (sum of C9 columns)
					row.total =
						row.C9b +
						row.C9c +
						row.C9d +
						row.C9e +
						row.C9f +
						row.C9g +
						row.C9h +
						row.C9i +
						row.C9j +
						row.C9k +
						row.C9l +
						row.C9m +
						row.C9n +
						row.C9o +
						row.C9p +
						row.C9q;
					return row;
			  })
			: [];
	}

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(3);

	const handleChangePage = (event, newPage) => setPage(newPage);
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	return (
		<>
			<TableContainer component={Paper} sx={{ overflowX: "auto", overflowY: "hidden", pb: 6 }}>
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
								<TableCell sx={{ whiteSpace: "nowrap" }}>{row.region}</TableCell>

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
				rowsPerPageOptions={[3]}
				sx={{ overflow: "hidden" }}
			/>
		</>
	);
}
