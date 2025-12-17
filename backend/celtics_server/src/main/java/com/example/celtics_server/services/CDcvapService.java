package com.example.celtics_server.services;

import com.example.celtics_server.models.CDcvap;
import com.example.celtics_server.repositories.CDcvapRepository;
import org.springframework.stereotype.Service;

@Service
public class CDcvapService {

    private final CDcvapRepository cdCvapRepository;

    public CDcvapService(CDcvapRepository cdCvapRepository) {
        this.cdCvapRepository = cdCvapRepository;
    }

    public long getStateCvapTotal(String stateName) {
        return cdCvapRepository.findByState(stateName).stream()
                .mapToLong(doc -> {
                    Integer total = (doc.getRaces() == null) ? null : doc.getRaces().get("Total");
                    return total == null ? 0L : total.longValue();
                })
                .sum();
    }
}
