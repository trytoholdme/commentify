/*
  # Adicionar tabela de histórico de pagamentos

  1. Nova Tabela
    - `payment_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `order_id` (integer)
      - `order_hash` (text)
      - `transaction_hash` (text)
      - `amount` (integer)
      - `status` (text)
      - `payment_method` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create payment_history table
CREATE TABLE IF NOT EXISTS payment_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  order_id integer NOT NULL,
  order_hash text NOT NULL,
  transaction_hash text NOT NULL,
  amount integer NOT NULL,
  status text NOT NULL,
  payment_method text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own payment history"
  ON payment_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert payment history"
  ON payment_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_order_hash ON payment_history(order_hash);
CREATE INDEX IF NOT EXISTS idx_payment_history_transaction_hash ON payment_history(transaction_hash);

-- Create trigger for updated_at
CREATE TRIGGER update_payment_history_updated_at
  BEFORE UPDATE ON payment_history
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();