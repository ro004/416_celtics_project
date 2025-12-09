package com.example.celtics_server.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document("felony_policy")
public class FelonyPolicy {

    @Id
    private String id;

    @Field("state_name")
    private String stateName;

    @Field("policy_category")
    private String policyCategory;

    @Field("notes")
    private String notes;

    public FelonyPolicy() {
    }

    public FelonyPolicy(String stateName, String policyCategory, String notes) {
        this.stateName = stateName;
        this.policyCategory = policyCategory;
        this.notes = notes;
    }

    public String getId() {
        return id;
    }

    public String getStateName() {
        return stateName;
    }

    public void setStateName(String stateName) {
        this.stateName = stateName;
    }

    public String getPolicyCategory() {
        return policyCategory;
    }

    public void setPolicyCategory(String policyCategory) {
        this.policyCategory = policyCategory;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
