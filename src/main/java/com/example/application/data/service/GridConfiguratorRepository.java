package com.example.application.data.service;

import com.example.application.data.entity.GridConfigurator;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GridConfiguratorRepository extends JpaRepository<GridConfigurator, Integer> {

    Optional<GridConfigurator> findByName(String name);
}