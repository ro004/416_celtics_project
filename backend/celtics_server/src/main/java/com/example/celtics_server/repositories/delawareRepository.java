package com.example.celtics_server.repositories;

import com.example.celtics_server.models.DelawareVotes;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface delawareRepository extends MongoRepository<DelawareVotes, String> {
}
