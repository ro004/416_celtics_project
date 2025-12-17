package com.example.celtics_server.services;

import com.example.celtics_server.dtos.*;
import com.example.celtics_server.models.Eavs;
import com.example.celtics_server.repositories.EavsRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class EavsService {

    private final EavsRepository eavsRepository;
    private final CDcvapService cdcvapService;
    public EavsService(EavsRepository eavsRepository, CDcvapService cdcvapService) {
        this.eavsRepository = eavsRepository;
        this.cdcvapService = cdcvapService;
    }
    //GUI Use Cases 3,4,5
    public ProvisionalViewDTO getProvisionalViewForState(String stateFips, Integer year) {

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
            Double rowTotalCast = formatNull(p.prov_total_cast); //gui 5
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
                    rowTotalCast,
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
    //GUI Use Case 7
    public ActiveVotersViewDTO getActiveVotersViewForState(String stateFips, Integer year) {
        List<Eavs> rows = eavsRepository.findByStateFipsAndYear(stateFips, year);

        double total = 0.0;
        double active = 0.0;
        double inactive = 0.0;

        List<ActiveVotersRegionDTO> regions = new ArrayList<>();

        for (Eavs row : rows) {
            Eavs.Other o = row.getOther();
            double rowTotal = formatNull(o == null ? null : o.a12_total);
            double rowActive = formatNull(o == null ? null : o.a12_active);
            double rowInactive = formatNull(o == null ? null : o.a12_inactive);

            total += rowTotal;
            active += rowActive;
            inactive += rowInactive;

            regions.add(new ActiveVotersRegionDTO(
                    row.getState_fips(),          // or row.getStateFips()
                    row.getCounty_fips(),         // or unit_id if you join that way
                    row.getJuris_name(),
                    year,
                    rowTotal,
                    rowActive,
                    rowInactive
            ));
        }

        ActiveVotersSummaryDTO summary = new ActiveVotersSummaryDTO(
                Integer.valueOf(stateFips), // only if you made summary state_fips Integer; otherwise keep String
                year,
                total,
                active,
                inactive
        );

        return new ActiveVotersViewDTO(summary, regions);
    }

    //GUI Use Case 12
    public USEquipmentViewDTO getEquipmentInfo(Integer year){
        List<Eavs> rows = eavsRepository.findByYear(year);

        // state_fips -> [dreNo, dreWith, bmd, scanner]
        Map<String, double[]> sums = new HashMap<>();
        Map<String, String> abbr = new HashMap<>();

        for (Eavs row : rows) {
            String stateFips = row.getState_fips();
            if (stateFips == null) continue;

            abbr.putIfAbsent(stateFips, row.getState_abbr());

            Eavs.Other o = row.getOther();
            double dreNo = formatNull(o.dre_no_vvpat_total);
            double dreWith = formatNull(o.dre_with_vvpat_total);
            double bmd = formatNull(o.bmd_total);
            double scanner = formatNull(o.scanner_total);

            double[] acc = sums.computeIfAbsent(stateFips, k -> new double[4]);
            acc[0] += dreNo;
            acc[1] += dreWith;
            acc[2] += bmd;
            acc[3] += scanner;
        }

        List<EquipmentStateDTO> states = new ArrayList<>();
        for (Map.Entry<String, double[]> e : sums.entrySet()) {
            String stateFips = e.getKey();
            double[] acc = e.getValue();

            states.add(new EquipmentStateDTO(
                    stateFips,
                    abbr.get(stateFips),
                    year,
                    acc[0],
                    acc[1],
                    acc[2],
                    acc[3]
            ));
        }

        // optional sort for stable table ordering
        states.sort(Comparator.comparing(EquipmentStateDTO::state_fips));

        return new USEquipmentViewDTO(year, states);
    }

    //GUI Use Case 15
    public EAVSPoliticalComparisonDTO getPoliticalStateComparisonView(String stateFips, Integer year) {

        List<Eavs> rows = eavsRepository.findByStateFipsAndYear(stateFips, year);

        double totalBallotsAllMethods = 0.0;   // denominator for mail/dropbox %
        double mailVotes = 0.0;                // numerator for mail %
        double dropboxBallotsReturned = 0.0;   // numerator for dropbox %
        double registeredTotal = 0.0;          // denominator for turnout %

        for (Eavs row : rows) {

            Eavs.Early e = row.getEarly();
            totalBallotsAllMethods += formatNull(e == null ? null : e.total_voters_all_methods);

            Eavs.Mail m = row.getMail();
            mailVotes += formatNull(m == null ? null : m.mail_votes);
            dropboxBallotsReturned += formatNull(m == null ? null : m.dropbox_ballots_returned);

            Eavs.Other o = row.getOther();
            registeredTotal += formatNull(o == null ? null : o.a12_total);
        }

        double percentMail = (totalBallotsAllMethods == 0.0)
                ? 0.0
                : (mailVotes / totalBallotsAllMethods) * 100.0;

        double percentDropbox = (totalBallotsAllMethods == 0.0)
                ? 0.0
                : (dropboxBallotsReturned / totalBallotsAllMethods) * 100.0;

        double percentTurnout = (registeredTotal == 0.0)
                ? 0.0
                : (totalBallotsAllMethods / registeredTotal) * 100.0;

        return new EAVSPoliticalComparisonDTO(
                stateFips,
                year,
                percentMail,
                percentDropbox,
                percentTurnout
        );
    }

    public List<PoliticalStateComparisonDTO> getPoliticalStateComparisons(int year) {
        PoliticalStateComparisonDTO sc = polStateHelper("45", "South Carolina", "Republican", year);
        PoliticalStateComparisonDTO de = polStateHelper("10", "Delaware", "Democratic", year);
        return List.of(sc, de);
    }

    private PoliticalStateComparisonDTO polStateHelper(
            String stateFips,
            String stateName,
            String party,
            int year
    ) {
        List<Eavs> rows = eavsRepository.findByStateFipsAndYear(stateFips, year);

        long registeredTotal = 0L;
        double ballotsCast = 0.0;

        for (Eavs row : rows) {
            // registeredTotal (EAVS other.a12_total)
            if (row.getOther() != null && row.getOther().a12_total != null) {
                registeredTotal += row.getOther().a12_total.longValue();
            }

            // ballotsCast (EAVS early.total_voters_all_methods)
            if (row.getEarly() != null && row.getEarly().total_voters_all_methods != null) {
                ballotsCast += row.getEarly().total_voters_all_methods;
            }
        }

        long cvapTotal = cdcvapService.getStateCvapTotal(stateName);

        Double registrationRate = (cvapTotal == 0) ? null : (registeredTotal * 100.0) / cvapTotal;
        Double turnoutRate = (registeredTotal == 0) ? null : (ballotsCast * 100.0) / registeredTotal;

        return new PoliticalStateComparisonDTO(
                stateName,
                party,
                registeredTotal,
                registrationRate,
                ballotsCast,
                turnoutRate
        );
    }


    private double formatNull(Double value) {
        if (value == null) return 0.0;
        else if (value < 0) return 0.0;
        else return value;
    }
}
