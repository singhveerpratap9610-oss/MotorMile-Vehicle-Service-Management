package com.motormile.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.motormile.model.ServiceBooking;

public interface BookingRepository extends JpaRepository<ServiceBooking, Long> {
    List<ServiceBooking> findByUserId(Long userId);
}