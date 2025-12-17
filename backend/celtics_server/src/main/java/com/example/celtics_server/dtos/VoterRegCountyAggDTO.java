package com.example.celtics_server.dtos;

public record VoterRegCountyAggDTO(
        String county,
        long registered_total,
        long democratic,
        long republican,
        long unaffiliated
) {}

