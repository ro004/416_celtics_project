import { api } from "./client";

// helper function to fix GUI-15 naming
export function mapFelonyPolicy(policy) {
	switch (policy) {
		case "restricted":
			return "Restricted";
		case "restoration_after_parole":
			return "Restored After Parole";
		case "restoration_after_parole_probation":
			return "Restored After Parole on Probation";
		default:
			return "Unknown";
	}
}

// get felony rights data for South Carolina (GUI-15)
export async function getFelonyVotingDataforSC() {
	const { data } = await api.get(`/felonyPolicies/state/South%20Carolina`);
	return data;
}

// get felony rights data for Delaware (GUI-15)
export async function getFelonyVotingDataforDE() {
	const { data } = await api.get(`/felonyPolicies/state/Delaware`);
	return data;
}
