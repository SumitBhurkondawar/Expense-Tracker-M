/*
  # Fix RLS Policies for User Registration

  1. Security Updates
    - Add policy to allow authenticated users to insert their own user record
    - This fixes the RLS violation when creating new users
    - Ensures users can only create records for themselves

  2. Changes
    - CREATE POLICY for INSERT on users table
    - Allows auth.uid() = id for user creation
*/

-- Allow authenticated users to insert their own user record
CREATE POLICY "Allow authenticated users to insert their own user record"
ON public.users FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);