import { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import {
	AppBar,
	Toolbar,
	Typography,
	Box,
	Divider,
	Button,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import usStates from "../../data/us-states.json";
import L from "leaflet";

import EquipmentByStateTable from "./EquipmentByStateTable";
import EquipmentAgeChoropleth from "./EquipmentAgeChoropleth";
import EquipmentSummaryTable from "./EquipmentSummaryTable";
import EquipmentByStateModal from "./EquipmentByStateModal";
import CompareModal from "./CompareModal";
import { getVotingEquipmentByState } from "../../api/equipment";

// styled red reset button
const ResetButton = styled(Button)(({ theme }) => ({
	backgroundColor: theme.palette.error.main,
	color: "#fff",
	"&:hover": {
		backgroundColor: theme.palette.error.dark,
	},
}));

export default function SplashPage() {
	const navigate = useNavigate();
	const [mapMode, setMapMode] = useState("default"); // "default" | "age"
	const [isEquipmentTable, setIsEquipmentTable] = useState(false); // false = nothing, true = equipment table
	const [isSummary, setSummary] = useState(false); // false = nothing, true = equipment summary table
	const [selectedEquipTableState, setSelectedEquipTableState] = useState(null);
	const [compareMode, setCompareMode] = useState(null);

	// Data state for equipment by state table (GUI-12)
	const [equipmentByStateRows, setEquipmentByStateRows] = useState([]);

	// fetch equipment by state data (GUI-12) on mount
	useEffect(() => {
		const fetchEquipment = async () => {
			try {
				const data = await getVotingEquipmentByState(2024);
				setEquipmentByStateRows(data.states || []);
			} catch (err) {
				console.error("Failed to load GUI-12 equipment data", err);
				setEquipmentByStateRows([]);
			}
		};

		fetchEquipment();
	}, []);

	// record stacking order (so the most recent toggle appears on top)
	const [stackOrder, setStackOrder] = useState([]);

	const onEachState = (feature, layer) => {
		layer.on({
			click: () => {
				const stateId = feature.id;
				navigate(`/state/${stateId}`);
			},
		});
	};

	const togglePanel = (panel) => {
		setStackOrder((prev) => {
			const exists = prev.includes(panel);
			if (exists) return prev.filter((p) => p !== panel); // remove if toggled off
			return [...prev.filter((p) => p !== panel), panel]; // move to top if toggled on
		});
		if (panel === "byState") setIsEquipmentTable((prev) => !prev);
		if (panel === "summary") setSummary((prev) => !prev);
	};

	const defaultStyle = (feature) => {
		const abbr = feature.id;
		if (["08", "10", "40", "45"].includes(abbr)) {
			return {
				fillColor: "#2c6e2cff",
				weight: 3,
				color: "#340f64ff",
				fillOpacity: 0.6,
			};
		}
		return {
			fillColor: "transparent",
			weight: 1,
			color: "#000000ff",
			fillOpacity: 0,
		};
	};

	return (
		<Box sx={{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column" }}>
			{/* Header */}
			<AppBar position="static" sx={{ flexShrink: 0 }}>
				<Toolbar sx={{ minHeight: 64, overflow: "hidden" }}>
					<Typography variant="h6" sx={{ flexGrow: 1 }}>
						Celtics Voter Analysis Project
					</Typography>

					{/* Toggle button: switch UC-12 table on/off */}
					<Button
						variant={"outlined"}
						color="inherit"
						sx={{ mr: 2 }}
						onClick={() => {
							togglePanel("byState");
						}}>
						{isEquipmentTable ? "Hide Table" : "View 2024 Equipment by State"}
					</Button>

					{/* Toggle button: switch UC-13 summary table on/off */}
					<Button
						variant={"outlined"}
						color="inherit"
						sx={{ mr: 2 }}
						onClick={() => {
							togglePanel("summary");
						}}>
						{isSummary ? "Hide Summary" : "View 2024 US Equipment Summary"}
					</Button>

					{/* Dropdown for map mode */}
					<FormControl size="small" sx={{ mr: 2, minWidth: 200 }}>
						<InputLabel sx={{ color: "#fff" }}>Map Mode</InputLabel>
						<Select
							value={mapMode}
							label="Map Mode"
							onChange={(e) => setMapMode(e.target.value)}
							sx={{
								color: "#fff",
								"& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
								"&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
								"& .MuiSvgIcon-root": { color: "white" },
							}}>
							<MenuItem value="default">Default Map</MenuItem>
							<MenuItem value="age">Average Age of Voting Equipment</MenuItem>
						</Select>
					</FormControl>

					{/* Dropdown for Compare tables */}
					<FormControl size="small" sx={{ mr: 2, minWidth: 200 }}>
						<InputLabel sx={{ color: "#fff" }}>COMPARE:</InputLabel>
						<Select
							value={compareMode || ""}
							label="Compare"
							onChange={(e) => setCompareMode(e.target.value)}
							sx={{
								color: "#fff",
								"& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
								"&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
								"& .MuiSvgIcon-root": { color: "white" },
							}}>
							<MenuItem value="felony-rights">Republican vs Democratic State</MenuItem> {/* GUI-15 */}
							<MenuItem value="opt-in-out">Opt-In vs Opt-Out Voter Registration</MenuItem> {/* GUI-21 */}
							<MenuItem value="reg-comp">Republican vs Democratic Voter Registration</MenuItem>{" "}
							{/* GUI-22 */}
							<MenuItem value="early-voting">Republican vs Democratic Early Voting</MenuItem>{" "}
							{/* GUI-23 */}
						</Select>
					</FormControl>

					<ResetButton variant="contained">Reset</ResetButton>
				</Toolbar>
			</AppBar>

			{/* Main body */}
			<Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
				{/* Sidebar (equipment state table, equipment state summary, etc) */}
				<Box
					sx={{
						width: "30%",
						height: "100%",
						bgcolor: "background.paper",
						p: 2,
						overflow: "hidden",
						display: "flex",
						flexDirection: "column",
					}}>
					<Typography variant="subtitle1">Filters</Typography>
					<Divider />
					{/* Stack panels — equal width and height when both active */}
					{stackOrder.length > 0 && (
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								flex: 1,
								overflow: "hidden",
								gap: 1,
							}}>
							{["byState", "summary"].map((panel) => {
								const equalHeight = `50%`;

								if (panel === "byState" && isEquipmentTable)
									return (
										<Box
											key="byState"
											sx={{
												flex: `0 0 ${equalHeight}`,
												display: "flex",
												flexDirection: "column",
											}}>
											<EquipmentByStateTable
												rowsData={equipmentByStateRows}
												onSelectState={(name) => setSelectedEquipTableState(name)}
											/>
										</Box>
									);

								if (panel === "summary" && isSummary)
									return (
										<Box
											key="summary"
											sx={{
												flex: `0 0 ${equalHeight}`,
												display: "flex",
												flexDirection: "column",
											}}>
											<EquipmentSummaryTable />
										</Box>
									);

								return null;
							})}
						</Box>
					)}

					{!isEquipmentTable && !isSummary && (
						<Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
							Use the buttons above to toggle data panels.
						</Typography>
					)}
				</Box>

				{/* Map (default or equipment age choropleth */}
				<Box sx={{ flex: 1, height: "100%" }}>
					{mapMode === "default" ? (
						<MapContainer center={[37.8, -96]} zoom={5} style={{ height: "100%", width: "100%" }}>
							<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

							<GeoJSON data={usStates} style={defaultStyle} onEachFeature={onEachState} />

							{/* Legend appears only in age mode */}
						</MapContainer>
					) : (
						<EquipmentAgeChoropleth />
					)}
				</Box>

				<EquipmentByStateModal
					open={!!selectedEquipTableState}
					stateName={selectedEquipTableState}
					onClose={() => setSelectedEquipTableState(null)}
				/>

				<CompareModal open={!!compareMode} mode={compareMode} onClose={() => setCompareMode(null)} />
			</Box>
		</Box>
	);
}
