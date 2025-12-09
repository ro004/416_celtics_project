package com.example.celtics_server.services;
import com.example.celtics_server.models.Voter;
import com.example.celtics_server.repositories.VoterRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VoterService {

    private final VoterRepository voterRepository;

    public VoterService(VoterRepository voterRepository) {
        this.voterRepository = voterRepository;
    }

    public List<Voter> getVotersByCounty(String county) {
        return voterRepository.findByCounty(county);
    }

    public List<Voter> getVotersByCountyAndParty(String county, String party) {
        return voterRepository.findByCountyAndParty(county, party);
    }

    public List<Voter> getVotersByParty(String party) {
        return voterRepository.findByParty(party);
    }

}
