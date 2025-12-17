package com.example.celtics_server.repositories;

import com.example.celtics_server.dtos.VoterRegCountyAggDTO;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.ConditionalOperators;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class VoterRepositoryCustomImpl implements VoterRepositoryCustom {

    private final MongoTemplate mongoTemplate;

    public VoterRepositoryCustomImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public List<VoterRegCountyAggDTO> aggregateByCounty() {
        Aggregation agg = Aggregation.newAggregation(
                Aggregation.group("County_Desc")
                        .count().as("registered_total")
                        .sum(ConditionalOperators.when(Criteria.where("PolitalAff").is("Dem")).then(1).otherwise(0)).as("democratic")
                        .sum(ConditionalOperators.when(Criteria.where("PolitalAff").is("Rep")).then(1).otherwise(0)).as("republican")
                        .sum(ConditionalOperators.when(Criteria.where("PolitalAff").is("Ind")).then(1).otherwise(0)).as("unaffiliated"),

                Aggregation.project("registered_total", "democratic", "republican", "unaffiliated")
                        .and("_id").as("county"),

                Aggregation.sort(Sort.Direction.ASC, "county")
        );
        return mongoTemplate.aggregate(agg, "voters", VoterRegCountyAggDTO.class)
                .getMappedResults();
    }
}
