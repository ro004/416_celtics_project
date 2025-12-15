package com.example.celtics_server.repositories;

import com.example.celtics_server.models.Eavs;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EavsRepository extends MongoRepository<Eavs, String> {
    List<Eavs> findByStateFipsAndYear(String stateFips, Integer year);
    List<Eavs> findByYear(Integer year);
}