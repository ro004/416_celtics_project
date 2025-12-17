package com.example.celtics_server.dtos;

public record ActiveVotersSummaryDTO(
        Integer state_fips,
        Integer year,
        Double Tot,
        Double Act,
        Double Inact
) {}