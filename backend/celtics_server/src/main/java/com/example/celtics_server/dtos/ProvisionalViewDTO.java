package com.example.celtics_server.dtos;
import java.util.List;

public record ProvisionalViewDTO(
        ProvisionalDTO summary,                                 //Provisional Data For Bar Chart of state
        List<CountyProvisionalDTO> counties                     //Provisional Data for Table of EAVS regions
) {}
