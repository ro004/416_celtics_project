package com.example.celtics_server.dtos;

import java.util.List;

public record PollbookViewDTO(
        PollbookDeletionDTO summary,
        List<CountyPollbookDeletionDTO> counties
) {}
