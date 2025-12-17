package com.example.celtics_server.dtos;

public record PoliticalStateComparisonDTO(
        String state,
        String party,                  // "Republican" / "Democratic"
        Long registeredTotal,
        Double registrationRate,
        Double ballotsCast,
        Double turnoutRate
) {}