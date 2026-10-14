package com.motormile.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Repository;

import com.motormile.model.ServiceBooking;
import com.motormile.model.Vehicle;

@Repository
public class MotorMileRepository {

    private final Vehicle vehicle;
    private final List<ServiceBooking> bookings = new ArrayList<>();
    private final AtomicLong idCounter = new AtomicLong(4);

    public MotorMileRepository() {
        this.vehicle = new Vehicle(
                1L,
                "Honda City",
                "MP 19 CA 9610",
                "Petrol",
                2022,
                24500,
                "Healthy"
        );

        bookings.add(new ServiceBooking(1L, "Oil Change", "10 Jun 2026", "10:00", "Regular oil change", 2500.0, "Completed"));
        bookings.add(new ServiceBooking(2L, "General Service", "12 Mar 2026", "11:30", "Full inspection", 4200.0, "Completed"));
        bookings.add(new ServiceBooking(3L, "Brake Inspection", "20 Dec 2025", "14:00", "Front brake pads checked", 1500.0, "Completed"));
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public List<ServiceBooking> findAllBookings() {
        return new ArrayList<>(bookings);
    }

    public ServiceBooking saveBooking(ServiceBooking booking) {
        booking.setId(idCounter.getAndIncrement());
        bookings.add(booking);
        return booking;
    }
}