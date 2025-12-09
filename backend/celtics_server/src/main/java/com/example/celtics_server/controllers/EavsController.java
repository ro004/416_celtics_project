package com.example.celtics_server.controllers;

import com.example.celtics_server.dtos.ProvisionalViewDTO;
import com.example.celtics_server.services.EavsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/eavs")
public class EavsController {

    private final EavsService eavsService;

    public EavsController(EavsService eavsService) {
        this.eavsService = eavsService;
    }

    @GetMapping("/provisional/{stateFips}/{year}")
    public ProvisionalViewDTO getProvisionalForState(
            @PathVariable Integer stateFips,
            @RequestParam(defaultValue = "2024") Integer year
    ) {
        return eavsService.getProvisionalViewForState(stateFips, year);
    }
}
