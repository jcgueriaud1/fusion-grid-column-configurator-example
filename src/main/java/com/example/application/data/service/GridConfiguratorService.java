package com.example.application.data.service;

import com.example.application.data.entity.GridConfigurator;
import org.springframework.stereotype.Service;
import org.vaadin.artur.helpers.CrudService;

import java.util.Optional;

@Service
public class GridConfiguratorService extends CrudService<GridConfigurator, Integer> {

    private final GridConfiguratorRepository repository;

    public GridConfiguratorService(GridConfiguratorRepository repository) {
        this.repository = repository;
    }

    @Override
    protected GridConfiguratorRepository getRepository() {
        return repository;
    }

    public Optional<GridConfigurator> findByName(String name) {
        return repository.findByName(name);
    }

}
