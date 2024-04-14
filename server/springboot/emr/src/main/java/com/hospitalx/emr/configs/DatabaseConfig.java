package com.hospitalx.emr.configs;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoIterable;

import lombok.extern.slf4j.Slf4j;

/**
 * DatabaseConfig
 */
@Configuration
@Slf4j
public class DatabaseConfig extends AbstractMongoClientConfiguration {

    @Value("${spring.data.mongodb.uri}")
    private String uri;

    @Value("${spring.data.mongodb.database}")
    private String database;

    @Override
    protected String getDatabaseName() {
        return database;
    }

    @Override
    public MongoClient mongoClient() {
        MongoClient client = MongoClients.create(uri);
        try {
            MongoIterable<String> databases = client.listDatabaseNames();
            List<String> resultdb = new ArrayList<>();
            for (String dbname : databases) {
                resultdb.add(dbname);
            }
            log.info("MongoDB database connected. List databases name: " + resultdb);
        } catch (Exception e) {
            log.error("Failed to connect mongoDB database: " + e);
        }
        return client;
    }

}
