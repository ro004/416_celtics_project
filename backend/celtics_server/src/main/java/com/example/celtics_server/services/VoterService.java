package com.example.celtics_server.services;
import com.example.celtics_server.dtos.PagedVoterNamesDTO;
import com.example.celtics_server.dtos.VoterNameDTO;
import com.example.celtics_server.dtos.VoterRegCountyDTO;
import com.example.celtics_server.models.Voter;
import com.example.celtics_server.repositories.VoterRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.example.celtics_server.dtos.VoterRegCountyAggDTO;

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

    public List<VoterRegCountyDTO> getVoterRegByCounty() {
        long stateTotal = voterRepository.count(); // statewide registered total

        List<VoterRegCountyAggDTO> aggRows = voterRepository.aggregateByCounty(); // single pipeline

        return aggRows.stream().map(r -> {
            long other = r.registered_total() - r.democratic() - r.republican() - r.unaffiliated();
            double pct = stateTotal == 0 ? 0.0 : (r.registered_total() * 100.0) / stateTotal;
            pct = Math.round(pct * 1000.0) / 1000.0; // 3 decimals

            return new VoterRegCountyDTO(
                    r.county(),
                    r.registered_total(),
                    r.democratic(),
                    r.republican(),
                    r.unaffiliated(),
                    other,
                    pct
            );
        }).toList();
    }

    public PagedVoterNamesDTO getRegisteredVoters(String county, String party, int page, int size) {

        // enforce spec: party filter only allows Dem/Rep
        String normalizedParty = (party == null || party.isBlank()) ? null : party.trim();

        if (normalizedParty != null && !normalizedParty.equals("Dem") && !normalizedParty.equals("Rep")) {
            throw new IllegalArgumentException("party must be Dem or Rep");
        }

        Pageable pageable = PageRequest.of(page, size);

        Page<Voter> resultPage = (normalizedParty == null)
                ? voterRepository.findByCounty(county, pageable)
                : voterRepository.findByCountyAndParty(county, normalizedParty, pageable);

        List<VoterNameDTO> names = resultPage.getContent().stream()
                .map(v -> new VoterNameDTO(v.getName()))
                .toList();

        return new PagedVoterNamesDTO(
                county,
                normalizedParty,
                page,
                size,
                resultPage.getTotalElements(),
                resultPage.getTotalPages(),
                names
        );
    }
}
