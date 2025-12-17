package com.example.celtics_server.controllers;

import com.example.celtics_server.services.CDcvapService;

import org.springframework.web.bind.annotation.*;

@RestController

@RequestMapping("/api/cdcvap")
public class CDcvapController {

    private final CDcvapService cvapService;

    public CDcvapController(CDcvapService cvapService) {
        this.cvapService = cvapService;
    }

    // Test route: returns statewide CVAP total (sums all CDs for that state)
    @GetMapping("/state/{stateName}/total")
    public long getStateCvapTotal(@PathVariable String stateName) {
        return cvapService.getStateCvapTotal(stateName);
    }
}
