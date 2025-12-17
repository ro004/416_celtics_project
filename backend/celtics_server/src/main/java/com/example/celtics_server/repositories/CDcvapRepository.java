package com.example.celtics_server.repositories;

import com.example.celtics_server.models.CDcvap;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CDcvapRepository extends MongoRepository<CDcvap, String> {
    List<CDcvap> findByState(String state);
}
