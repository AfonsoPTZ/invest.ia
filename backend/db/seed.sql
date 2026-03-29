USE `invest_ia`;

-- =========================
-- USER
-- =========================
INSERT INTO users (name, email, cpf, phone, password_hash)
VALUES (
    'Afonso Braga Plentz',
    'afonsobplentz@gmail.com',
    '02153179203',
    '41988309669',
    '$2b$10$tsfgEfURbWXDAu41JupLe8rpHbnJHfDRynRd/gpFd4yo4fQAFyEu'
);

-- =========================
-- FINANCIAL PROFILE
-- =========================
INSERT INTO financial_profiles (
    user_id,
    monthly_income,
    initial_balance,
    has_investments,
    has_assets,
    financial_goal,
    behavior_profile
) VALUES (
    1,
    1800.00,
    150.00,
    FALSE,
    FALSE,
    'I want to learn how to save and invest.',
    'moderate'
);

-- =========================
-- EARNINGS
-- =========================
INSERT INTO earnings (user_id, description, amount, earned_date, is_fixed)
VALUES
(1, 'Monthly salary', 1800.00, '2026-03-05', TRUE),
(1, 'Freelance web development', 400.00, '2026-03-12', FALSE),
(1, 'Lottery winnings', 20.00, '2026-03-14', FALSE);

-- =========================
-- EXPENSES
-- =========================
INSERT INTO expenses (user_id, description, amount, expense_date, is_fixed)
VALUES
(1, 'Rent', 800.00, '2026-03-01', TRUE),
(1, 'Internet', 99.90, '2026-03-03', TRUE),
(1, 'Snack', 5.00, '2026-03-06', FALSE),
(1, 'Pizza delivery', 49.90, '2026-03-08', FALSE),
(1, 'Uber to college', 18.00, '2026-03-09', FALSE),
(1, 'Grocery shopping', 210.75, '2026-03-10', FALSE);

-- =========================
-- INVESTMENTS
-- =========================
INSERT INTO investments (
    user_id,
    investment_type,
    asset_name,
    invested_amount,
    current_amount,
    risk_level,
    investment_date,
    notes
) VALUES (
    1,
    'Cryptocurrency',
    'Bitcoin',
    300.00,
    328.50,
    'high',
    '2026-03-15',
    'First small investment in crypto'
);

-- =========================
-- ASSETS
-- =========================
INSERT INTO assets (
    user_id,
    asset_type,
    description,
    estimated_value,
    acquisition_date
) VALUES (
    1,
    'Equipment',
    'Lenovo IdeaPad Notebook',
    3200.00,
    '2025-07-20'
);

-- =========================
-- FINANCIAL GOALS
-- =========================
INSERT INTO financial_goals (
    user_id,
    title,
    description,
    target_amount,
    current_amount,
    target_date,
    status
) VALUES (
    1,
    'Emergency fund',
    'Save money for financial security',
    6000.00,
    1200.00,
    '2026-12-31',
    'in_progress'
);

-- =========================
-- MONTHLY SUMMARY
-- =========================
INSERT INTO monthly_summaries (
    user_id,
    year,
    month,
    total_earnings,
    total_expenses,
    beginning_balance,
    ending_balance,
    savings_amount
) VALUES (
    1,
    2026,
    3,
    4920.00,
    1583.55,
    1200.00,
    4536.45,
    3336.45
);

-- =========================
-- FINANCIAL NEWS
-- =========================
INSERT INTO financial_news (
    title,
    source,
    url,
    summary,
    category,
    published_at
) VALUES (
    'Bitcoin rises again with improvement in global market',
    'Portal Finance News',
    'https://portalfinance-news.com/bitcoin-rises-global-market',
    'The asset appreciated after improvements in international market sentiment.',
    'Cryptocurrency',
    '2026-03-18 10:30:00'
);

-- =========================
-- SAVINGS SUGGESTION
-- =========================
INSERT INTO savings_suggestions (
    user_id,
    title,
    description,
    source,
    priority,
    status
) VALUES (
    1,
    'Reduce variable spending on delivery',
    'You could reduce app-based food orders this week to save more.',
    'Variable expenses were detected with snacks and delivery in recent days.',
    'high',
    'pending'
);

-- =========================
-- INVESTMENT SUGGESTION
-- =========================
INSERT INTO investment_suggestions (
    user_id,
    news_id,
    title,
    description,
    source,
    risk_level,
    status
) VALUES (
    1,
    1,
    'Consider small Bitcoin investment',
    'Based on recent market conditions, it may be worth considering a small and controlled investment.',
    'Suggestion based on registered news and user interest in investments.',
    'high',
    'pending'
);