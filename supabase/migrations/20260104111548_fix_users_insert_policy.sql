/*
  # Fix users table INSERT policy

  1. Changes
    - Add INSERT policy to allow authenticated users to create their own profile
    - This fixes the "new row violates row-level security policy" error during signup

  2. Security
    - Users can only insert a row with their own auth.uid()
*/

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
