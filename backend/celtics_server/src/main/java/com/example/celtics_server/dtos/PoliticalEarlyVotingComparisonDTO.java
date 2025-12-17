package com.example.celtics_server.dtos;

public record PoliticalEarlyVotingComparisonDTO(
        String state,
        String party,
        Double totalVotes,          // denominator
        Double earlyTotalAbs,
        Double earlyVotingRate,
        Double inPersonEarlyAbs,
        Double inPersonEarlyRate,
        Double mailEarlyAbs,
        Double mailEarlyRate
) {}