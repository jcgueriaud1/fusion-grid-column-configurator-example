package com.example.application.data.generator;

import com.example.application.data.entity.GridColumnConfigurator;
import com.example.application.data.entity.GridConfigurator;
import com.example.application.data.service.GridConfiguratorRepository;
import com.example.application.data.service.PersonRepository;
import com.vaadin.flow.spring.annotation.SpringComponent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;

@SpringComponent
public class DataGenerator {

    @Bean
    public CommandLineRunner loadData(PersonRepository personRepository) {
        return args -> {
            Logger logger = LoggerFactory.getLogger(getClass());
            if (personRepository.count() != 0L) {
                logger.info("Using existing database");
                return;
            }
            int seed = 123;

            logger.info("Generating demo data");

            logger.info("... generating 100 Person entities...");
            personRepository.saveAll(PersonData.generatePerson(100));

            logger.info("Generated demo data");


            logger.info("Generate Person grid column configuration");

        };
    }

    @Bean
    public CommandLineRunner loadPersonGridConfiguration(GridConfiguratorRepository gridConfiguratorRepository) {
        return args -> {
            Logger logger = LoggerFactory.getLogger(getClass());
            if (gridConfiguratorRepository.count() != 0L) {
                logger.info("Using existing database");
                return;
            }

            GridConfigurator gridConfigurator = new GridConfigurator();
            gridConfigurator.setName("person");
            gridConfigurator.getColumns().add(new GridColumnConfigurator("First Name","firstName", true, 0));
            GridColumnConfigurator gridColumnConfigurator = new GridColumnConfigurator("Last Name", "lastName", true, 1);
            gridColumnConfigurator.setDirection("asc");
            gridConfigurator.getColumns().add(gridColumnConfigurator);
            gridConfigurator.getColumns().add(new GridColumnConfigurator("Email","email", false, 2));
            gridConfigurator.getColumns().add(new GridColumnConfigurator("Birth date","dateOfBirth", true, 3));
            gridConfigurator.getColumns().add(new GridColumnConfigurator("Occupation","occupation", true, 5));
            gridConfigurator.getColumns().add(new GridColumnConfigurator("Important?","important", true, 4));
            gridConfiguratorRepository.save(gridConfigurator);
            logger.info("Generated demo data");


            logger.info("Generate Person grid column configuration");

        };
    }
}