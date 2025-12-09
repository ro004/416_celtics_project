package com.example.celtics_server.controllers;

import com.example.celtics_server.models.PoliticalPartyVotes;
import com.example.celtics_server.services.PoliticalPartyVotesService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController

@RequestMapping("/api/stateVotes")
public class StateVotesController {
    private final PoliticalPartyVotesService politicalPartyVotesService;

    public StateVotesController(PoliticalPartyVotesService politicalPartyVotesService) {
        this.politicalPartyVotesService = politicalPartyVotesService;
    }

    @GetMapping("/{state}")
    public PoliticalPartyVotes getStateInfo(@PathVariable String state) {
        return politicalPartyVotesService.getStateInfo(state);
    }

    @GetMapping("/all")
    public List<PoliticalPartyVotes> getAllPoliticalInfo(){
        return politicalPartyVotesService.getAllPoliticalInfo();
    }
}
