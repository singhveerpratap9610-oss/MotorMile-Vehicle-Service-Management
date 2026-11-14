-- MotorMile Database Schema
CREATE DATABASE IF NOT EXISTS motormile_users;
USE motormile_users;

-- Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Vehicles Table (Virtual Garage)
CREATE TABLE vehicles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    model VARCHAR(255),
    reg_no VARCHAR(255) UNIQUE,
    fuel_type VARCHAR(50),
    model_year INT,
    current_km INT,
    status VARCHAR(50) DEFAULT 'Healthy',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Service Bookings Table
CREATE TABLE service_bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    service VARCHAR(255),
    damages VARCHAR(255),
    cost DOUBLE,
    date VARCHAR(255),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'Booked',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);