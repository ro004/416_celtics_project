import { api } from "./client";

// get provisional ballot summary (GUI-3) alongside provisional ballot counts by region (GUI-4)

export async function getProvBallotSummaryandRegionsList(stateFips, year) {
	const { data } = await api.get(`/eavs/provisional/${stateFips}/${year}`);
	return data;
}
