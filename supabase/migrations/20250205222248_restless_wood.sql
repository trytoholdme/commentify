/*
  # Enable pgcrypto Extension
  
  1. Changes
    - Enable pgcrypto extension for password hashing functions
*/

-- Enable the pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;