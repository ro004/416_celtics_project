package com.example.celtics_server.dtos;

public record CountyPollbookDeletionDTO(
        String county_fips,
        String juris_name,

        Double deletion_pct_of_registered,

        Double A12b,
        Double A12c,
        Double A12d,
        Double A12e,
        Double A12f,
        Double A12g,
        Double A12h
) {}
