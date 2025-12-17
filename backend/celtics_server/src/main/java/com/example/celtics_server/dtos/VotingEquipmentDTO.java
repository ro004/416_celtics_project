package com.example.celtics_server.dtos;

public record VotingEquipmentDTO(
        String state_fips,
        String county_fips,
        String juris_name,

        Boolean dreNoVvpat,
        Boolean dreWithVvpat,
        Boolean bmd,
        Boolean scanner
) {}

