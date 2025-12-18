import { api } from "./client";

// get state voting equipment summary (GUI-6) for given state
// export async function getStateVotingEquipTable(stateFips) {
// 	const { data } = await api.get(`/equipment/${stateFips}/summary`);
// 	return data;
// }

// get equipment by state table on splash page (GUI-12)
export async function getVotingEquipmentByState(year) {
	const { data } = await api.get(`/eavs/equipment/${year}`);
	return data;
}

// get voting equipment by county for given state (GUI-10)
export async function getVotingEquipmentByCounty(stateFips, year) {
	const { data } = await api.get(`/eavs/equipment/${stateFips}/${year}`);
	return data;
}

// get GUI-25 bubble chart data for given state
export async function getEquipmentQualityVsRejects(stateFips, year) {
	const { data } = await api.get(`/eavs/equipment-quality-rejected/${stateFips}/${year}`);
	return data;
}
