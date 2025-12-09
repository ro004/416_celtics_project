package com.example.celtics_server.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("VoteResult")
public class PoliticalPartyVotes {
    @Id
    private String id;
    private String state;
    private Split split;

    public PoliticalPartyVotes() {}

    public String getId() {
        return id;
    }

    public String getState() {
        return state;
    }

    public Split getSplit() {
        return split;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setState(String state) {
        this.state = state;
    }

    public void setSplit(Split split) {
        this.split = split;
    }

    public static class Split {

        private int democratic;
        private int republican;

        public Split() {}

        public int getDemocratic() {
            return democratic;
        }

        public int getRepublican() {
            return republican;
        }

        public void setDemocratic(int democratic) {
            this.democratic = democratic;
        }

        public void setRepublican(int republican) {
            this.republican = republican;
        }
    }
}
