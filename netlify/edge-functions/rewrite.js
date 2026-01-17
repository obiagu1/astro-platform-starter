#!/bin/bash

# Define project name
PROJECT_NAME="COINBEST"
BUILD_DIR="./$PROJECT_NAME"

echo "[*] Preparing project structure..."
mkdir -p $BUILD_DIR

# 1. Create the Database Schema file
cat <<EOF > $BUILD_DIR/database_schema.sql
-- Run this in your MySQL console
CREATE DATABASE IF NOT EXISTS investpro;
USE investpro;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    balance DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE investments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    plan_name VARCHAR(50),
    amount DECIMAL(15,2),
    daily_rate DECIMAL(5,2),
    status ENUM('active', 'completed', 'paused') DEFAULT 'active',
    last_payout TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    amount DECIMAL(15,2),
    type ENUM('deposit', 'withdrawal', 'roi', 'referral'),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE withdrawals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    amount DECIMAL(15,2),
    wallet VARCHAR(255),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
EOF

# 2. Moving existing files (assuming they are in current dir)
# If you haven't saved them yet, this script assumes the names we used:
# config.php, roi_engine.php, dashboard.php, request_withdrawal.php, etc.

cp config.php roi_engine.php dashboard.php request_withdrawal.php register.php admin_approve.php $BUILD_DIR/ 2>/dev/null || echo "[!] Some PHP files were missing and not copied."

# 3. Zip the project
echo "[*] Zipping project..."
zip -r "${PROJECT_NAME}.zip" $BUILD_DIR

echo "[*] DONE! Your project is ready in: ${PROJECT_NAME}.zip"