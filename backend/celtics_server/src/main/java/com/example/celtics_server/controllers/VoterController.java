package com.example.celtics_server.controllers;

import com.example.celtics_server.CountyPartyCount;
import com.example.celtics_server.CountySummary;
import com.example.celtics_server.dtos.CensusBlockBubbleDTO;
import com.example.celtics_server.dtos.PagedVoterNamesDTO;
import com.example.celtics_server.dtos.VoterRegCountyDTO;
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

    @GetMapping("/{county}")
    public List<Voter> getVotersByCounty(@PathVariable String county){
        return voterService.getVotersByCounty(county);
    }

    @GetMapping("/{county}/{party}")
    public List<Voter> getVotersByCountyAndParty(@PathVariable String county, @PathVariable String party){
        return voterService.getVotersByCountyAndParty(county, party);
    }

    @GetMapping("/party/{party}")
    public List<Voter> getVotersByParty(@PathVariable String party){
        return voterService.getVotersByParty(party);
    }

    // GUI-17: table + choropleth values per county
    @GetMapping("/registration/by-county")
    public List<VoterRegCountyDTO> getRegistrationByCounty() {
        return voterService.getVoterRegByCounty();
    }

    //GUI 18
    @GetMapping("/bubbles/census-block")
    public List<CensusBlockBubbleDTO> getCensusBlockBubbles() {
        return voterService.getCensusBlockBubbles();
    }

    //GUI-19
    @GetMapping("/registered/{county}")
    public PagedVoterNamesDTO getRegisteredVoters(
            @PathVariable String county,
            @RequestParam(required = false) String party, // "Dem" or "Rep"
            @RequestParam int page,
            @RequestParam int size
    ) {
        return voterService.getRegisteredVoters(county, party, page, size);
    }

}
