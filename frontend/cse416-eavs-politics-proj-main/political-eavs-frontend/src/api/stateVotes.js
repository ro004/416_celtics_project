import {api} from "./client";

//Call controller endpoint from StateVotesController.java from backend for the Voter Registration State data (OptIn/Out states)

export async function getDelawareData(){
    const {data} = await api.get("/stateVotes/delaware");
    return data;
}

export async function getSouthCarolinaData(){
    const {data} = await api.get("/stateVotes/southCarolina");
    return data;
}