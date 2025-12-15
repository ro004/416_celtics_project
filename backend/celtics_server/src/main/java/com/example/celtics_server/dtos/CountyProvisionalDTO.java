package com.example.celtics_server.dtos;

public record CountyProvisionalDTO(
        String state_fips,
        String county_fips,
        String juris_name,
        Double prov_total_cast, //E1a Use case 5
        Double prov_rejected_total_detail,
        Double prov_rejected_not_registered,
        Double prov_rejected_wrong_jurisdiction,
        Double prov_rejected_wrong_precinct,
        Double prov_rejected_no_id,
        Double prov_rejected_incomplete,
        Double prov_rejected_ballot_missing,
        Double prov_rejected_no_signature,
        Double prov_rejected_bad_signature
) {}
