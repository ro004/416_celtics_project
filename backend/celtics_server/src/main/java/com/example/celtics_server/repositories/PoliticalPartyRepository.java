package com.example.celtics_server.repositories;

import com.example.celtics_server.models.PoliticalPartyVotes;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PoliticalPartyRepository extends MongoRepository<PoliticalPartyVotes, String> {

    PoliticalPartyVotes findByState(String state);

}
