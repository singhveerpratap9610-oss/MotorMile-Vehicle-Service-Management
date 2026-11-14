package com.motormile.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "vehicles")
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId; // Links vehicle to a specific user
    private String model;
    private String regNo;
    private String fuel;
    private String year;
    private String km;
    private String status;

    protected Vehicle() {}

    public Vehicle(Long userId, String model, String regNo, String fuel, String year, String km, String status) {
        this.userId = userId;
        this.model = model;
        this.regNo = regNo;
        this.fuel = fuel;
        this.year = year;
        this.km = km;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getRegNo() { return regNo; }
    public void setRegNo(String regNo) { this.regNo = regNo; }

    public String getFuel() { return fuel; }
    public void setFuel(String fuel) { this.fuel = fuel; }

    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }

    public String getKm() { return km; }
    public void setKm(String km) { this.km = km; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}