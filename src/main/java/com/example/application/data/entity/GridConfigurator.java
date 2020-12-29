package com.example.application.data.entity;

import com.example.application.data.AbstractEntity;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

@Entity
public class GridConfigurator extends AbstractEntity {

    private Boolean multisort;

    private String name;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<GridColumnConfigurator> columns = new ArrayList<>();

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<GridColumnConfigurator> getColumns() {
        return columns;
    }

    public void setColumns(List<GridColumnConfigurator> columns) {
        this.columns = columns;
    }

    public Boolean getMultisort() {
        return multisort;
    }

    public void setMultisort(Boolean multisort) {
        this.multisort = multisort;
    }
}
