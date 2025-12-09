package com.example.celtics_server.controllers;
import java.util.List;

import com.example.celtics_server.models.FelonyPolicy;
import com.example.celtics_server.services.FelonyPolicyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/felonyPolicies")
@CrossOrigin(origins = "*")
public class FelonyPolicyController {

    private final FelonyPolicyService felonyPolicyService;

    public FelonyPolicyController(FelonyPolicyService felonyPolicyService) {
        this.felonyPolicyService = felonyPolicyService;
    }

    @GetMapping
    public List<FelonyPolicy> getAllPolicies() {
        return felonyPolicyService.getAllPolicies();
    }

    @GetMapping("/state/{stateName}")
    public ResponseEntity<FelonyPolicy> getPolicyByState(@PathVariable String stateName) {
        return felonyPolicyService.getPolicyByStateName(stateName)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{policyCategory}")
    public List<FelonyPolicy> getPoliciesByCategory(@PathVariable String policyCategory) {
        return felonyPolicyService.getPoliciesByCategory(policyCategory);
    }
}
