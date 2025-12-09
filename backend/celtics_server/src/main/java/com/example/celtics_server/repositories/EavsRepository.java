package com.example.celtics_server.repositories;

import com.example.celtics_server.models.Eavs;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EavsRepository extends MongoRepository<Eavs, String> {
    List<Eavs> findByStateFipsAndYear(Integer state_fips, Integer year);
}