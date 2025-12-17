package com.example.celtics_server.repositories;

import com.example.celtics_server.models.Voter;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface VoterRepository extends MongoRepository<Voter, String>, VoterRepositoryCustom {
    List<Voter> findByCountyAndParty(String county, String party);

    List<Voter> findByCounty(String county);

    List<Voter> findByParty(String party);

    Page<Voter> findByCounty(String county, Pageable pageable);
    Page<Voter> findByCountyAndParty(String county, String party, Pageable pageable);

}
