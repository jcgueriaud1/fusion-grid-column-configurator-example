package com.example.application.data.entity;

import com.example.application.data.AbstractEntity;

import javax.persistence.Entity;

@Entity
public class GridColumnConfigurator extends AbstractEntity {

    private String path;
    private boolean visible;
    private int orderColumn;

    public GridColumnConfigurator() {
        super();
    }

    public GridColumnConfigurator(String path, boolean visible, int orderColumn) {
        this();
        this.path = path;
        this.visible = visible;
        this.orderColumn = orderColumn;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public boolean isVisible() {
        return visible;
    }

    public void setVisible(boolean visible) {
        this.visible = visible;
    }

    public int getOrderColumn() {
        return orderColumn;
    }

    public void setOrderColumn(int orderColumn) {
        this.orderColumn = orderColumn;
    }
}
