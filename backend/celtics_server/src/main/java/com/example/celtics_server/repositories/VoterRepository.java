package com.example.celtics_server.repositories;

import com.example.celtics_server.models.Voter;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VoterRepository extends MongoRepository<Voter, String> {
    List<Voter> findByCountyAndParty(String county, String party);

    List<Voter> findByCounty(String county);

    List<Voter> findByParty(String party);
}
