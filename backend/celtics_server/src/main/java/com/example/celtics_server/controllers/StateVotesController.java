package com.example.celtics_server.controllers;

import com.example.celtics_server.models.DelawareVotes;
import com.example.celtics_server.models.SouthCarolinaVotes;
import com.example.celtics_server.repositories.delawareRepository;
import com.example.celtics_server.repositories.southCarolinaRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController

@RequestMapping("/api/stateVotes")
public class StateVotesController {
    private final delawareRepository delawareRepository;
    private final southCarolinaRepository southCarolinaRepository;

    public StateVotesController(delawareRepository delawareRepository, southCarolinaRepository southCarolinaRepository){
        this.delawareRepository = delawareRepository;
        this.southCarolinaRepository = southCarolinaRepository;
    }

    @GetMapping("/delaware")
    public List<DelawareVotes> getDelawareInfo(){
        return delawareRepository.findAll();
    }

    @GetMapping("/southCarolina")
    public List<SouthCarolinaVotes> getSouthCarolinaInfo(){
        return southCarolinaRepository.findAll();
    }
}
