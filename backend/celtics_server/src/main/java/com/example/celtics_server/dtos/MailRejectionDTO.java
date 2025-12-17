package com.example.celtics_server.dtos;

public record MailRejectionDTO(
        String stateFips,
        Integer year,
        Double C9b,  // mail_rejected_late
        Double C9c,  // mail_rejected_missing_voter_signature
        Double C9d,  // mail_rejected_missing_witness_signature
        Double C9e,  // mail_rejected_bad_signature_voter
        Double C9f,  // mail_rejected_unofficial_envelope
        Double C9g,  // mail_rejected_ballot_missing_from_envelope
        Double C9h,  // mail_rejected_no_secrecy_envelope
        Double C9i,  // mail_rejected_multiple_in_envelope
        Double C9j,  // mail_rejected_envelope_not_sealed
        Double C9k,  // mail_rejected_no_postmark
        Double C9l,  // mail_rejected_no_resident_address
        Double C9m,  // mail_rejected_voter_deceased
        Double C9n,  // mail_rejected_already_voted
        Double C9o,  // mail_rejected_missing_docs
        Double C9p,  // mail_rejected_not_eligible
        Double C9q   // mail_rejected_no_application
) {}
