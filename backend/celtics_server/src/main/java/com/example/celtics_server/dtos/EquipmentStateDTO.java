package com.example.celtics_server.dtos;

public record EquipmentStateDTO(
        String state_fips,     // keep String if your Mongo stores "55" etc.
        String state_abbr,     // optional but nice for display
        Integer year,

        Double dre_no_vvpat_total,
        Double dre_with_vvpat_total,
        Double bmd_total,
        Double scanner_total
) {}
