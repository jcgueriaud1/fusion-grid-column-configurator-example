package com.example.application.data.entity;

import com.example.application.data.AbstractEntity;

import javax.annotation.Nullable;
import javax.persistence.Entity;

@Entity
public class GridColumnConfigurator extends AbstractEntity {

    private String headerText;
    private String path;
    private boolean visible;
    private int orderColumn;
    @Nullable
    private String direction;

    public GridColumnConfigurator() {
        super();
    }

    public GridColumnConfigurator(String headerText, String path, boolean visible, int orderColumn) {
        this.headerText = headerText;
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

    public String getHeaderText() {
        return headerText;
    }

    public void setHeaderText(String headerText) {
        this.headerText = headerText;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    public enum GridDirection {

        asc(1), desc(2);

        private final int value;

        GridDirection(int value) {
            this.value = value;
        }

        public int getValue() {
            return this.value;
        }
    }
}
