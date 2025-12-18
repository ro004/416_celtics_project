import {
	Box,
	Modal,
	Paper,
	Typography,
	IconButton,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	TablePagination,
	CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useMemo, useState } from "react";
import { getRegisteredVotersByCounty } from "../../api/voters";

export default function RegisteredVotersModal({ open, countyName, onClose }) {
	const [party, setParty] = useState(""); // "" | "Dem" | "Rep"
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const [rows, setRows] = useState([]);
	const [total, setTotal] = useState(0);

	const [loading, setLoading] = useState(false);
	const [err, setErr] = useState("");

	// Reset paging when county or party changes
	useEffect(() => {
		setPage(0);
	}, [countyName, party]);

	useEffect(() => {
		if (!open || !countyName) return;

		let cancelled = false;
		async function run() {
			setLoading(true);
			setErr("");

			try {
				const data = await getRegisteredVotersByCounty({
					countyName,
					party,
					page,
					size: rowsPerPage,
				});

				if (cancelled) return;

				setRows(Array.isArray(data?.voters) ? data.voters : []);
				setTotal(typeof data?.totalElements === "number" ? data.totalElements : 0);
			} catch (e) {
				if (!cancelled) {
					setRows([]);
					setTotal(0);
					setErr(e?.message || "Failed to load voters");
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		}

		run();
		return () => {
			cancelled = true;
		};
	}, [open, countyName, party, page, rowsPerPage]);

	const title = useMemo(() => {
		if (!countyName) return "Registered Voters";
		return `Registered Voters — ${countyName} County`;
	}, [countyName]);

	return (
		<Modal open={open} onClose={onClose}>
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: "85vw",
					maxWidth: 1100,
					height: "80vh",
					outline: "none",
				}}>
				<Paper
					sx={{
						height: "100%",
						p: 2,
						display: "flex",
						flexDirection: "column",
						overflow: "hidden",
					}}>
					<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
						<Typography variant="h6">{title}</Typography>
						<IconButton onClick={onClose}>
							<CloseIcon />
						</IconButton>
					</Box>

					<Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 1 }}>
						<FormControl size="small" sx={{ minWidth: 200 }}>
							<InputLabel>Party Filter</InputLabel>
							<Select value={party} label="Party Filter" onChange={(e) => setParty(e.target.value)}>
								<MenuItem value="">All</MenuItem>
								<MenuItem value="Dem">Democratic</MenuItem>
								<MenuItem value="Rep">Republican</MenuItem>
							</Select>
						</FormControl>

						{loading && <CircularProgress size={20} />}
						{err && (
							<Typography variant="body2" sx={{ color: "error.main" }}>
								{err}
							</Typography>
						)}
					</Box>

					<Box sx={{ flex: 1, overflow: "auto" }}>
						<Table size="small" stickyHeader>
							<TableHead>
								<TableRow>
									<TableCell>Registered Voter Name</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{rows.map((v, idx) => (
									<TableRow key={`${page}-${idx}`}>
										<TableCell>{v.name || "—"}</TableCell>
									</TableRow>
								))}

								{!loading && rows.length === 0 && (
									<TableRow>
										<TableCell>No voters found.</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</Box>

					<Box sx={{ flexShrink: 0 }}>
						<TablePagination
							component="div"
							count={total}
							page={page}
							onPageChange={(_, p) => setPage(p)}
							rowsPerPage={rowsPerPage}
							onRowsPerPageChange={(e) => {
								setRowsPerPage(parseInt(e.target.value, 10));
								setPage(0);
							}}
							rowsPerPageOptions={[10, 15, 20]}
						/>
					</Box>
				</Paper>
			</Box>
		</Modal>
	);
}
