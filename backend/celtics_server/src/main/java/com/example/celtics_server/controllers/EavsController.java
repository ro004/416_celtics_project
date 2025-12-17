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

    @GetMapping("/cvapPct/{stateFips}")
    public CvapPctDTO getCvapPct(@PathVariable String stateFips) {
        String stateName = "invalid";
        // however you already map FIPS → state name
        if ("10".equals(stateFips)) stateName = "Delaware";
        if ("45".equals(stateFips)) stateName = "South Carolina";

        return eavsService.getCvapEligibilityPct(stateFips, stateName);
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
    //GUI Use Case 10
    @GetMapping("/equipment/{stateFips}/{year}")
    public List<VotingEquipmentDTO> getVotingEquipment(
            @PathVariable String stateFips,
            @PathVariable Integer year
    ) {
        return eavsService.getVotingEquipmentForState(stateFips, year);
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
    @GetMapping("/OptInOptOut/{year}")
    public List<OptInOptOutDTO> getOptInOptOutTableComparison(
            @PathVariable Integer year
    ){
        return eavsService.getOptInOptOutComparisons(year);
    }

    //GUI 22
    @GetMapping("/political-states-comparison/{year}")
    public List<PoliticalStateComparisonDTO> getPoliticalStateTableComparison(
            @PathVariable Integer year
    ){
        return eavsService.getPoliticalStateComparisons(year);
    }
    //GUI 23
    @GetMapping("/early-voting/{year}")
    public List<PoliticalEarlyVotingComparisonDTO> getPoliticalEarlyVotingComparison(
            @PathVariable int year
    ) {
        return eavsService.getPoliticalEarlyVotingComparisons(year);
    }

}
