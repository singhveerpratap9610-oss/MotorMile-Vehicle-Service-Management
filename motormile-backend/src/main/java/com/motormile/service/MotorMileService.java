package com.motormile.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.motormile.model.ServiceBooking;
import com.motormile.model.Vehicle;
import com.motormile.repository.MotorMileRepository;

@Service
public class MotorMileService {

    private final MotorMileRepository repository;

    private static final Map<String, Double> SERVICE_PRICES = Map.of(
            "General Service", 4200.0,
            "Oil Change", 2500.0,
            "Brake Inspection", 1500.0,
            "Engine Check", 3000.0,
            "Tyre Replacement", 6000.0
    );

    public MotorMileService(MotorMileRepository repository) {
        this.repository = repository;
    }

    public Vehicle getVehicleDetails() {
        return repository.getVehicle();
    }

    public List<ServiceBooking> getAllServiceBookings() {
        return repository.findAllBookings();
    }

    // Business Rule 1: Dynamic Service Pricing Calculation
    public double calculateServiceCost(String serviceType) {
        if (serviceType == null || !SERVICE_PRICES.containsKey(serviceType)) {
            throw new IllegalArgumentException("Invalid service type: " + serviceType);
        }
        return SERVICE_PRICES.get(serviceType);
    }

    // Business Rule 2: Booking Validation & Duplicate Prevention
    public ServiceBooking bookService(ServiceBooking request) {
        if (request.getDate() == null || request.getDate().isBlank() ||
            request.getTime() == null || request.getTime().isBlank()) {
            throw new IllegalArgumentException("Preferred date and time are required.");
        }

        boolean duplicateExists = repository.findAllBookings().stream()
                .anyMatch(existing ->
                        existing.getDate().equalsIgnoreCase(request.getDate()) &&
                        existing.getService().equalsIgnoreCase(request.getService()));

        if (duplicateExists) {
            throw new IllegalStateException("This service is already booked for the selected date.");
        }

        double cost = calculateServiceCost(request.getService());
        request.setCost(cost);
        request.setStatus("Booked");

        return repository.saveBooking(request);
    }
}