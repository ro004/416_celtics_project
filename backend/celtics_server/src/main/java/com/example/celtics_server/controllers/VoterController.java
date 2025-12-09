package com.example.celtics_server.controllers;

import com.example.celtics_server.CountyPartyCount;
import com.example.celtics_server.CountySummary;
import com.example.celtics_server.models.Voter;
import com.example.celtics_server.services.VoterService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/voters")                                      //Routes map by /api/voters/route/parameter
public class VoterController {

    private final VoterService voterService;
    public VoterController(VoterService voterService){
        this.voterService = voterService;
    }

    @GetMapping("/county/{county}")
    public List<Voter> getVotersByCounty(@PathVariable String county){
        return voterService.getVotersByCounty(county);
    }

    @GetMapping("/county/{county}/party/{party}")
    public List<Voter> getVotersByCountyAndParty(@PathVariable String county, @PathVariable String party){
        return voterService.getVotersByCountyAndParty(county, party);
    }

    @GetMapping("/party/{party}")
    public List<Voter> getVotersByParty(@PathVariable String party){
        return voterService.getVotersByParty(party);
    }
}
