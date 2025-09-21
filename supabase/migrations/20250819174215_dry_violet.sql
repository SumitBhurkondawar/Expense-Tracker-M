/*
  # Financial Management App Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `avatar` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `accounts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `name` (text)
      - `type` (text)
      - `balance` (decimal)
      - `color` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `account_id` (uuid, foreign key)
      - `title` (text)
      - `amount` (decimal)
      - `category` (text)
      - `type` (text)
      - `description` (text)
      - `date` (timestamp)
      - `created_at` (timestamp)
    
    - `goals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `title` (text)
      - `target_amount` (decimal)
      - `current_amount` (decimal)
      - `deadline` (date)
      - `description` (text)
      - `progress` (decimal)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  avatar text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create accounts table
CREATE TABLE IF NOT EXISTS accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  type text NOT NULL DEFAULT 'checking',
  balance decimal(15,2) DEFAULT 0,
  color text DEFAULT '#3b82f6',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  account_id uuid REFERENCES accounts(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  amount decimal(15,2) NOT NULL,
  category text NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  description text,
  date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  target_amount decimal(15,2) NOT NULL,
  current_amount decimal(15,2) DEFAULT 0,
  deadline date,
  description text,
  progress decimal(5,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create policies for accounts table
CREATE POLICY "Users can read own accounts"
  ON accounts
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own accounts"
  ON accounts
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own accounts"
  ON accounts
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own accounts"
  ON accounts
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create policies for transactions table
CREATE POLICY "Users can read own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own transactions"
  ON transactions
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create policies for goals table
CREATE POLICY "Users can read own goals"
  ON goals
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own goals"
  ON goals
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own goals"
  ON goals
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own goals"
  ON goals
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();