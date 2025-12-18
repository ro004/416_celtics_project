import { api } from "./client";

// get CVAP score (GUI-2) for given political state (SC=45, DE=10)
export async function getCvapScoreForState(stateFips) {
	const { data } = await api.get(`/eavs/cvapPct/${stateFips}`);
	return data;
}
