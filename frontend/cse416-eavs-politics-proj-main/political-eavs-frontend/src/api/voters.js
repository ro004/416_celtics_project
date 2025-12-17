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
