package com.example.celtics_server.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.OffsetDateTime;
import java.util.List;

@Document("eavs")
public class Eavs {

    @Id
    private String id;

    @Field("state_fips")
    private Integer state_fips;

    @Field("county_fips")
    private Integer county_fips;

    @Field("unit_id")
    private Integer unit_id;                                                                   // EAVS unit id

    @Field("state_abbr")
    private String state_abbr;                                                                 // "WI", "ME", ...

    @Field("juris_name")
    private String juris_name;

    private Integer year;



    private Mail mail;
    private Provisional provisional;
    private Early early;
    private Equipment equipment;
    private Qa qa;
    private Meta meta;
    private Other other;

    // getters
    public Integer getState_fips(){
        return state_fips;
    }

    public Integer getCounty_fips(){
        return county_fips;
    }

    public String getJuris_name(){
        return juris_name;
    }

    public Provisional getProvisional(){
        return provisional;
    }

    // MAIL: mail ballots, rejections, drop boxes – GUI-9, 15, 24, 25

    public static class Mail {
        public Double mail_votes;                     // total mail ballots cast
        public Double mail_votes_vbm_juris;

        public Double mail_votes_share;
        public Double mail_counted_total;            // counted absentee – for turnout denom
        public Double mail_rejected_total;           // C9a – used in rejected-ballot % (GUI-25)
        public Double mail_rejected_late;

        // Rejection reasons – needed for rejected-ballot analysis & future GUI-9
        public Double mail_rejected_missing_voter_signature;
        public Double mail_rejected_missing_witness_signature;
        public Double mail_rejected_bad_signature_voter;
        public Double mail_rejected_unofficial_envelope;
        public Double mail_rejected_ballot_missing_from_envelope;
        public Double mail_rejected_no_secrecy_envelope;
        public Double mail_rejected_multiple_in_envelope;
        public Double mail_rejected_envelope_not_sealed;
        public Double mail_rejected_no_postmark;
        public Double mail_rejected_no_resident_address;
        public Double mail_rejected_voter_deceased;
        public Double mail_rejected_already_voted;
        public Double mail_rejected_missing_docs;
        public Double mail_rejected_not_eligible;
        public Double mail_rejected_no_application;
        public Double mail_rejected_other_1;
        public Double mail_rejected_other_2;
        public Double mail_rejected_other_3;

        // Drop box data – GUI-15, GUI-24 (C3a)
        public Double dropbox_total_reported;
        public Double dropbox_ballots_returned;      // use this as “total drop box votes (C3a)”

        // Cure stats – may be useful for missing-data measure or extra analysis
        public Double cure_entered_total;
        public Double cure_successful;
        public Double cure_unsuccessful;


        public Double mail_reject_share;
        public Double mail_rejected_reasons_sum;
    }

    // PROVISIONAL: totals + E2 reasons – GUI-3, 4, 5, 25

    public static class Provisional {

        public Double prov_total_cast;               // E1a – GUI-5 choropleth
        public Double prov_full_counted;
        public Double prov_partial_counted;
        public Double prov_rejected;                 // E1d – rejected provisional (GUI-25)
        public Double prov_other_status;

        public Double prov_reason_not_on_list;
        public Double prov_reason_lacked_id;
        public Double prov_reason_official_challenged;
        public Double prov_reason_other_person_challenged;
        public Double prov_reason_not_resident;
        public Double prov_reason_reg_not_updated;
        public Double prov_reason_did_not_surrender_mail;
        public Double prov_reason_extended_hours;
        public Double prov_reason_used_SDR;
        public Double prov_reason_other_1;
        public Double prov_reason_other_2;
        public Double prov_reason_other_3;

        //GUI Use Case 3, 4
        public Double prov_rejected_total_detail;                               //E2a
        public Double prov_rejected_not_registered;                             //E2b
        public Double prov_rejected_wrong_jurisdiction;                         //E2c
        public Double prov_rejected_wrong_precinct;                             //E2d
        public Double prov_rejected_no_id;                                      //E2e
        public Double prov_rejected_incomplete;                                 //E2f
        public Double prov_rejected_ballot_missing;                             //E2g
        public Double prov_rejected_no_signature;                               //E2h
        public Double prov_rejected_bad_signature;                              //E2i
        public Double prov_rejected_already_voted;
        public Double prov_rejected_other_1;
        public Double prov_rejected_other_2;
        public Double prov_rejected_other_3;
    }

    // EARLY: turnout components & UOCAVA – GUI-15, 23, 24, 25
    public static class Early {
        public Double total_voters_all_methods;      // total ballots in unit – turnout denom
        public Double in_person_election_day;        // Election Day ballots
        public Double absentee_uocava;               // B24a-ish – for rejected-ballot combo
        public Double provisional_votes;             // may be separate from prov_total_cast
        public Double early_in_person_votes;         // Early In-Person Ballots Counted
        public Double other_participation;           // anything else
        public Double early_in_person_votes_share;
        public Double early_total;                   // total early (mail + early in-person)
        public Double early_total_share;

        public Double provisional_accept_share;
        public Double provisional_reject_share;
    }

    // EQUIPMENT: availability + detailed inventory – GUI-6, 10–14, 25, 27
    public static class Equipment {
        // Simple availability / flags per category (per unit)
        public Double equip_bmd_available;
        public Double equip_dre_novvpat_available;
        public Double equip_dre_vvpat_available;
        public Double equip_scanner_available;
        public Double equip_handcount_available;
        public Double equip_epollbook_available;
        public Double equip_accessible_available;

        // Detailed inventory – per device model, for GUI-6, 12, 13, 14
        public List<InventoryItem> inventory;
    }

    public static class InventoryItem {
        public String category;          // "scanner", "dre_no_vvpat", "dre_vvpat", "bmd", ...
        public String make;
        public String model;
        public Integer quantity;
        public Integer first_year_used;  // for age 2016–2024 (GUI-11, 14)
        public String vvsg_cert;         // certification category (VVSG 2.0, 1.1, etc.)
        public String underlying_os;

        // These support Prepro-6 + GUI-6/13/25 equipment quality metric
        public Double scan_rate;
        public Double error_rate;
        public Double reliability;
        public Double quality_score;     // your derived 0–1 measure
    }

    // QA: for Prepro-5 missing-data measure & sanity checks
    public static class Qa {
        public Double qa_negative_value;
        public Boolean qa_negative_flag;
        public Boolean qa_component_gt_total_voters;
        public Boolean qa_invalid_equip_bmd_available;
        public Boolean qa_invalid_equip_dre_novvpat_available;
        public Boolean qa_invalid_equip_dre_vvpat_available;
        public Boolean qa_invalid_equip_scanner_available;
        public Boolean qa_invalid_equip_handcount_available;
        public Boolean qa_invalid_equip_epollbook_available;
        public Boolean qa_invalid_equip_accessible_available;
        public Boolean qa_reasons_gt_total;
        public Boolean qa_total_missing_but_reasons_present;
        public Boolean qa_reasons_missing_but_total_present;
        public Boolean qa_counted_gt_total;
        public Boolean qa_rejected_gt_total;
        public Boolean qa_activity_with_zero_total;
        public Boolean qa_reg_total_mismatch;
    }

    // META: miss-reason tags & misc – for missingness metric (Prepro-5)
    public static class Meta {
        public String total_voters_all_methods_miss_reason;
        public String in_person_election_day_miss_reason;
        public String absentee_uocava_miss_reason;
        public String provisional_votes_miss_reason;
        public String other_participation_miss_reason;

        // registration-related miss reasons (for GUI-7, 21, 22)
        public String a12_total_miss_reason;
        public String a12_active_miss_reason;
        public String a12_inactive_miss_reason;
    }

    // OTHER: registration counts + state-level equipment totals – GUI-2, 7, 12, 15, 21, 22
    public static class Other {
        // Registration: this is how your JSON is currently storing A12 totals
        public Double a12_total;        // treat as “total registered” for 2024
        public Double a12_active;       // active voters
        public Double a12_inactive;     // inactive voters

        // Equipment totals by category at the unit level – used for GUI-10, 12, 13
        public Double dre_no_vvpat_total;
        public Double dre_with_vvpat_total;
        public Double bmd_total;
        public Double scanner_total;
        public Double hand_count_total;

        // Usage context flags – useful for equipment quality and GUI-10 map
        public Double dre_no_vvpat_use_regular;
        public Double dre_no_vvpat_use_accessible;
        public Double dre_no_vvpat_use_provisional;
        public Double dre_no_vvpat_use_in_person_early;

        public Double dre_with_vvpat_use_regular;
        public Double dre_with_vvpat_use_accessible;
        public Double dre_with_vvpat_use_provisional;
        public Double dre_with_vvpat_use_in_person_early;

        public Double bmd_use_regular;
        public Double bmd_use_accessible;
        public Double bmd_use_provisional;
        public Double bmd_use_in_person_early;
        public Double bmd_use_mail_ballot;

        public Double scanner_use_regular;
        public Double scanner_use_accessible;
        public Double scanner_use_provisional;
        public Double scanner_use_in_person_early;
        public Double scanner_use_mail_ballot;

        public Double hand_count_use_regular;
        public Double hand_count_use_accessible;
        public Double hand_count_use_provisional;
        public Double hand_count_use_in_person_early;
        public Double hand_count_use_mail_ballot;

        public String source_file;
        public String ingested_at;      // or OffsetDateTime if you normalize it
    }
}
