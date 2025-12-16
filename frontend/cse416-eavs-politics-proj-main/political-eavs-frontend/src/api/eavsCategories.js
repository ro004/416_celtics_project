import { api } from "./client";

// get provisional ballot summary (GUI-3) alongside provisional ballot counts by region (GUI-4)
export async function getProvBallotSummaryandRegionsList(stateFips, year) {
	const { data } = await api.get(`/eavs/provisional/${stateFips}/${year}`);
	return data;
}

// get active voter summary (GUI-7) alongside active voter counts by region (GUI-8)
export async function getActiveVoterSummaryandRegionsList(stateFips, year) {
	const { data } = await api.get(`/eavs/activevoters/${stateFips}/${year}`);
	return data;
}

// get pollbook deletion summary (GUI-9) alongside deletion counts by region (GUI-10)
export async function getPollbookDeletionSummaryandRegionsList(stateFips, year) {
	const { data } = await api.get(`/eavs/pollbookdeletions/${stateFips}/${year}`);
	return data;
}

// get mail reject summary alongside mail reject counts by region
export async function getMailRejectSummaryandRegionsList(stateFips, year) {
	const { data } = await api.get(`/eavs/mailrejects/${stateFips}/${year}`);
	return data;
}
