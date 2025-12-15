package com.example.celtics_server.dtos;
import java.util.List;

public record USEquipmentViewDTO (
    Integer year,
    List<EquipmentStateDTO> states
) {}
