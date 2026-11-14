package com.motormile;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.motormile.model.ServiceBooking;
import com.motormile.model.Vehicle;
import com.motormile.repository.ServiceBookingRepository;
import com.motormile.repository.VehicleRepository;

@SpringBootApplication
public class MotorMileApplication {

    public static void main(String[] args) {
        SpringApplication.run(MotorMileApplication.class, args);
    }

    @Bean
    public CommandLineRunner loadData(VehicleRepository vehicleRepo, ServiceBookingRepository bookingRepo) {
        return args -> {
            if (vehicleRepo.count() == 0) {
                vehicleRepo.save(new Vehicle("Honda City", "MP 19 CA 9610", "Petrol", 2022, 24500, "Healthy"));
            }
            if (bookingRepo.count() == 0) {
                bookingRepo.save(new ServiceBooking("Oil Change", "10 Jun 2026", "10:00", "Regular oil change", 2500.0, "Completed"));
                bookingRepo.save(new ServiceBooking("General Service", "12 Mar 2026", "11:30", "Full inspection", 4200.0, "Completed"));
                bookingRepo.save(new ServiceBooking("Brake Inspection", "20 Dec 2025", "14:00", "Front brake pads checked", 1500.0, "Completed"));
            }
        };
    }
}