package com.example.celtics_server.controllers;

import com.example.celtics_server.dtos.EAVSPoliticalComparisonDTO;
import com.example.celtics_server.dtos.ProvisionalViewDTO;
import com.example.celtics_server.dtos.ActiveVotersViewDTO;
import com.example.celtics_server.dtos.USEquipmentViewDTO;
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
            @PathVariable String stateFips,
            @PathVariable Integer year
    ) {
        return eavsService.getProvisionalViewForState(stateFips, year);
    }

    @GetMapping("/activevoters/{stateFips}/{year}")
    public ActiveVotersViewDTO getActiveVotersForState(
            @PathVariable String stateFips,
            @PathVariable Integer year
    ){
        return eavsService.getActiveVotersViewForState(stateFips, year);
    }

    @GetMapping("/equipment/{year}")
    public USEquipmentViewDTO getEquipmentInfo(
            @PathVariable Integer year
    ){
        return eavsService.getEquipmentInfo(year);
    }
    //GUI 15
    @GetMapping("/politicalcomparison/{stateFips}/{year}")
    public EAVSPoliticalComparisonDTO getPoliticalStateComparison(
            @PathVariable String stateFips,
            @PathVariable Integer year
    ){
        return eavsService.getPoliticalStateComparisonView(stateFips, year);
    }
}
