package com.example.celtics_server.dtos;
import java.util.List;

public record PagedVoterNamesDTO(
        String county,
        String party,
        int page,
        int size,
        long totalElements,
        int totalPages,
        List<VoterNameDTO> voters
) {}
