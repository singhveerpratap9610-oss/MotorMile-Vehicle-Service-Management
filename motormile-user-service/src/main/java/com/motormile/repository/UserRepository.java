package com.motormile.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.motormile.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}