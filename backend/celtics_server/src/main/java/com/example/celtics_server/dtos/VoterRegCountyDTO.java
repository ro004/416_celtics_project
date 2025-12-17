package com.example.celtics_server.dtos;

public record VoterRegCountyDTO(
        String county,
        long registered_total,
        long democratic,
        long republican,
        long independent,
        long other,
        double percent_registered
) {}

