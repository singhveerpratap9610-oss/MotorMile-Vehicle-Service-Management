package com.motormile.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.motormile.model.ServiceBooking;
import com.motormile.model.Vehicle;
import com.motormile.service.MotorMileService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class MotorMileController {

    private final MotorMileService service;

    public MotorMileController(MotorMileService service) {
        this.service = service;
    }

    @GetMapping("/vehicle")
    public Vehicle getVehicleDetails() {
        return service.getVehicleDetails();
    }

    @GetMapping("/services")
    public List<ServiceBooking> getAllServiceBookings() {
        return service.getAllServiceBookings();
    }

    @PostMapping("/services")
    public ServiceBooking bookService(@RequestBody ServiceBooking request) {
        return service.bookService(request);
    }
}