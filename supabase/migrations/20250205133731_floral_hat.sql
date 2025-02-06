/*
  # Create Admin User and Subscription

  1. Changes
    - Creates an admin user with email admin@commentify.com
    - Sets up admin profile
    - Adds admin subscription with pro plan
    - Adds proper constraints and error handling
*/

-- Create admin user if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@commentify.com'
  ) THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      'ad0f7c6e-1a2b-3c4d-5e6f-7a8b9c0d1e2f',
      'authenticated',
      'authenticated',
      'admin@commentify.com',
      crypt('Admin@123', gen_salt('bf')), -- Password: Admin@123
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"Admin"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    );
  END IF;
END $$;

-- Create admin profile if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = 'ad0f7c6e-1a2b-3c4d-5e6f-7a8b9c0d1e2f'
  ) THEN
    INSERT INTO public.profiles (
      user_id,
      name,
      created_at,
      updated_at
    ) VALUES (
      'ad0f7c6e-1a2b-3c4d-5e6f-7a8b9c0d1e2f',
      'Admin',
      now(),
      now()
    );
  END IF;
END $$;

-- Add admin subscription if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.subscriptions 
    WHERE user_id = 'ad0f7c6e-1a2b-3c4d-5e6f-7a8b9c0d1e2f'
  ) THEN
    INSERT INTO public.subscriptions (
      user_id,
      plan_type,
      status,
      trial_used,
      starts_at,
      expires_at,
      created_at,
      updated_at
    ) VALUES (
      'ad0f7c6e-1a2b-3c4d-5e6f-7a8b9c0d1e2f',
      'pro',
      'active',
      false,
      now(),
      now() + interval '1 year',
      now(),
      now()
    );
  END IF;
END $$;