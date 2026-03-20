-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('trader', 'manager')),
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Divisions table
CREATE TABLE IF NOT EXISTS divisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(20) UNIQUE NOT NULL,
    identifier INTEGER UNIQUE NOT NULL CHECK (identifier IN (1, 2, 3)),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert division data
INSERT INTO divisions (name, identifier) 
VALUES 
    ('Wind', 1),
    ('Solar', 2),
    ('Hydro', 3)
ON CONFLICT (name) DO NOTHING;

-- Trades table
CREATE TABLE IF NOT EXISTS trades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trade_id VARCHAR(50) UNIQUE NOT NULL,
    deal_date DATE NOT NULL DEFAULT CURRENT_DATE,
    seller VARCHAR(255) NOT NULL,
    buyer VARCHAR(255) NOT NULL,
    product VARCHAR(255) NOT NULL,
    division_id UUID NOT NULL REFERENCES divisions(id),
    quantity DECIMAL(10,2) NOT NULL CHECK (quantity > 0),
    delivery_date DATE NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    total_price DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved')),
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trade approvals table
CREATE TABLE IF NOT EXISTS trade_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trade_id UUID UNIQUE NOT NULL REFERENCES trades(id),
    approved_by UUID NOT NULL REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_trades_trade_id ON trades(trade_id);
CREATE INDEX IF NOT EXISTS idx_trades_status ON trades(status);
CREATE INDEX IF NOT EXISTS idx_trades_division ON trades(division_id);
CREATE INDEX IF NOT EXISTS idx_trades_created_by ON trades(created_by);
CREATE INDEX IF NOT EXISTS idx_trades_deal_date ON trades(deal_date);
CREATE INDEX IF NOT EXISTS idx_trade_approvals_trade_id ON trade_approvals(trade_id);

-- Table to track daily sequences safely
CREATE TABLE IF NOT EXISTS daily_trade_sequences (
    deal_date DATE PRIMARY KEY,
    last_sequence INTEGER NOT NULL DEFAULT 0
);

-- Function to generate next trade ID
CREATE OR REPLACE FUNCTION generate_trade_id(div_id UUID)
RETURNS TEXT AS $$
DECLARE
    current_date_str TEXT;
    div_identifier INTEGER;
    next_seq INTEGER;
    new_trade_id TEXT;
BEGIN
    current_date_str := TO_CHAR(CURRENT_DATE, 'DD.MM.YYYY');
    
    -- Get division identifier
    SELECT identifier INTO STRICT div_identifier FROM divisions WHERE id = div_id;
    
    -- Thread-safe sequence generation
    INSERT INTO daily_trade_sequences (deal_date, last_sequence)
    VALUES (CURRENT_DATE, 1)
    ON CONFLICT (deal_date) DO UPDATE 
    SET last_sequence = daily_trade_sequences.last_sequence + 1
    RETURNING last_sequence INTO next_seq;
    
    -- Format sequence with leading zeros (6 digits as per example 000001)
    new_trade_id := current_date_str || '-' || LPAD(next_seq::TEXT, 6, '0') || '.' || div_identifier;
    
    RETURN new_trade_id;
END;
$$ LANGUAGE plpgsql;
