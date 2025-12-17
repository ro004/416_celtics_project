import { Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ComparisonTable from "./ComparisonTable";

export default function CompareModal({ open, onClose, mode, compareData }) {
	if (!open) return null;

	const titles = {
		"felony-rights": "Republican vs Democratic States - South Carolina vs Delaware",
		"opt-in-out": "Opt-In vs Opt-Out Voter Registration - South Carolina vs Colorado vs Delaware",
		"reg-comp": "Republican vs Democratic Voter Registration - South Carolina vs Delaware",
		"early-voting": "Republican vs Democratic Early Voting - South Carolina vs Delaware",
	};

	return (
		<Modal open={open} onClose={onClose}>
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: "80%",
					maxHeight: "85%",
					bgcolor: "background.paper",
					borderRadius: 2,
					p: 3,
					overflowY: "auto",
				}}>
				<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
					<Typography variant="h6">{titles[mode]}</Typography>
					<IconButton onClick={onClose}>
						<CloseIcon />
					</IconButton>
				</Box>
				<ComparisonTable mode={mode} data={compareData} />
			</Box>
		</Modal>
	);
}
