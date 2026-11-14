package com.motormile.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.motormile.model.ServiceBooking;
import com.motormile.repository.BookingRepository;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    // Get all bookings (global fallback)
    @GetMapping
    public List<ServiceBooking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // Get bookings belonging only to a specific logged-in user
    @GetMapping("/user/{userId}")
    public List<ServiceBooking> getBookingsByUser(@PathVariable Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    // Create a new service booking for a user
    @PostMapping
    public ServiceBooking createBooking(@RequestBody ServiceBooking booking) {
        return bookingRepository.save(booking);
    }

    // Update booking status from "Booked" to "Completed"
    @PutMapping("/{id}/complete")
    public ServiceBooking markComplete(@PathVariable Long id) {
        ServiceBooking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        booking.setStatus("Completed");
        return bookingRepository.save(booking);
    }
}