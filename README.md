# MotorMile: Intelligent Full-Stack Vehicle Service & Maintenance Management System

An enterprise-grade, full-stack vehicle maintenance tracker built with a decoupled microservices architecture.

## Tech Stack
* **Frontend:** React.js (Vite)
* **Backend:** Java Spring Boot
* **Database:** MySQL 8.0 (Hibernate ORM)

## Core Features
* **Automated Telemetry Parsing:** RegEx evaluates odometer readings to flag damaged vehicles (>80,000 KM threshold).
* **Closed-Loop Healing Lifecycle:** Automatically mutates vehicle status back to "Healthy" in the database upon service completion.
* **Client-Side Blob Invoicing:** Instant, zero-latency `.txt` invoice downloads.

## How to Run
1. Run the `database-schema.sql` script in MySQL to create the tables.
2. Navigate to the `motormile-backend` folder and run `mvn spring-boot:run`.
3. Navigate to the `motormile-react` folder, run `npm install`, then `npm run dev`.