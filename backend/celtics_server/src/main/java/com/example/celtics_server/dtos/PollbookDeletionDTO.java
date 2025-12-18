package com.example.celtics_server.dtos;

public record PollbookDeletionDTO(
        String state_fips,
        Integer year,
        Double A12b,
        Double A12c,
        Double A12d,
        Double A12e,
        Double A12f,
        Double A12g,
        Double A12h
) {}
