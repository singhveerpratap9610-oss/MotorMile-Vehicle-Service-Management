package com.motormile.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.motormile.model.Vehicle;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {}