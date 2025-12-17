package com.example.celtics_server.controllers;

import com.example.celtics_server.dtos.*;
import com.example.celtics_server.services.EavsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    @GetMapping("/mailrejections/{stateFips}/{year}")
    public MailRejectionViewDTO getMailRejectionForState(
            @PathVariable String stateFips,
            @PathVariable Integer year
    ){
        return eavsService.getMailRejectionViewForState(stateFips, year);
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

    //GUI 21
    @GetMapping("/political-states-comparison/{year}")
    public List<PoliticalStateComparisonDTO> getPoliticalStateTableComparison(
            @PathVariable Integer year
    ){
        return eavsService.getPoliticalStateComparisons(year);
    }
}
