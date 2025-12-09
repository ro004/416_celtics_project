package com.example.celtics_server.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document("voters")
public class Voter {
    @Id
    private String id;

    @Field("Name")
    private final String name;

    @Field("PolitalAff")
    private final String party;

    @Field("County_Desc")
    private final String county;

    public Voter(String name, String party, String county){
        this.name = name;
        this.party = party;
        this.county = county;
    }

    //Getters
    public String getId() {
        return id;
    }
    public String getName(){
        return name;
    }
    public String getParty(){
        return party;
    }
    public String getCounty(){
        return county;
    }
}
