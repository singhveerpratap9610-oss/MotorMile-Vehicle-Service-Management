package com.motormile.model;

public class ServiceBooking {
    private Long id;
    private String service;
    private String date;
    private String time;
    private String notes;
    private double cost;
    private String status;

    public ServiceBooking() {}

    public ServiceBooking(Long id, String service, String date, String time, String notes, double cost, String status) {
        this.id = id;
        this.service = service;
        this.date = date;
        this.time = time;
        this.notes = notes;
        this.cost = cost;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getService() { return service; }
    public void setService(String service) { this.service = service; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public double getCost() { return cost; }
    public void setCost(double cost) { this.cost = cost; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}