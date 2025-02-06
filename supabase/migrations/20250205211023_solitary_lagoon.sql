-- Drop existing functions first
DROP FUNCTION IF EXISTS admin_update_user(uuid,text,text,text);
DROP FUNCTION IF EXISTS admin_delete_user(uuid);

-- Create a secure view for user management
CREATE OR REPLACE VIEW users_view AS
SELECT 
  au.id,
  au.email,
  au.created_at,
  p.name,
  s.plan_type,
  s.status,
  s.expires_at
FROM auth.users au
LEFT JOIN profiles p ON p.user_id = au.id
LEFT JOIN subscriptions s ON s.user_id = au.id
WHERE au.email != 'admin@commentify.com';

-- Create admin functions for user management
CREATE OR REPLACE FUNCTION admin_create_user(
  email text,
  password text,
  name text,
  plan_type text DEFAULT 'free'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Check if caller is admin
  IF (SELECT email FROM auth.users WHERE id = auth.uid()) != 'admin@commentify.com' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Create user in auth.users
  new_user_id := (
    SELECT id FROM auth.users 
    WHERE email = admin_create_user.email
  );
  
  IF new_user_id IS NULL THEN
    new_user_id := extensions.uuid_generate_v4();
    
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
      new_user_id,
      'authenticated',
      'authenticated',
      email,
      crypt(password, gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object('name', name),
      now(),
      now(),
      '',
      '',
      '',
      ''
    );
  END IF;

  -- Create profile
  INSERT INTO profiles (user_id, name)
  VALUES (new_user_id, name)
  ON CONFLICT (user_id) DO NOTHING;

  -- Create subscription if plan is not free
  IF plan_type != 'free' THEN
    INSERT INTO subscriptions (
      user_id,
      plan_type,
      status,
      trial_used,
      expires_at
    ) VALUES (
      new_user_id,
      plan_type,
      'active',
      false,
      now() + interval '1 month'
    )
    ON CONFLICT (user_id) DO UPDATE SET
      plan_type = EXCLUDED.plan_type,
      status = EXCLUDED.status,
      expires_at = EXCLUDED.expires_at;
  END IF;

  RETURN new_user_id;
END;
$$;

-- Function to update user
CREATE OR REPLACE FUNCTION admin_update_user(
  in_user_id uuid,
  in_name text,
  in_plan_type text,
  in_status text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if caller is admin
  IF (SELECT email FROM auth.users WHERE id = auth.uid()) != 'admin@commentify.com' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Update profile
  UPDATE profiles 
  SET name = in_name
  WHERE user_id = in_user_id;

  -- Update or insert subscription
  INSERT INTO subscriptions (
    user_id,
    plan_type,
    status,
    updated_at
  ) VALUES (
    in_user_id,
    in_plan_type,
    in_status,
    now()
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    plan_type = EXCLUDED.plan_type,
    status = EXCLUDED.status,
    updated_at = EXCLUDED.updated_at;
END;
$$;

-- Function to delete user
CREATE OR REPLACE FUNCTION admin_delete_user(
  in_user_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if caller is admin
  IF (SELECT email FROM auth.users WHERE id = auth.uid()) != 'admin@commentify.com' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Delete user's data
  DELETE FROM subscriptions WHERE user_id = in_user_id;
  DELETE FROM profiles WHERE user_id = in_user_id;
  DELETE FROM auth.users WHERE id = in_user_id;
END;
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON users_view TO authenticated;
GRANT EXECUTE ON FUNCTION admin_create_user TO authenticated;
GRANT EXECUTE ON FUNCTION admin_update_user TO authenticated;
GRANT EXECUTE ON FUNCTION admin_delete_user TO authenticated;