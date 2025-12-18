const MOCK_EQUIPMENT_DATA = [
	// =========================
	// ES&S (very common)
	// =========================
	{
		manufacturer: "ES&S",
		model: "DS200",
		equipmentType: "Hand-Fed Optical Scanner",
		quantity: 1240,
		age: 14,
		os: "Linux",
		firmware: "EVS 6.5.0.0",
		certification: "VVSG 1.0 (2005)",
		scanRate: "11 ballots/min",
		errorRate: "0.002",
		reliability: "High",
		discontinued: false,
	},
	{
		manufacturer: "ES&S",
		model: "DS450",
		equipmentType: "Batch-Fed Optical Scanner",
		quantity: 430,
		age: 8,
		os: "Windows",
		firmware: "EVS 6.5.0.0",
		certification: "VVSG 1.0 (2005)",
		scanRate: "60–90 ballots/min",
		errorRate: "0.004",
		reliability: "Medium",
		discontinued: false,
	},
	{
		manufacturer: "ES&S",
		model: "ExpressVote",
		equipmentType: "Ballot Marking Device",
		quantity: 980,
		age: 10,
		os: "Windows",
		firmware: "EVS 6.5.0.0",
		certification: "VVSG 1.0 (2005)",
		scanRate: "N/A",
		errorRate: "0.006",
		reliability: "Medium",
		discontinued: false,
	},

	// =========================
	// Dominion
	// =========================
	{
		manufacturer: "Dominion",
		model: "ImageCast Precinct",
		equipmentType: "Hand-Fed Optical Scanner",
		quantity: 710,
		age: 12,
		os: "Linux",
		firmware: "ImageCastOS 5.0",
		certification: "VVSG 1.0 (2005)",
		scanRate: "71 ballots/min",
		errorRate: "0.003",
		reliability: "High",
		discontinued: false,
	},
	{
		manufacturer: "Dominion",
		model: "ImageCast X",
		equipmentType: "Ballot Marking Device",
		quantity: 520,
		age: 9,
		os: "Android",
		firmware: "ImageCastXOS 4.9",
		certification: "VVSG 1.0 (2005)",
		scanRate: "N/A",
		errorRate: "0.007",
		reliability: "Medium",
		discontinued: false,
	},

	// =========================
	// Clear Ballot
	// =========================
	{
		manufacturer: "Clear Ballot",
		model: "ClearCast",
		equipmentType: "Hand-Fed Optical Scanner",
		quantity: 310,
		age: 6,
		os: "N/A",
		firmware: "ClearCast",
		certification: "VVSG 1.0 (2005)",
		scanRate: "Hand-fed",
		errorRate: "0.002",
		reliability: "High",
		discontinued: false,
	},
	{
		manufacturer: "Clear Ballot",
		model: "ClearCount",
		equipmentType: "Batch-Fed Optical Scanner",
		quantity: 190,
		age: 9,
		os: "Windows 7",
		firmware: "ClearVote",
		certification: "VVSG 1.0 (2005)",
		scanRate: "50–60 ballots/min",
		errorRate: "0.004",
		reliability: "Medium",
		discontinued: false,
	},

	// =========================
	// VotingWorks (VVSG 2.0)
	// =========================
	{
		manufacturer: "VotingWorks",
		model: "VxScan",
		equipmentType: "Hand-Fed Optical Scanner",
		quantity: 260,
		age: 3,
		os: "Debian 12",
		firmware: "VxSuite v4",
		certification: "VVSG 2.0",
		scanRate: "30 ballots/min",
		errorRate: "0.001",
		reliability: "High",
		discontinued: false,
	},
	{
		manufacturer: "VotingWorks",
		model: "VxMark",
		equipmentType: "Ballot Marking Device",
		quantity: 210,
		age: 4,
		os: "Debian 12",
		firmware: "VxSuite v4",
		certification: "VVSG 2.0",
		scanRate: "N/A",
		errorRate: "0.002",
		reliability: "High",
		discontinued: true,
	},

	// =========================
	// Legacy / Discontinued (Celtics rows included)
	// =========================
	{
		manufacturer: "Premier Election Solutions (Diebold)",
		model: "AccuVote TSX",
		equipmentType: "DRE Touchscreen",
		quantity: 140,
		age: 18,
		os: "Windows CE 4.1",
		firmware: "4.7.8",
		certification: "VVSG 1.0 (state)",
		scanRate: "N/A",
		errorRate: "0.012",
		reliability: "Low",
		discontinued: true,
	},
	{
		manufacturer: "Sequoia Voting Systems",
		model: "AVC Edge",
		equipmentType: "DRE Touchscreen",
		quantity: 95,
		age: 22,
		os: "Proprietary Embedded OS",
		firmware: "N/A",
		certification: "FEC-era (state)",
		scanRate: "N/A",
		errorRate: "0.015",
		reliability: "Low",
		discontinued: true,
	},
	{
		manufacturer: "Robis",
		model: "AskED ePollbook",
		equipmentType: "Electronic Poll Book",
		quantity: 180,
		age: 16,
		os: "Windows 10 Pro",
		firmware: "Deployment-specific",
		certification: "Not Certified",
		scanRate: "N/A",
		errorRate: "0.005",
		reliability: "Medium",
		discontinued: false,
	},

	// =========================
	// FILLER ROWS (repeat pattern to reach ~1000)
	// =========================
	...Array.from({ length: 980 }).map((_, i) => ({
		manufacturer: i % 3 === 0 ? "ES&S" : i % 3 === 1 ? "Dominion" : "Hart InterCivic",
		model: `MockModel-${i}`,
		equipmentType:
			i % 4 === 0
				? "Hand-Fed Optical Scanner"
				: i % 4 === 1
				? "Batch-Fed Optical Scanner"
				: i % 4 === 2
				? "Ballot Marking Device"
				: "DRE Touchscreen",
		quantity: 20 + (i % 500),
		age: 3 + (i % 20),
		os: i % 2 === 0 ? "Linux" : "Windows",
		firmware: `v${1 + (i % 5)}.${i % 10}`,
		certification: i % 5 === 0 ? "VVSG 2.0" : i % 5 === 1 ? "VVSG 1.0 (2005)" : "Not Certified",
		scanRate: i % 2 === 0 ? "30–70 ballots/min" : "N/A",
		errorRate: (0.001 + (i % 10) * 0.001).toFixed(3),
		reliability: i % 3 === 0 ? "High" : i % 3 === 1 ? "Medium" : "Low",
		discontinued: i % 7 === 0,
	})),
];

export default MOCK_EQUIPMENT_DATA;
