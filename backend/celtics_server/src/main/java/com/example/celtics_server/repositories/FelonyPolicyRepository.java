package com.example.celtics_server.repositories;

import java.util.List;
import java.util.Optional;

import com.example.celtics_server.models.FelonyPolicy;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FelonyPolicyRepository extends MongoRepository<FelonyPolicy, String> {

    Optional<FelonyPolicy> findByStateName(String stateName);

    List<FelonyPolicy> findByPolicyCategory(String policyCategory);
}
