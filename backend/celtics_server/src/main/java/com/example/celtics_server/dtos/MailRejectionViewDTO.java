package com.example.celtics_server.dtos;

import java.util.List;

public record MailRejectionViewDTO(
        MailRejectionDTO summary,
        List<CountyMailRejectionDTO> counties,
        Boolean detailedDataState
) {}
