/*
  # Create routines table

  1. New Tables
    - `routines`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `time_of_day` (text) - morning, afternoon, or evening
      - `activities` (text array) - list of activities
      - `duration` (integer) - duration in minutes
      - `created_at` (timestamptz) - creation timestamp

  2. Security
    - Enable RLS on `routines` table
    - Add policies for authenticated users to manage their own routines
*/

CREATE TABLE IF NOT EXISTS routines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  time_of_day text NOT NULL CHECK (time_of_day IN ('morning', 'afternoon', 'evening')),
  activities text[] NOT NULL,
  duration integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE routines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own routines"
  ON routines
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own routines"
  ON routines
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own routines"
  ON routines
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own routines"
  ON routines
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
