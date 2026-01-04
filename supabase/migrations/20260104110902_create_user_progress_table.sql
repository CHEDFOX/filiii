/*
  # Create user progress table

  1. New Tables
    - `user_progress`
      - `user_id` (uuid, primary key, foreign key to users)
      - `total_habits` (integer) - total number of habits
      - `completed_today` (integer) - habits completed today
      - `streak` (integer) - current streak in days
      - `completion_rate` (integer) - completion rate percentage
      - `last_updated` (timestamptz) - last update timestamp

  2. Security
    - Enable RLS on `user_progress` table
    - Add policies for authenticated users to manage their own progress
*/

CREATE TABLE IF NOT EXISTS user_progress (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total_habits integer DEFAULT 0,
  completed_today integer DEFAULT 0,
  streak integer DEFAULT 0,
  completion_rate integer DEFAULT 0,
  last_updated timestamptz DEFAULT now()
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own progress"
  ON user_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
  ON user_progress
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
