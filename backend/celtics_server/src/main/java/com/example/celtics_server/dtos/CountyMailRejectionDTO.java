package com.example.celtics_server.dtos;

public record CountyMailRejectionDTO(
        String state_fips,
        String county_fips,
        Double mail_rejected_total, // C9a (useful for choropleth numerator)
        Double rejection_pct_of_state, // choropleth value (% of total rejected in state)

        Double C9b,
        Double C9c,
        Double C9d,
        Double C9e,
        Double C9f,
        Double C9g,
        Double C9h,
        Double C9i,
        Double C9j,
        Double C9k,
        Double C9l,
        Double C9m,
        Double C9n,
        Double C9o,
        Double C9p,
        Double C9q
) {}
