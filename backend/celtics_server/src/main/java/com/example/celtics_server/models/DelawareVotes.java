package com.example.celtics_server.models;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

@Document("delaware")
public class DelawareVotes {
    @Id
    private String id;
    private String county;
    private Votes votes;

    public DelawareVotes(){
        this.id = null;
        this.county = null;
        this.votes = null;
    }

    public String getId(){return id;}
    public String getCounty(){return county;}
    public Votes getVotes(){return votes;}
    public void setId(String id){this.id = id;}
    public void setCounty(String county){this.county = county;}
    public void setVotes(Votes votes){this.votes = votes;}

    public static class Votes{
        private Party democrat;
        private Party republican;

        public Votes(){
            this.democrat = null;
            this.republican = null;
        }

        public Party getDemocrat(){return democrat;}
        public Party getRepublican(){return republican;}
        public void setDemocrat(Party democrat){this.democrat = democrat;}
        public void setRepublican(Party republican){this.republican = republican;}
    }
    public static class Party{
        private String count;
        private double percent;

        public Party(){
            this.count = null;
            this.percent = 0.0;
        }

        public String getCount(){return count;}
        public double getPercent(){return percent;}
        public void setCount(String count){this.count = count;}
        public void setPercent(double percent){this.percent = percent;}
    }
}
