import { api } from "./client";
import { getFelonyVotingDataforDE, getFelonyVotingDataforSC, mapFelonyPolicy } from "./felony";

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
	const { data } = await api.get(`/eavs/pollbook-deletions/${stateFips}/${year}`);
	return data;
}

// get mail reject summary alongside mail reject counts by region
export async function getMailRejectSummaryandRegionsList(stateFips, year) {
	const { data } = await api.get(`/eavs/mailrejections/${stateFips}/${year}`);
	return data;
}

// ---------------------------------------------------------------------------------------------

// get GUI-15 pcts for South Carolina/Delaware
export async function getCompareStateData(stateFips, year) {
	const { data } = await api.get(`/eavs/politicalcomparison/${stateFips}/${year}`);
	return data;
}

// cumulative helper function for GUI-15
export async function getCumulativeCompareStateData() {
	const [scFelony, deFelony, scStats, deStats] = await Promise.all([
		getFelonyVotingDataforSC(),
		getFelonyVotingDataforDE(),
		getCompareStateData("45", 2024), // South Carolina FIPS
		getCompareStateData("10", 2024), // Delaware FIPS
	]);

	return {
		republican: {
			felonyRights: mapFelonyPolicy(scFelony.policyCategory),
			percentMail: scStats.percent_mail_ballots,
			percentDropbox: scStats.percent_dropbox_ballots,
			percentTurnout: scStats.percent_turnout,
		},
		democratic: {
			felonyRights: mapFelonyPolicy(deFelony.policyCategory),
			percentMail: deStats.percent_mail_ballots,
			percentDropbox: deStats.percent_dropbox_ballots,
			percentTurnout: deStats.percent_turnout,
		},
	};
}

// ---------------------------------------------------------------------------------------------

// get GUI-21 data for South Carolina/Delaware/Colorado
export async function getOptInOutCompareStateData() {
	const { data } = await api.get(`/eavs/OptInOptOut/2024`);
	return data;
}

// get GUI-22 data for South Carolina/Delaware
export async function getRegCompareStateData() {
	const { data } = await api.get(`/eavs/political-states-comparison/2024`);
	return data;
}

// get GUI-23 data for South Carolina/Delaware
export async function getEarlyVotingCompareStateData() {
	const { data } = await api.get(`/eavs/early-voting/2024`);
	return data;
}
