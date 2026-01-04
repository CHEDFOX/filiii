/*
  # Create habits table

  1. New Tables
    - `habits`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `name` (text) - habit name
      - `description` (text) - habit description
      - `category` (text) - mental, physical, or hybrid
      - `duration` (integer) - duration in minutes
      - `frequency` (text) - daily, 3x/week, etc.
      - `priority` (text) - high, medium, or low
      - `notifications_enabled` (boolean) - whether notifications are enabled
      - `notification_time` (text, nullable) - time for notifications
      - `completed_dates` (text array) - array of ISO date strings
      - `ai_generated` (boolean) - whether habit was AI-generated
      - `created_at` (timestamptz) - creation timestamp

  2. Security
    - Enable RLS on `habits` table
    - Add policies for authenticated users to manage their own habits
*/

CREATE TABLE IF NOT EXISTS habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('mental', 'physical', 'hybrid')),
  duration integer NOT NULL,
  frequency text NOT NULL,
  priority text NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  notifications_enabled boolean DEFAULT false,
  notification_time text,
  completed_dates text[] DEFAULT ARRAY[]::text[],
  ai_generated boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own habits"
  ON habits
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habits"
  ON habits
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits"
  ON habits
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own habits"
  ON habits
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
