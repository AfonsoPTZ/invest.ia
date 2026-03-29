CREATE DATABASE `invest_ia`;
USE `invest_ia`;

-- =========================
-- 1. USERS
-- =========================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    cpf CHAR(11) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    otp_code_hash VARCHAR(255) NULL,
    otp_expires_at DATETIME NULL,
    otp_attempts INT NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================
-- 2. FINANCIAL PROFILES
-- =========================
CREATE TABLE financial_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    monthly_income DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    initial_balance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    has_investments BOOLEAN NOT NULL DEFAULT FALSE,
    has_assets BOOLEAN NOT NULL DEFAULT FALSE,
    financial_goal VARCHAR(255) NOT NULL,
    behavior_profile ENUM('conservative', 'moderate', 'aggressive') NOT NULL DEFAULT 'moderate',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_financial_profile_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

-- =========================
-- 3. EARNINGS
-- =========================
CREATE TABLE earnings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    earned_date DATE NOT NULL,
    is_fixed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_earning_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

-- =========================
-- 4. EXPENSES
-- =========================
CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    expense_date DATE NOT NULL,
    is_fixed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_expense_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

-- =========================
-- 5. INVESTMENTS
-- =========================
CREATE TABLE investments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    investment_type VARCHAR(100) NOT NULL,
    asset_name VARCHAR(150) NOT NULL,
    invested_amount DECIMAL(12,2) NOT NULL,
    current_amount DECIMAL(12,2),
    risk_level ENUM('low', 'medium', 'high') DEFAULT 'medium',
    investment_date DATE,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_investment_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

-- =========================
-- 6. ASSETS
-- =========================
CREATE TABLE assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    asset_type VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    estimated_value DECIMAL(12,2) NOT NULL,
    acquisition_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_asset_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

-- =========================
-- 7. FINANCIAL GOALS
-- =========================
CREATE TABLE financial_goals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    target_amount DECIMAL(12,2) NOT NULL,
    target_date DATE,
    current_amount DECIMAL(12,2) DEFAULT 0.00,
    status ENUM('not_started', 'in_progress', 'completed') DEFAULT 'not_started',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_goal_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

-- =========================
-- 8. MONTHLY SUMMARIES
-- =========================
CREATE TABLE monthly_summaries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    year YEAR NOT NULL,
    month TINYINT NOT NULL,
    total_earnings DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    total_expenses DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    beginning_balance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    ending_balance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    savings_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_summary_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT uq_summary_user_month UNIQUE (user_id, year, month),
    CONSTRAINT ck_month_valid CHECK (month BETWEEN 1 AND 12)
);

-- =========================
-- 9. FINANCIAL NEWS
-- =========================
CREATE TABLE financial_news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    source VARCHAR(150) NOT NULL,
    url VARCHAR(500) NOT NULL UNIQUE,
    summary TEXT,
    category VARCHAR(100),
    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 10. SAVINGS SUGGESTIONS
-- =========================
CREATE TABLE savings_suggestions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    source TEXT NOT NULL,
    priority ENUM('low', 'medium', 'high') NOT NULL,
    status ENUM('pending', 'accepted', 'declined') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    responded_at DATETIME NULL,
    CONSTRAINT fk_savings_suggestion_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

-- =========================
-- 11. INVESTMENT SUGGESTIONS
-- =========================
CREATE TABLE investment_suggestions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    news_id INT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    source TEXT NOT NULL,
    risk_level ENUM('low', 'medium', 'high') NOT NULL,
    status ENUM('pending', 'accepted', 'declined') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    responded_at DATETIME NULL,
    CONSTRAINT fk_investment_suggestion_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_investment_suggestion_news
        FOREIGN KEY (news_id) REFERENCES financial_news(id)
        ON DELETE SET NULL
);