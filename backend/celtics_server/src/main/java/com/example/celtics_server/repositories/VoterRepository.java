package com.example.celtics_server.repositories;

//Gain access to Spring data repo for mongodb, with methods like findAll() instead of always writing queries
import com.example.celtics_server.CountyPartyCount;
import com.example.celtics_server.models.Voter;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
//This interface is a Spring-managed data component which is part of the repository layer
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
//Creating this repo allows us to managevoter documents more easily with built-in methods
public interface VoterRepository extends MongoRepository<Voter, String> {
    //MongoRepository<TypeOfDocument, ID>
    //Model class and type of document's @Id field as the 2 arguments from the voter class

    //Query annotations tell us that we are defining a custom MongoDB query that the repo can execute when
    // called in the controller. Note the Arguments MUST match the spelling of the fields in the db, as Spring
    //Will not translate this query.
    //Example: @Query("{'County_Desc': ?0, 'PolitalAff': ?1}")
    //?0 and ?1 represent the expected index of the field when passed as arguments

    //Spring is nice because it auto implements the queries for us, we just have to define what we are searching for,
    //and what we want returned (A list of voter documents matching the parameters), so we don't actually have to do the
    //annotation


    //These queries are all to voters.json, which holds voter data of Oklahoma residents

    //Query to get list of voters by county and a specific party
    List<Voter> findByCountyAndParty(String county, String party);

    //Query to get list of voters by a specific county
    List<Voter> findByCounty(String county);

    //Query to get list of voters by a specific party
    List<Voter> findByParty(String party);

    //Aggregation pipeline to gather voters by county and their party
    @Aggregation(pipeline = {"{$group: {_id: {county: '$County_Desc', party: '$PolitalAff'}, count: {$sum: 1}}}"})
    List<CountyPartyCount> findVoterCountByCountyAndParty();
}
