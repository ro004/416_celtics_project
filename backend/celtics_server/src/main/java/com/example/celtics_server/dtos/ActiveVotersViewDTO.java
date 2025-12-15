package com.example.celtics_server.dtos;

import java.util.List;

public record ActiveVotersViewDTO(
        ActiveVotersSummaryDTO summary,
        List<ActiveVotersRegionDTO> counties
) {}
