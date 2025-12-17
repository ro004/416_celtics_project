package com.example.celtics_server.dtos;

public record OptInOptOutDTO(
        String state,
        String registrationPolicy,   // Opt-In / Opt-Out (+ SDR note)

        Long registeredTotal,
        Double registrationRate,

        Double ballotsCast,
        Double turnoutRate
) {}
