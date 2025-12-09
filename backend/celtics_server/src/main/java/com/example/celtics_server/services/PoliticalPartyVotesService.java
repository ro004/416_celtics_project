package com.example.celtics_server.services;

import com.example.celtics_server.models.PoliticalPartyVotes;
import com.example.celtics_server.repositories.PoliticalPartyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PoliticalPartyVotesService {

    private final PoliticalPartyRepository repository;

    public PoliticalPartyVotesService(PoliticalPartyRepository repository) {
        this.repository = repository;
    }

    public PoliticalPartyVotes getStateInfo(String state) {
        return repository.findByState(state);
    }

    public List<PoliticalPartyVotes> getAllPoliticalInfo() {
        return repository.findAll();
    }
}
