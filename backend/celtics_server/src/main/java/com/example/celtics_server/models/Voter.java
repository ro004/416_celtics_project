package com.example.celtics_server.models;
//Bring in Spring data annotations
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

//Document path annotates for spring that instances of Voter live in mongodb collection 'voters'
@Document("voters")
public class Voter {
    //Id annotation marks field as the identifier for this document. Spring will map this to mongo _id field
    @Id
    private String id;

    @Field("Name")
    //map mongodb Name to name
    private final String name;

    @Field("PolitalAff")
    //Map mongodb PolitalAff to party
    private final String party;

    @Field("County_Desc")
    //Map mongodb County_desc to countyDesc
    private final String county;

    public Voter(String name, String party, String county){
        this.name = name;
        this.party = party;
        this.county = county;
    }

    //Getters
    public String getId(){return id;}
    public String getName(){return name;}
    public String getParty(){return party;}
    public String getCounty(){return county;}
}
