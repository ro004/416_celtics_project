package com.example.celtics_server.services;

import com.example.celtics_server.dtos.CountyProvisionalDTO;
import com.example.celtics_server.dtos.ProvisionalDTO;
import com.example.celtics_server.dtos.ProvisionalViewDTO;
import com.example.celtics_server.models.Eavs;
import com.example.celtics_server.repositories.EavsRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class EavsService {

    private final EavsRepository eavsRepository;

    public EavsService(EavsRepository eavsRepository) {
        this.eavsRepository = eavsRepository;
    }

    public ProvisionalViewDTO getProvisionalViewForState(Integer stateFips, Integer year) {

        List<Eavs> rows = eavsRepository.findByStateFipsAndYear(stateFips, year);            //Loads all EAVS for state

        double totalDetail = 0;
        double notRegistered = 0;
        double wrongJurisdiction = 0;
        double wrongPrecinct = 0;
        double noId = 0;
        double incomplete = 0;
        double ballotMissing = 0;
        double noSignature = 0;
        double badSignature = 0;

        List<CountyProvisionalDTO> countyDtos = new ArrayList<>();                         //Per-county/jurisdiction DTOs for the table

        for (Eavs row : rows) {
            Eavs.Provisional p = row.getProvisional();
            if (p == null) {
                continue;
            }

            // per-row values
            Double rowTotalDetail          = formatNull(p.prov_rejected_total_detail);
            Double rowNotRegistered        = formatNull(p.prov_rejected_not_registered);
            Double rowWrongJurisdiction    = formatNull(p.prov_rejected_wrong_jurisdiction);
            Double rowWrongPrecinct        = formatNull(p.prov_rejected_wrong_precinct);
            Double rowNoId                 = formatNull(p.prov_rejected_no_id);
            Double rowIncomplete           = formatNull(p.prov_rejected_incomplete);
            Double rowBallotMissing        = formatNull(p.prov_rejected_ballot_missing);
            Double rowNoSignature          = formatNull(p.prov_rejected_no_signature);
            Double rowBadSignature         = formatNull(p.prov_rejected_bad_signature);

            // accumulate for statewide summary
            totalDetail       += rowTotalDetail;
            notRegistered     += rowNotRegistered;
            wrongJurisdiction += rowWrongJurisdiction;
            wrongPrecinct     += rowWrongPrecinct;
            noId              += rowNoId;
            incomplete        += rowIncomplete;
            ballotMissing     += rowBallotMissing;
            noSignature       += rowNoSignature;
            badSignature      += rowBadSignature;

            // build county/jurisdiction DTO for the table
            CountyProvisionalDTO countyDto = new CountyProvisionalDTO(
                    row.getState_fips(),
                    row.getCounty_fips(),
                    row.getJuris_name(),
                    rowTotalDetail,
                    rowNotRegistered,
                    rowWrongJurisdiction,
                    rowWrongPrecinct,
                    rowNoId,
                    rowIncomplete,
                    rowBallotMissing,
                    rowNoSignature,
                    rowBadSignature
            );
            countyDtos.add(countyDto);
        }

        // 4. Build statewide summary DTO
        ProvisionalDTO summary = new ProvisionalDTO(
                stateFips,
                year,
                totalDetail,
                notRegistered,
                wrongJurisdiction,
                wrongPrecinct,
                noId,
                incomplete,
                ballotMissing,
                noSignature,
                badSignature
        );

        return new ProvisionalViewDTO(summary, countyDtos);                             //Wrap both DTOs
    }

    private double formatNull(Double value) {
        return value == null ? 0.0 : value;
    }
}
