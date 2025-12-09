package com.example.celtics_server.services;

import java.util.List;
import java.util.Optional;

import com.example.celtics_server.models.FelonyPolicy;
import com.example.celtics_server.repositories.FelonyPolicyRepository;
import org.springframework.stereotype.Service;

@Service
public class FelonyPolicyService {

    private final FelonyPolicyRepository felonyPolicyRepository;

    public FelonyPolicyService(FelonyPolicyRepository felonyPolicyRepository) {
        this.felonyPolicyRepository = felonyPolicyRepository;
    }

    public List<FelonyPolicy> getAllPolicies() {
        return felonyPolicyRepository.findAll();
    }

    public Optional<FelonyPolicy> getPolicyByStateName(String stateName) {
        return felonyPolicyRepository.findByStateName(stateName);
    }

    public List<FelonyPolicy> getPoliciesByCategory(String policyCategory) {
        return felonyPolicyRepository.findByPolicyCategory(policyCategory);
    }
}
