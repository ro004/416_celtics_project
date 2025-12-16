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

    @Field("Census_Block")
    private final String census_block;

    public Voter(String name, String party, String county, String census_block){
        this.name = name;
        this.party = party;
        this.county = county;
        this.census_block = census_block;
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
    public String getCensus_block(){
        return census_block;
    }
}
