package com.example.celtics_server.dtos;

public record ActiveVotersRegionDTO(
    String state_fips,
    String county_fips,
    String juris_name,
    Integer year,
    Double a12_total,        // treat as “total registered” for 2024
    Double a12_active,       // active voters
    Double a12_inactive     // inactive voters
) {}
