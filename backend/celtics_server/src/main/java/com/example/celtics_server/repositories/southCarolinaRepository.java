package com.example.celtics_server.repositories;

import com.example.celtics_server.models.SouthCarolinaVotes;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface southCarolinaRepository extends MongoRepository<SouthCarolinaVotes, String> {
}
