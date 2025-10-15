package com.example.celtics_server;

public class CountyPartyCount {
    private String county;
    private String party;
    private long count;

    public CountyPartyCount(){}

    public CountyPartyCount(String county, String party, long count){
        this.county = county;
        this.party = party;
        this.count = count;
    }

    public String getCounty(){return county;}
    public String getParty(){return party;}
    public long getCount(){return count;}
}
