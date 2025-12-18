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

    @Field("blockBubble")
    private final BlockBubble blockBubble;

    public static class BlockBubble {
        @Field("id")
        private String id;

        @Field("lon")
        private Double lon;

        @Field("lat")
        private Double lat;

        // majorityParty exists in JSON but we will NOT trust it; we compute winner ourselves
        @Field("majorityParty")
        private String majorityParty;

        public String getId() { return id; }
        public Double getLon() { return lon; }
        public Double getLat() { return lat; }
        public String getMajorityParty() { return majorityParty; }
    }

    public Voter(String name, String party, String county, String census_block, BlockBubble blockBubble){
        this.name = name;
        this.party = party;
        this.county = county;
        this.census_block = census_block;
        this.blockBubble = blockBubble;
    }

    //Getters
    public String getId() { return id; }
    public String getName(){ return name; }
    public String getParty(){ return party; }
    public String getCounty(){ return county; }
    public String getCensus_block(){ return census_block; }

    public BlockBubble getBlockBubble() { return blockBubble; }
}
