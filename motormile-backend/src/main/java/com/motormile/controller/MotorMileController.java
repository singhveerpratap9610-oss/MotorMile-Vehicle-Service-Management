package com.motormile.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.motormile.model.ServiceBooking;
import com.motormile.model.Vehicle;
import com.motormile.service.MotorMileService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class MotorMileController {

    private final MotorMileService service;

    public MotorMileController(MotorMileService service) {
        this.service = service;
    }

    @GetMapping("/vehicle")
    public ResponseEntity<Vehicle> getVehicle() {
        return ResponseEntity.ok(service.getVehicleDetails());
    }

    @GetMapping("/services")
    public ResponseEntity<List<ServiceBooking>> getAllServices() {
        return ResponseEntity.ok(service.getAllServiceBookings());
    }

    @PostMapping("/services")
    public ResponseEntity<?> bookNewService(@RequestBody ServiceBooking bookingRequest) {
        try {
            ServiceBooking saved = service.bookService(bookingRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}