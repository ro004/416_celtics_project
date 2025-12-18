import { api } from "./client";

//Get list of all voters
// export async function getOklahomaVotersSummary(){
//     const{data} = await api.get("/voters/summary");
//     return data;
// }

// //Filter by party
// export async function getOklahomaVotersByParty(party){
//     const {data} = await api.get(`/voters/party/${party}`); //backticks for variable
//     return data;
// }

// //Filter by county and party
// export async function getOklahomaVotersByCountyAndParty(county, party){
//     const {data} = await api.get(`voters/county/${county}/party/${party}`);
//     return data;
// }

// //Filter by County
// export async function getOklahomaVotersByCounty(county){
//     const {data} = await api.get(`voters/county/${county}`);
//     return data;
// }

// -----------------------------------------------------------------------------------------

export async function getOklahomaVoterRegByCounty() {
	const { data } = await api.get("/voters/registration/by-county");
	return data;
}

// get GUI-19 registered voters by county with pagination and party filter
export async function getRegisteredVotersByCounty({ countyName, party, page, size }) {
	const params = new URLSearchParams();
	if (party) params.set("party", party); // "Dem" | "Rep" | "" (all)
	params.set("page", String(page));
	params.set("size", String(size));

	const url = `/api/voters/registered/${encodeURIComponent(countyName)}?${params.toString()}`;

	const res = await fetch(url);
	if (!res.ok) throw new Error(`Failed to fetch voters: ${res.status}`);
	return res.json();
}

// get GUI-18 voter registration bubbles for Oklahoma
export async function getOklahomaVoterRegBubbles() {
	const { data } = await api.get("/voters/bubbles/census-block");
	return data;
}
