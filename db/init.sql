-- init.sql for MariaDB
CREATE DATABASE IF NOT EXISTS bonus_db;
USE bonus_db;

SET FOREIGN_KEY_CHECKS=0;

-- TRUCK TABLE
CREATE TABLE IF NOT EXISTS trucks (
    truck_id INT AUTO_INCREMENT PRIMARY KEY,
    unit_number VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    status VARCHAR(20) DEFAULT 'available'
) ENGINE=InnoDB;

-- DRIVER-TYPE TABLE
CREATE TABLE IF NOT EXISTS driver_type (
    driver_type_id INT AUTO_INCREMENT PRIMARY KEY,
    driver_type VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- DRIVER TABLE
CREATE TABLE IF NOT EXISTS drivers (
    driver_id INT AUTO_INCREMENT PRIMARY KEY,
    driver_code VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    start_date DATE,
    truck_id INT NULL,
    driver_type_id INT NULL,  
    FOREIGN KEY (truck_id) REFERENCES trucks(truck_id) ON DELETE SET NULL,
    FOREIGN KEY (driver_type_id) REFERENCES driver_types(driver_type_id) ON DELETE RESTRICT
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS=1;

-- DRIVER-TRUCK ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS driver_truck_assignments (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    driver_id INT NOT NULL,
    truck_id INT NOT NULL,
    assignment_date DATE DEFAULT (CURDATE()),
    unassignment_date DATE,
    FOREIGN KEY (driver_id) REFERENCES drivers(driver_id) ON DELETE CASCADE,
    FOREIGN KEY (truck_id) REFERENCES trucks(truck_id) ON DELETE CASCADE
);

-- SAFETY CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS safety_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL,
    scoring_system INT NOT NULL,
    p_i_score INT NOT NULL
);

-- SAFETY EVENTS TABLE
CREATE TABLE IF NOT EXISTS safety_events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    driver_id INT NOT NULL,
    event_date DATE DEFAULT (CURDATE()),
    category_id INT NOT NULL,
    notes VARCHAR(500),
    bonus_score DECIMAL(5,2),
    p_i_score DECIMAL(5,2),
    bonus_period BOOLEAN DEFAULT FALSE,
    short_notes VARCHAR(100) AS (LEFT(notes,100)) STORED,
    FOREIGN KEY (driver_id) REFERENCES drivers(driver_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES safety_categories(category_id) ON DELETE CASCADE
);

-- SAFETY SCORES TABLE
CREATE TABLE IF NOT EXISTS safety_scores (
    score_id INT AUTO_INCREMENT PRIMARY KEY,
    driver_id INT NOT NULL,
    month INT NOT NULL,
    year INT NOT NULL,
    safety_score DECIMAL(5,2),
    maintenance_score DECIMAL(5,2),
    dispatch_score DECIMAL(5,2),
    notes VARCHAR(500),
    short_notes VARCHAR(100) AS (LEFT(notes,100)) STORED,
    FOREIGN KEY (driver_id) REFERENCES drivers(driver_id) ON DELETE CASCADE
);

-- Default safety categories
INSERT INTO safety_categories (code, description, scoring_system, p_i_score) VALUES
('B00001','Minor Preventable Accident (<$5000)',5,5),
('P00001','Major Preventable Accident (>$5000)',10,10),
('B00002','Canada 2-Hour Violation',2,0),
('B00003','Canada 10-Hour Violation',2,0),
('B00004','Canada 13-Hour Violation',5,0),
('B00005','Canada 14-Hour Violation',5,0),
('B00006','Canada 16-Hour Violation',5,0),
('B00007','Canada 70-Hour Violation',2,0),
('B00008','Canada 24-Hour Violation',2,0),
('B00009','US 11-Hour Violation',5,0),
('B00010','US 14-Hour Violation',5,0),
('B00011','US Rest Break Violation',2,0),
('B00012','US 70-Hour Violation',2,0),
('P00002','Abuse of Personal Conveyance',8,8),
('B00013','Speeding 0-10 MPH',3,0),
('B00014','Speeding 11-14 MPH',5,0),
('B00015','Speeding 15+ MPH',10,0),
('P00003','Passed Level 1 Inspection',-5,-5),
('P00004','Passed Level 2 Inspection',-2,-2),
('P00005','Passed Level 3 Inspection',-2,-2),
('P00006','Failed Level 1 Inspection',10,10),
('P00007','Failed Level 2 Inspection',5,5),
('P00008','Failed Level 3 Inspection',5,5),
('P00009','Distracted Driving',10,10),
('P00010','Inattentive Driving',10,10),
('P00011','Photo Radar Ticket',5,5),
('P00012','Ticket(s)',10,10),
('P00013','Failed Spot Check',3,3),
('P00014','Passed Spot Check',-1,-1),
('P00015','Equipment Damage - Minor ($0-$3k)',2,2),
('P00016','Equipment Damage - Major ($3k+)',5,5)
ON DUPLICATE KEY UPDATE code=code;