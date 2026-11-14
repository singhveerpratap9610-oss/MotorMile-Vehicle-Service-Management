package com.motormile.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.motormile.model.ServiceBooking;

public interface ServiceBookingRepository extends JpaRepository<ServiceBooking, Long> {}