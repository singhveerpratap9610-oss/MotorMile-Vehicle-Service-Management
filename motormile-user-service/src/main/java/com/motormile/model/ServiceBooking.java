package com.motormile.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "service_bookings")
public class ServiceBooking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId; // Links booking to a specific user
    private String service;
    private String date;
    private String time;
    private double cost;
    private String status;
    
    @Column(length = 1000)
    private String damages;
    
    @Column(length = 1000)
    private String notes;

    protected ServiceBooking() {}

    public ServiceBooking(Long userId, String service, String date, String time, double cost, String status, String damages, String notes) {
        this.userId = userId;
        this.service = service;
        this.date = date;
        this.time = time;
        this.cost = cost;
        this.status = status;
        this.damages = damages;
        this.notes = notes;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getService() { return service; }
    public void setService(String service) { this.service = service; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public double getCost() { return cost; }
    public void setCost(double cost) { this.cost = cost; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDamages() { return damages; }
    public void setDamages(String damages) { this.damages = damages; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}