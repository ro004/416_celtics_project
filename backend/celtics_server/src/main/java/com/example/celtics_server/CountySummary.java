package com.example.celtics_server;

public class CountySummary {
    private String county;
    private long democraticVotes;
    private long republicanVotes;
    private long independentVotes;
    private long totalVotes;

    public CountySummary(String county){
        this.county = county;
    }
    public String getCounty(){return county;}
    public long getDemocraticVotes(){return democraticVotes;}

    public long getRepublicanVotes() {
        return republicanVotes;
    }

    public long getIndependentVotes() {
        return independentVotes;
    }

    public long getTotalVotes() {
        return totalVotes;
    }

    public void incrementDem(long c){this.democraticVotes += c;}
    public void incrementRep(long c){this.republicanVotes += c;}
    public void incrementInd(long c){this.independentVotes += c;}
    public void incrementTotal(long c){this.totalVotes += c;}
}
