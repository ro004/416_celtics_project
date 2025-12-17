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
    //GUI Use case 2
    public CvapPctDTO getCvapEligibilityPct(String stateFips, String stateName) {

        // Only Political Party detailed states (your project definition)
        if (!Set.of("10", "45").contains(stateFips)) {
            return new CvapPctDTO(null);
        }

        List<Eavs> rows = eavsRepository.findByStateFipsAndYear(stateFips, 2024);

        // Numerator: SUM of registered voters (A12 total)
        long registeredTotal = 0L;
        for (Eavs row : rows) {
            if (row.getOther() != null && row.getOther().a12_total != null) {
                registeredTotal += row.getOther().a12_total.longValue();
            }
        }

        // Denominator: 2023 ACS CVAP
        long cvapTotal = cdcvapService.getStateCvapTotal(stateName);

        // Guard against missing CVAP
        if (cvapTotal == 0) {
            return new CvapPctDTO(null);
        }

        Double pct = (registeredTotal * 100.0) / cvapTotal;

        return new CvapPctDTO(pct);
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

    public MailRejectionViewDTO getMailRejectionViewForState(String stateFips, Integer year) {

        List<Eavs> rows = eavsRepository.findByStateFipsAndYear(stateFips, year);

        // Hardcoded detailed-data states
        boolean detailedDataState = Set.of("10", "45", "40", "8").contains(stateFips);
        // DE=10, SC=45, OK=40, CO=8

        // -----------------------------
        // Statewide totals (bar chart)
        // -----------------------------
        double C9b = 0, C9c = 0, C9d = 0, C9e = 0, C9f = 0, C9g = 0, C9h = 0, C9i = 0;
        double C9j = 0, C9k = 0, C9l = 0, C9m = 0, C9n = 0, C9o = 0, C9p = 0, C9q = 0;

        // Denominator for choropleth (C9a)
        double stateTotalRejected = 0.0;

        for (Eavs r : rows) {
            Eavs.Mail m = r.getMail();
            if (m == null) continue;

            stateTotalRejected += formatNull(m.mail_rejected_total);

            C9b += formatNull(m.mail_rejected_late);
            C9c += formatNull(m.mail_rejected_missing_voter_signature);
            C9d += formatNull(m.mail_rejected_missing_witness_signature);
            C9e += formatNull(m.mail_rejected_bad_signature_voter);
            C9f += formatNull(m.mail_rejected_unofficial_envelope);
            C9g += formatNull(m.mail_rejected_ballot_missing_from_envelope);
            C9h += formatNull(m.mail_rejected_no_secrecy_envelope);
            C9i += formatNull(m.mail_rejected_multiple_in_envelope);
            C9j += formatNull(m.mail_rejected_envelope_not_sealed);
            C9k += formatNull(m.mail_rejected_no_postmark);
            C9l += formatNull(m.mail_rejected_no_resident_address);
            C9m += formatNull(m.mail_rejected_voter_deceased);
            C9n += formatNull(m.mail_rejected_already_voted);
            C9o += formatNull(m.mail_rejected_missing_docs);
            C9p += formatNull(m.mail_rejected_not_eligible);
            C9q += formatNull(m.mail_rejected_no_application);
        }

        MailRejectionDTO summary = new MailRejectionDTO(
                stateFips,
                year,
                C9b,
                C9c,
                C9d,
                C9e,
                C9f,
                C9g,
                C9h,
                C9i,
                C9j, C9k, C9l, C9m, C9n, C9o, C9p, C9q
        );

        // -----------------------------
        // Table rows + choropleth values
        // -----------------------------
        List<CountyMailRejectionDTO> counties = new ArrayList<>();

        for (Eavs r : rows) {
            Eavs.Mail m = r.getMail();
            if (m == null) continue;

            double unitRejected = formatNull(m.mail_rejected_total);
            double pctOfState = (stateTotalRejected > 0)
                    ? (unitRejected / stateTotalRejected) * 100.0
                    : 0.0;

            counties.add(new CountyMailRejectionDTO(
                    r.getState_fips(),
                    r.getCounty_fips(),
                    r.getJuris_name(),
                    formatNull(m.mail_rejected_total),   // keep raw if you want, or formatNull
                    pctOfState,

                    formatNull(m.mail_rejected_late),
                    formatNull(m.mail_rejected_missing_voter_signature),
                    formatNull(m.mail_rejected_missing_witness_signature),
                    formatNull(m.mail_rejected_bad_signature_voter),
                    formatNull(m.mail_rejected_unofficial_envelope),
                    formatNull(m.mail_rejected_ballot_missing_from_envelope),
                    formatNull(m.mail_rejected_no_secrecy_envelope),
                    formatNull(m.mail_rejected_multiple_in_envelope),
                    formatNull(m.mail_rejected_envelope_not_sealed),
                    formatNull(m.mail_rejected_no_postmark),
                    formatNull(m.mail_rejected_no_resident_address),
                    formatNull(m.mail_rejected_voter_deceased),
                    formatNull(m.mail_rejected_already_voted),
                    formatNull(m.mail_rejected_missing_docs),
                    formatNull(m.mail_rejected_not_eligible),
                    formatNull(m.mail_rejected_no_application)
            ));

        }

        return new MailRejectionViewDTO(
                summary,
                counties,
                detailedDataState
        );
    }
    //GUI Use Case 10
    public List<VotingEquipmentDTO> getVotingEquipmentForState(String stateFips, Integer year) {

        // GUI-10 only applies to detailed states
        if (!Set.of("10", "45", "40", "8").contains(stateFips)) {
            return List.of();
        }

        List<Eavs> rows = eavsRepository.findByStateFipsAndYear(stateFips, year);
        List<VotingEquipmentDTO> result = new ArrayList<>();

        for (Eavs r : rows) {
            Eavs.Equipment e = r.getEquipment();
            if (e == null) continue;

            boolean dreNoVvpat = e.equip_dre_novvpat_available != null && e.equip_dre_novvpat_available > 0;
            boolean dreWithVvpat = e.equip_dre_vvpat_available != null && e.equip_dre_vvpat_available > 0;
            boolean bmd = e.equip_bmd_available != null && e.equip_bmd_available > 0;
            boolean scanner = e.equip_scanner_available != null && e.equip_scanner_available > 0;

            result.add(new VotingEquipmentDTO(
                    r.getState_fips(),
                    r.getCounty_fips(),
                    r.getJuris_name(),
                    dreNoVvpat,
                    dreWithVvpat,
                    bmd,
                    scanner
            ));
        }

        return result;
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

    public List<OptInOptOutDTO> getOptInOptOutComparisons(int year) {
        OptInOptOutDTO sc = optHelper("45", "South Carolina", "South Carolina: Opt-In", year);
        OptInOptOutDTO co = optHelper("8", "Colorado", "Colorado: Opt-Out (Same-Day Registration)", year);
        OptInOptOutDTO de = optHelper("10", "Delaware", "Delaware: Opt-Out (No Same-Day Registration)", year);

        return List.of(sc, co, de);
    }

    private OptInOptOutDTO optHelper(
            String stateFips,
            String stateName,
            String stateTypeLabel,
            int year
    ) {
        List<Eavs> rows = eavsRepository.findByStateFipsAndYear(stateFips, year);

        long registeredTotal = 0L;
        double ballotsCast = 0.0;

        for (Eavs row : rows) {
            // registration total: SUM of counties
            if (row.getOther() != null && row.getOther().a12_total != null) {
                registeredTotal += row.getOther().a12_total.longValue();
            }

            // ballots cast: MAX (statewide row tends to exist)
            if (row.getEarly() != null && row.getEarly().total_voters_all_methods != null) {
                ballotsCast = Math.max(ballotsCast, row.getEarly().total_voters_all_methods);
            }
        }

        long cvapTotal = cdcvapService.getStateCvapTotal(stateName);

        // Fallback for Colorado (CVAP not in DB)
        if (cvapTotal == 0 && "Colorado".equals(stateName) && year == 2024) {
            cvapTotal = 4303430;   // define this constant in the service
        }

        Double registrationRate = (cvapTotal == 0) ? null : (registeredTotal * 100.0) / cvapTotal;
        Double turnoutRate = (registeredTotal == 0) ? null : (ballotsCast * 100.0) / registeredTotal;

        return new OptInOptOutDTO(
                stateName,
                stateTypeLabel,   // reusing "party" field as "stateType"
                registeredTotal,
                registrationRate,
                ballotsCast,
                turnoutRate
        );
    }


    //GUI 22
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

    public List<PoliticalEarlyVotingComparisonDTO> getPoliticalEarlyVotingComparisons(int year) {
        PoliticalEarlyVotingComparisonDTO sc = polEarlyHelper("45", "South Carolina", "Republican", year);
        PoliticalEarlyVotingComparisonDTO de = polEarlyHelper("10", "Delaware", "Democratic", year);
        return List.of(sc, de);
    }

    private PoliticalEarlyVotingComparisonDTO polEarlyHelper(
            String stateFips,
            String stateName,
            String party,
            int year
    ) {
        List<Eavs> rows = eavsRepository.findByStateFipsAndYear(stateFips, year);

        double totalVotes = 0.0;
        double earlyTotal = 0.0;
        double inPersonEarly = 0.0;
        double mailEarly = 0.0;

        for (Eavs row : rows) {
            if (row.getEarly() == null) continue;

            if (row.getEarly().total_voters_all_methods != null) {
                totalVotes = Math.max(totalVotes, row.getEarly().total_voters_all_methods);
            }
            if (row.getEarly().early_total != null) {
                earlyTotal = Math.max(earlyTotal, row.getEarly().early_total);
            }
            if (row.getEarly().early_in_person_votes != null) {
                inPersonEarly = Math.max(inPersonEarly, row.getEarly().early_in_person_votes);
            }
            if (row.getEarly().absentee_uocava != null) {
                mailEarly = Math.max(mailEarly, row.getEarly().absentee_uocava);
            }
        }

        Double earlyRate = (totalVotes == 0) ? null : (earlyTotal * 100.0) / totalVotes;
        Double inPersonRate = (totalVotes == 0) ? null : (inPersonEarly * 100.0) / totalVotes;
        Double mailRate = (totalVotes == 0) ? null : (mailEarly * 100.0) / totalVotes;

        return new PoliticalEarlyVotingComparisonDTO(
                stateName,
                party,
                totalVotes,
                earlyTotal,
                earlyRate,
                inPersonEarly,
                inPersonRate,
                mailEarly,
                mailRate
        );
    }

    private double formatNull(Double value) {
        if (value == null) return 0.0;
        else if (value < 0) return 0.0;
        else return value;
    }
}
