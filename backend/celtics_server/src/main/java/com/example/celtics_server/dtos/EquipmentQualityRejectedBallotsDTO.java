package com.example.celtics_server.dtos;

//One bubble per county, x = equipQual, y = rejBallotPct
public record EquipmentQualityRejectedBallotsDTO(
        String state_fips,
        String county_fips,
        String juris_name,

        Double equipmentQuality,       // x-axis (computed)
        Double rejectedBallotPct      // y-axis (%)

        //Double rejectedBallots,        // optional: helpful for debugging/tooltip
        //Double totalBallots            // optional: helpful for debugging/tooltip
) {}
