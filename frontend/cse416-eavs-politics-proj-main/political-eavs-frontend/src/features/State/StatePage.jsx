import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	AppBar,
	Toolbar,
	Typography,
	Box,
	Paper,
	Button,
	FormControl,
	FormControlLabel,
	Switch,
	InputLabel,
	Select,
	MenuItem,
	Tabs,
	Tab,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import usStates from "../../data/us-states.json";
import countyBoundaries from "../../data/county-boundaries.json";
import StateMap from "./StateMap";
import CategoryBarChart from "./CategoryBarChart";
import CategoryTable from "./CategoryTable";
import EquipmentTable from "./EquipmentTable";
import {
	getMailRejectSummaryandRegionsList,
	getActiveVoterSummaryandRegionsList,
	getPollbookDeletionSummaryandRegionsList,
	getProvBallotSummaryandRegionsList,
} from "../../api/eavsCategories";
//import { getStateVotingEquipTable } from "../../api/equipment";

const DETAILED_STATES = ["CO", "DE", "SC", "OK"];
const POLITICAL_PARTY_DETAILED = ["DE", "SC"];
const FIPS_TO_ABBR = { "08": "CO", 10: "DE", 45: "SC", 40: "OK" };
const TAB_LABELS = {
	provisional: "Provisional Data",
	active: "Active Voters",
	deletions: "Pollbook Deletions",
	mail_rejects: "Mail Ballot Rejections",
};

// styled red reset button
const ResetButton = styled(Button)(({ theme }) => ({
	backgroundColor: theme.palette.error.main,
	color: "#fff",
	"&:hover": {
		backgroundColor: theme.palette.error.dark,
	},
}));

// Fit map to state
function FitBounds({ feature }) {
	const map = useMap();
	useEffect(() => {
		if (feature) {
			const layer = L.geoJSON(feature);
			map.fitBounds(layer.getBounds());
		}
	}, [map, feature]);
	return null;
}

export default function StatePage() {
	const { id } = useParams(); // e.g., "08" for CO
	const navigate = useNavigate();

	const stateFeature = usStates.features.find((f) => f.id === id);
	const isDetailed = DETAILED_STATES.includes(FIPS_TO_ABBR[id]);
	const isPoliticalPartyDetailed = POLITICAL_PARTY_DETAILED.includes(FIPS_TO_ABBR[id]);

	// Header controls
	const [category, setCategory] = useState("provisional"); // drives choropleth type later
	const [equipOverlay, setEquipOverlay] = useState("none"); // "none" | "type"
	const [tab, setTab] = useState("provisional"); // right-column tabs
	const [showBubbles, setShowBubbles] = useState(false);

	// Data states for barchart / table / choropleth
	const [categorySummary, setCategorySummary] = useState(null); // GUI-3 data for chart
	const [categoryRegions, setCategoryRegions] = useState([]); // GUI-4 data for table
	const [categoryTotal, setCategoryTotal] = useState(null); // GUI-5 total for choropleth

	// Data states for state voting equipment table
	// const [equipTableData, setEquipTableData] = useState([]); // GUI-6 data for equipment table

	// mock CVAP values for now
	const registeredVoters = 1000000;
	const cvap = 1200000;
	const cvapPct = ((registeredVoters / cvap) * 100).toFixed(1);

	// fetch voting equipment table data on mount
	// useEffect(() => {
	// 	const fetchEquipTable = async () => {
	// 		try {
	// 			const data = await getStateVotingEquipTable(id);
	// 			setEquipTableData(data || []);
	// 		} catch (err) {
	// 			console.error("Failed to load equipment table:", err);
	// 		}
	// 	};

	// 	fetchEquipTable();
	// }, [id]);

	// fetch categorical data based on drop-down selection (GUI 3-5/7-9)
	useEffect(() => {
		const fetchCategoryData = async () => {
			try {
				let data;

				switch (category) {
					case "provisional":
						data = await getProvBallotSummaryandRegionsList(id, 2024);
						break;

					case "active":
						data = await getActiveVoterSummaryandRegionsList(id, 2024);
						break;

					case "deletions":
						data = await getPollbookDeletionSummaryandRegionsList(id, 2024);
						break;

					case "mail_rejects":
						data = await getMailRejectSummaryandRegionsList(id, 2024);
						break;

					default:
						return;
				}

				if (data) {
					setCategorySummary(data.summary || {});
					setCategoryRegions(data.counties || []);
					setCategoryTotal(data.counties || null);
				}
			} catch (err) {
				console.error(`Failed to load ${category} data:`, err);
				setCategorySummary({});
				setCategoryRegions([]);
				setCategoryTotal(null);
			}
		};

		fetchCategoryData();
	}, [id, category]);

	return (
		<Box sx={{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column" }}>
			{/* Header */}
			<AppBar position="static">
				<Toolbar sx={{ gap: 2 }}>
					<Button color="inherit" onClick={() => navigate("/")}>
						← Splash Page
					</Button>

					<Typography variant="h6" sx={{ flexGrow: 1 }}>
						{stateFeature ? stateFeature.properties.name : id} — Display State
					</Typography>

					{/*UC-18 Bubble Chart Display*/}
					{id === "40" && (
						<FormControlLabel
							control={
								<Switch
									checked={showBubbles}
									onChange={() => setShowBubbles(!showBubbles)}
									color="primary"
								/>
							}
							label="Show Voter Registration Bubbles"
						/>
					)}

					{/* EAVS Category */}
					<FormControl sx={{ minWidth: 220 }} size="small" variant="outlined">
						<InputLabel id="eavs-label">2024 EAVS Category</InputLabel>
						<Select
							labelId="eavs-label"
							value={category}
							label="2024 EAVS Category"
							onChange={(e) => setCategory(e.target.value)}>
							<MenuItem value="provisional">Provisional Ballots</MenuItem>
							<MenuItem value="active">Active Voters</MenuItem>
							<MenuItem value="deletions">Pollbook Deletions</MenuItem>
							<MenuItem value="mail_rejects">Mail Ballot Rejections</MenuItem>
						</Select>
					</FormControl>

					{/* Voting Equipment Overlay (UC-10) */}
					{isDetailed && (
						<FormControl sx={{ minWidth: 160 }} size="small" variant="outlined">
							<InputLabel id="equip-label">Equipment Overlay</InputLabel>
							<Select
								labelId="equip-label"
								value={equipOverlay}
								label="Equipment Overlay"
								onChange={(e) => setEquipOverlay(e.target.value)}>
								<MenuItem value="none">None</MenuItem>
								<MenuItem value="type">Type</MenuItem>
							</Select>
						</FormControl>
					)}

					<ResetButton variant="contained">Reset</ResetButton>
				</Toolbar>
			</AppBar>

			{/* Body */}
			<Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
				{/* Left column: single map component that changes mode */}
				<Box sx={{ flex: 1, p: 1 }}>
					<Paper sx={{ height: "100%", overflow: "hidden" }}>
						{stateFeature && (
							<StateMap
								stateFeature={stateFeature}
								stateFips={id}
								isDetailed={isDetailed}
								dataCategory={category}
								equipmentMode={equipOverlay}
								choroplethTotal={categoryTotal}
								countyFeatures={countyBoundaries.features}
								showBubbles={showBubbles}
							/>
						)}
					</Paper>
				</Box>

				{/* Right column */}
				<Box sx={{ flex: 1, p: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
					{/* CVAP (political party detailed only) */}
					{isPoliticalPartyDetailed && (
						<Paper sx={{ p: 2, mb: 1, flex: "0 0 auto" }}>
							<Typography variant="body2">
								% CVAP Eligible to Vote: <strong>{cvapPct}%</strong>
							</Typography>
						</Paper>
					)}

					{/* Tabs for right column (avoid crowding) */}
					<Paper sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
						<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
							<Tabs
								value={tab}
								onChange={(_, v) => setTab(v)}
								textColor="inherit"
								indicatorColor="secondary"
								variant="scrollable"
								scrollButtons="auto">
								<Tab value="provisional" label={TAB_LABELS[category] || "Provisional Data"} />
								<Tab value="equipment" label="Equipment Summary" />
							</Tabs>
						</Box>

						{/* Tab panels */}
						<Box
							sx={{
								flex: 1,
								display: tab === "provisional" ? "flex" : "none",
								flexDirection: "column",
								overflow: "hidden",
								p: 1,
								gap: 1,
							}}>
							<Paper sx={{ flex: 1.65, p: 2, minHeight: 0, overflow: "hidden" }}>
								<Typography variant="subtitle1">
									{category === "provisional"
										? "Provisional Ballots — Bar Chart"
										: category === "active"
										? "Active Voters — Bar Chart"
										: category === "deletions"
										? "Pollbook Deletions — Bar Chart"
										: "Mail Ballot Rejections — Bar Chart"}
								</Typography>
								<CategoryBarChart category={category} data={categorySummary} />
							</Paper>
							<Paper
								sx={{
									flex: 1,
									p: 2,
									minHeight: 0,
									overflow: "auto",
									display: "flex",
									flexDirection: "column",
								}}>
								<Typography variant="subtitle1" sx={{ mb: 1 }}>
									{category === "provisional"
										? "Provisional Ballots by Region"
										: category === "active"
										? "Active Voter Summary by Region"
										: category === "deletions"
										? "Pollbook Deletions by Region"
										: "Mail Ballot Rejections by Region"}
								</Typography>
								<CategoryTable
									category={category}
									isPolitical={isPoliticalPartyDetailed}
									rowsData={categoryRegions}
								/>
							</Paper>
						</Box>

						<Box
							sx={{
								flex: 1,
								display: tab === "equipment" ? "flex" : "none",
								flexDirection: "column",
								overflow: "hidden",
								p: 1,
							}}>
							<EquipmentTable /** rowsData={equipTableData} **/ />
						</Box>
					</Paper>
				</Box>
			</Box>
		</Box>
	);
}
