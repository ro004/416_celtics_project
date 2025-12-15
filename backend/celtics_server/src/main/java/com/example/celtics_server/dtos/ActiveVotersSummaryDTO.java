package com.example.celtics_server.dtos;

public record ActiveVotersSummaryDTO(
        Integer state_fips,
        Integer year,
        Double a12_total,
        Double a12_active,
        Double a12_inactive
) {}