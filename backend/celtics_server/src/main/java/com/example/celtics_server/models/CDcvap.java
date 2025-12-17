package com.example.celtics_server.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Document(collection = "cdcvap")
public class CDcvap {

    @Id
    private String id;

    private String geoname;
    private String state;
    private Map<String, Integer> races;

    public String getId() { return id; }
    public String getGeoname() { return geoname; }
    public String getState() { return state; }
    public Map<String, Integer> getRaces() { return races; }
}

