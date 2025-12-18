package com.example.celtics_server.dtos;

public record CensusBlockBubbleDTO(
        String censusBlock,
        String majorityParty, // "R" or "D" (whatever your preprocessing uses)
        Double lon,
        Double lat
) {}