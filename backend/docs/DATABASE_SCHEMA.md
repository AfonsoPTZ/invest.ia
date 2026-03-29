# Database Schema

## Overview

**Database:** MySQL  
**Driver:** mysql2/promise  
**Pool:** Connection pooling with max 10 connections  
**Location:** `backend/db/schema.sql`

---

## Tables

### 1. `users` Table

Stores user account information.

```sql
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
```

**Columns:**

| Column | Type | Purpose |
|--------|------|---------|
| `id` | INT | Primary key, auto-increment |
| `name` | VARCHAR(150) | User full name |
| `email` | VARCHAR(150) | Email address, unique constraint |
| `cpf` | CHAR(11) | Brazilian CPF (11 digits), unique |
| `phone` | VARCHAR(20) | Phone number, unique |
| `password_hash` | VARCHAR(255) | Bcrypt hashed password (never plaintext) |
| `email_verified` | BOOLEAN | False until user verifies with OTP |
| `otp_code_hash` | VARCHAR(255) | Bcrypt hashed OTP (null if verified) |
| `otp_expires_at` | DATETIME | OTP expiration time (5 min window) |
| `otp_attempts` | INT | Failed OTP attempts counter |
| `created_at` | DATETIME | User creation timestamp |
| `updated_at` | DATETIME | Last modification timestamp |

**Constraints:**
- `UNIQUE(email)` - No duplicate emails
- `UNIQUE(cpf)` - No duplicate CPFs
- `UNIQUE(phone)` - No duplicate phone numbers

**Indices:**
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_cpf ON users(cpf);
```

---

### 2. `financial_profiles` Table

Stores financial information per user (1:1 relationship with users).

```sql
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
```

**Columns:**

| Column | Type | Purpose |
|--------|------|---------|
| `id` | INT | Primary key |
| `user_id` | INT | Foreign key to users table (unique = 1:1) |
| `monthly_income` | DECIMAL(12,2) | Monthly earned amount |
| `initial_balance` | DECIMAL(12,2) | Starting balance amount |
| `has_investments` | BOOLEAN | Flag for investment status |
| `has_assets` | BOOLEAN | Flag for asset ownership |
| `financial_goal` | VARCHAR(255) | User's financial goal description |
| `behavior_profile` | ENUM | Risk tolerance: conservative/moderate/aggressive |
| `created_at` | DATETIME | Creation time |
| `updated_at` | DATETIME | Last update time |

**Constraints:**
- `UNIQUE(user_id)` - One profile per user
- `FOREIGN KEY` - Cascade delete if user deleted
- `DEFAULT 'moderate'` - Default risk level

**Indices:**
```sql
CREATE INDEX idx_financial_profiles_user_id ON financial_profiles(user_id);
```

---

### 3. `earnings` Table

Stores income records per user.

```sql
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
```

**Purpose:** Track all income sources (salary, freelance, bonuses, etc.)

**Columns:**

| Column | Type | Purpose |
|--------|------|---------|
| `user_id` | INT | Foreign key to users |
| `description` | VARCHAR(255) | Income source (e.g., "Monthly salary") |
| `amount` | DECIMAL(12,2) | Income amount |
| `earned_date` | DATE | Date of earning |
| `is_fixed` | BOOLEAN | True if recurring monthly |

---

### 4. `expenses` Table

Stores expense records per user.

```sql
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
```

**Purpose:** Track all expenses (rent, food, utilities, etc.)

**Similar structure to earnings**

---

### 5. `investments` Table

Stores investment records.

```sql
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
```

**Purpose:** Track investments (stocks, crypto, bonds, etc.)

**Columns:**

| Column | Type | Purpose |
|--------|------|---------|
| `investment_type` | VARCHAR(100) | Type (stock, crypto, bond, etc.) |
| `asset_name` | VARCHAR(150) | Specific asset name |
| `invested_amount` | DECIMAL(12,2) | Initial investment |
| `current_amount` | DECIMAL(12,2) | Current value |
| `risk_level` | ENUM | low/medium/high |
| `investment_date` | DATE | When invested |
| `notes` | TEXT | Additional info |

---

### 6. `assets` Table

Stores physical/valuable assets.

```sql
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
```

**Purpose:** Track valuable assets (real estate, vehicles, jewelry, etc.)

---

### 7. `financial_goals` Table

Stores user financial goals.

```sql
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
```

**Purpose:** Track financial goals (emergency fund, vacation, car, etc.)

**Status enum:**
- `not_started` - Goal created but no progress
- `in_progress` - Active progress toward goal
- `completed` - Goal achieved

---

### 8. `monthly_summaries` Table

Stores monthly financial summaries (for reporting).

```sql
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
```

**Purpose:** Precomputed monthly summaries for fast reporting

---

### 9. `financial_news` Table

Stores financial market news.

```sql
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
```

**Purpose:** Store market news for suggestions/recommendations

---

### 10. `savings_suggestions` Table

Stores app-generated savings suggestions.

```sql
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
```

**Purpose:** Track AI/algorithmic savings recommendations

---

### 11. `investment_suggestions` Table

Stores app-generated investment suggestions.

```sql
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
```

**Purpose:** Track investment recommendations (can link to news articles)

---

## Relationships

```
users (1) ─── (1) financial_profiles
users (1) ─── (n) earnings
users (1) ─── (n) expenses
users (1) ─── (n) investments
users (1) ─── (n) assets
users (1) ─── (n) financial_goals
users (1) ─── (n) monthly_summaries
users (1) ─── (n) savings_suggestions
users (1) ─── (n) investment_suggestions

investment_suggestions (n) ─── (1) financial_news
```

---

## Data Types

| Type | Use Case | Example |
|------|----------|---------|
| `INT` | IDs, counters | user_id, otp_attempts |
| `CHAR(11)` | Fixed-length (CPF) | CPF: 12345678901 |
| `VARCHAR(n)` | Variable text | name, email, description |
| `TEXT` | Long text | notes, description |
| `BOOLEAN` | True/false | email_verified, is_fixed |
| `ENUM` | Limited choices | behavior_profile, status |
| `DECIMAL(12,2)` | Money (2 decimals) | 1000.50 |
| `DATE` | Date only | 2026-03-29 |
| `DATETIME` | Date + time | 2026-03-29 10:30:45 |
| `YEAR` | Year only | 2026 |
| `TINYINT` | Small integers | months 1-12 |

---

## Constraints

| Constraint | Purpose |
|-----------|---------|
| `PRIMARY KEY` | Unique identifier per row |
| `UNIQUE` | No duplicate values in column |
| `FOREIGN KEY` | Reference another table (referential integrity) |
| `NOT NULL` | Column required (can't be empty) |
| `DEFAULT` | Default value if not provided |
| `AUTO_INCREMENT` | Auto-generate sequential ID |
| `CHECK` | Validate data (e.g., month between 1-12) |
| `ON DELETE CASCADE` | Delete child rows if parent deleted |
| `ON DELETE SET NULL` | Set to NULL if parent deleted |

---

## Indexing Strategy

Performance indices on frequent query columns:

```sql
-- Authentication
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_cpf ON users(cpf);

-- Foreign keys
CREATE INDEX idx_financial_profiles_user_id ON financial_profiles(user_id);
CREATE INDEX idx_earnings_user_id ON earnings(user_id);
CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_investments_user_id ON investments(user_id);
CREATE INDEX idx_assets_user_id ON assets(user_id);
CREATE INDEX idx_financial_goals_user_id ON financial_goals(user_id);

-- Date ranges
CREATE INDEX idx_earnings_date ON earnings(earned_date);
CREATE INDEX idx_expenses_date ON expenses(expense_date);
```

These indices speed up:
- User lookup by email (login)
- Query all earnings/expenses for a user
- Date range queries (monthly reports)

---

## How Data Flows

1. **User Registration**
   - New row in `users` table
   - Later: New row in `financial_profiles` table

2. **Tracking Spending**
   - New row in `earnings` table (income)
   - New row in `expenses` table (spending)

3. **Making Investments**
   - New row in `investments` table

4. **Monthly Reports**
   - Pre-computed row in `monthly_summaries` table
   - Aggregates earnings, expenses, balances

5. **Suggestions**
   - New rows in `savings_suggestions` or `investment_suggestions`
   - User can accept/decline (status changes)

---

## Seeding Data

**File:** `backend/db/seed.sql`

Initial test data for development:
- 1 test user (Afonso Braga Plentz)
- 1 financial profile
- Sample earnings, expenses, investments
- Sample goals and suggestions

Run after schema creation:
```bash
mysql -u root -p invest_ia < backend/db/schema.sql
mysql -u root -p invest_ia < backend/db/seed.sql
```
