package com.example.celtics_server.dtos;

public record EAVSPoliticalComparisonDTO(
    String state_fips,
    Integer year,

    Double percent_mail_ballots,
    Double percent_dropbox_ballots,
    Double percent_turnout
) {}
