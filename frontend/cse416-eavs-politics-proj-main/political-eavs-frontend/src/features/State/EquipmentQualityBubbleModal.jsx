import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EquipmentQualityBubbleChart from "./EquipmentQualityBubbleChart";

export default function EquipmentQualityBubbleModal({ open, onClose, data }) {
	return (
		<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
			<DialogTitle>
				Voting Equipment Quality vs Rejected Ballots - Bubble Chart
				<IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent>
				<EquipmentQualityBubbleChart data={data} />
			</DialogContent>
		</Dialog>
	);
}
