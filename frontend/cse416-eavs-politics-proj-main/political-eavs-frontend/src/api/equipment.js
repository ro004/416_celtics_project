import { api } from "./client";

// get state voting equipment summary (GUI-6) for given state
export async function getStateVotingEquipTable(stateFips) {
	const { data } = await api.get(`/equipment/${stateFips}/summary`);
	return data;
}
