/*
  # Add Profiles Automation Table

  1. New Tables
    - `profiles_automation`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `platform` (text, check constraint for valid platforms)
      - `name` (text)
      - `cookie` (text)
      - `proxy` (text, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `profiles_automation` table
    - Add policies for authenticated users to manage their own profiles
*/

-- Create profiles_automation table
CREATE TABLE IF NOT EXISTS profiles_automation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  platform text NOT NULL CHECK (platform IN ('instagram', 'facebook', 'tiktok')),
  name text NOT NULL,
  cookie text NOT NULL,
  proxy text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles_automation ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profiles"
  ON profiles_automation
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own profiles"
  ON profiles_automation
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profiles"
  ON profiles_automation
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own profiles"
  ON profiles_automation
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_automation_user_id ON profiles_automation(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_automation_platform ON profiles_automation(platform);

-- Create trigger for updated_at
CREATE TRIGGER update_profiles_automation_updated_at
  BEFORE UPDATE ON profiles_automation
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();