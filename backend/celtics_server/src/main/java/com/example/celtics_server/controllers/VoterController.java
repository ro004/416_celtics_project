package com.example.celtics_server.controllers;

import com.example.celtics_server.CountyPartyCount;
import com.example.celtics_server.CountySummary;
import com.example.celtics_server.models.Voter;
import org.springframework.web.bind.annotation.*; //gives us @RestController, @GetMapping, and other annotations
import com.example.celtics_server.repositories.VoterRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

//Annotation for RestController tells Spring this class will handle HTTP requests
@RestController
//Request Mapping tells Spring all routes in this controller start with /api/voters
@RequestMapping("/api/voters")

//Routes we have implemented so far and their use cases
//GUI Case 19
//Return All Voters in a Given County, filtering by party if preferred
//Covered by /county/{county} and /county/{county}/party/{party}
//GUI Case 17
//Return a table of County | Voters | Dem Voters | Rep Voters | Ind Voters
//covered by /summary

public class VoterController {
    private final VoterRepository voterRepository;

    //Get Mapping means run this mapped call when a GET request is made to this URL

    //The following methods below this comment return a list of voter objects based on a certain criteria

    @GetMapping("/county/{county}")
    public List<Voter> getVotersByCounty(@PathVariable String county){
        return voterRepository.findByCounty(county);
    }

    //What it looks like -> GET /api/voters/Tulsa/party/Democratic
    @GetMapping("/county/{county}/party/{party}")
    public List<Voter> getVotersByCountyAndParty(@PathVariable String county, @PathVariable String party){
        return voterRepository.findByCountyAndParty(county, party);
    }

    @GetMapping("/party/{party}")
    public List<Voter> getVotersByParty(@PathVariable String party){
        return voterRepository.findByParty(party);
    }

    //This api call returns a summary on the county, the number of voters, and their affiliated party

    @GetMapping("/summary")
    public List<CountySummary> getCountySummary(){
        //Get Count from MongoDB
        List<CountyPartyCount> counts = voterRepository.findVoterCountByCountyAndParty();
        //Create a map that accumulates the total votes per county
        Map<String, CountySummary> summaryMap = new HashMap<>();
        //Loop over MongoDB results and merge into 1 CountySummary object per county instead of 3 for each party status
        for (CountyPartyCount c : counts){
            String county = c.getCounty();
            String party = c.getParty();
            long count = c.getCount();
            //If we haven't seen this county before, add it to the map
            summaryMap.putIfAbsent(county, new CountySummary(county));
            CountySummary row = summaryMap.get(county);

            if (party.equalsIgnoreCase("Dem")){
                row.incrementDem(count);
            }
            else if (party.equalsIgnoreCase("Rep")){
                row.incrementRep(count);
            }
            else{
                row.incrementInd(count);
            }
            row.incrementTotal(count);
        }
        //Convert map to a list and return it as a json
        return new ArrayList<>(summaryMap.values());
    }

    public VoterController(VoterRepository voterRepository){
        this.voterRepository = voterRepository;
    }
}
