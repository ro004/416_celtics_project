package com.example.celtics_server.repositories;

import com.example.celtics_server.dtos.VoterRegCountyAggDTO;
import java.util.List;

public interface VoterRepositoryCustom {
    List<VoterRegCountyAggDTO> aggregateByCounty();
}
