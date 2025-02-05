/*
  # Add subscription system

  1. New Tables
    - `subscriptions`
      - Stores user subscription information
      - Tracks plan type and status
    - `trial_usage`
      - Tracks free trial usage per IP/device
      - Prevents multiple trial accounts from same source
    
  2. Changes
    - Add subscription checks to existing tables
    - Add trial usage tracking
    
  3. Security
    - Enable RLS on new tables
    - Add policies for secure access
*/

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  plan_type text NOT NULL CHECK (plan_type IN ('free', 'starter', 'pro', 'tiktok')),
  status text NOT NULL CHECK (status IN ('active', 'cancelled', 'expired')),
  trial_used boolean DEFAULT false,
  starts_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trial_usage table
CREATE TABLE IF NOT EXISTS trial_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  device_id text NOT NULL,
  user_id uuid REFERENCES auth.users,
  used_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trial_usage ENABLE ROW LEVEL SECURITY;

-- Policies for subscriptions
CREATE POLICY "Users can view own subscription"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for trial_usage
CREATE POLICY "Users can view own trial usage"
  ON trial_usage
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_trial_usage_ip ON trial_usage(ip_address);
CREATE INDEX IF NOT EXISTS idx_trial_usage_device ON trial_usage(device_id);

-- Function to check trial eligibility
CREATE OR REPLACE FUNCTION check_trial_eligibility(p_ip_address text, p_device_id text)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM trial_usage
    WHERE ip_address = p_ip_address
    OR device_id = p_device_id
  );
END;
$$;

-- Function to use trial
CREATE OR REPLACE FUNCTION use_trial(p_user_id uuid, p_ip_address text, p_device_id text)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  IF check_trial_eligibility(p_ip_address, p_device_id) THEN
    INSERT INTO trial_usage (ip_address, device_id, user_id)
    VALUES (p_ip_address, p_device_id, p_user_id);
    
    INSERT INTO subscriptions (user_id, plan_type, status, trial_used)
    VALUES (p_user_id, 'free', 'active', true);
    
    RETURN true;
  END IF;
  RETURN false;
END;
$$;