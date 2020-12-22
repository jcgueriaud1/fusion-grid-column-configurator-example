package com.example.application.data.endpoint;

import com.example.application.data.CrudEndpoint;
import com.example.application.data.entity.GridConfigurator;
import com.example.application.data.service.GridConfiguratorService;
import com.vaadin.flow.server.connect.Endpoint;
import com.vaadin.flow.server.connect.auth.AnonymousAllowed;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Optional;

@AnonymousAllowed
@Endpoint
public class GridConfiguratorEndpoint extends CrudEndpoint<GridConfigurator, Integer> {

    private GridConfiguratorService service;

    public GridConfiguratorEndpoint(@Autowired GridConfiguratorService service) {
        this.service = service;
    }

    @Override
    protected GridConfiguratorService getService() {
        return service;
    }


    public Optional<GridConfigurator> findByName(String name) {
        return getService().findByName(name);
    }
}
