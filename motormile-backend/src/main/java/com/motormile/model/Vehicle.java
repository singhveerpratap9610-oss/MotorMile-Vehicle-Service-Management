package com.motormile.model;

public class Vehicle {
    private Long id;
    private String model;
    private String registrationNumber;
    private String fuelType;
    private int manufacturingYear;
    private int currentKm;
    private String status;

    public Vehicle() {}

    public Vehicle(Long id, String model, String registrationNumber, String fuelType, int manufacturingYear, int currentKm, String status) {
        this.id = id;
        this.model = model;
        this.registrationNumber = registrationNumber;
        this.fuelType = fuelType;
        this.manufacturingYear = manufacturingYear;
        this.currentKm = currentKm;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }

    public String getFuelType() { return fuelType; }
    public void setFuelType(String fuelType) { this.fuelType = fuelType; }

    public int getManufacturingYear() { return manufacturingYear; }
    public void setManufacturingYear(int manufacturingYear) { this.manufacturingYear = manufacturingYear; }

    public int getCurrentKm() { return currentKm; }
    public void setCurrentKm(int currentKm) { this.currentKm = currentKm; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}