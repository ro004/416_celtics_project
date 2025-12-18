package com.example.celtics_server.dtos;

public record ProvisionalDTO(
        String state_fips,
        Integer year,
        Double E2a,         //prov_rejected_total_detail
        Double E2b,         //prov_rejected_not_registered
        Double E2c,         //prov_rejected_wrong_jurisdiction
        Double E2d,         //prov_rejected_wrong_precinct
        Double E2e,         //prov_rejected_no_id
        Double E2f,         //prov_rejected_incomplete
        Double E2g,         //prov_rejected_ballot_missing
        Double E2h,         //prov_rejected_no_signature
        Double E2i,          //prov_rejected_bad_signature
        Double Other
) {}