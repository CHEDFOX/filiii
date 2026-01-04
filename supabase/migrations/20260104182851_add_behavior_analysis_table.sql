/*
  # Create Behavior Analysis Table

  1. New Tables
    - `behavior_analyses`
      - `id` (uuid, primary key) - unique analysis ID
      - `user_id` (uuid, foreign key) - references users table
      - `analysis_data` (jsonb) - stores complete AI analysis
      - `timeframe_start` (timestamptz) - start of analyzed period
      - `timeframe_end` (timestamptz) - end of analyzed period
      - `days_tracked` (integer) - number of days in analysis
      - `created_at` (timestamptz) - when analysis was generated
      - `viewed` (boolean) - whether user has seen the insights

  2. Purpose
    - Store AI-generated behavioral insights over time
    - Track pattern changes and recommendation history
    - Enable AI to reference past analyses for continuity
    - Allow users to review their progress journey

  3. Security
    - Enable RLS on `behavior_analyses` table
    - Users can only read their own analyses
    - System can insert new analyses (via service role)

  4. Indexes
    - Index on user_id for fast user queries
    - Index on created_at for chronological sorting
    - Composite index for recent analyses by user
*/

CREATE TABLE IF NOT EXISTS behavior_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  analysis_data jsonb NOT NULL,
  timeframe_start timestamptz NOT NULL,
  timeframe_end timestamptz NOT NULL,
  days_tracked integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  viewed boolean DEFAULT false
);

ALTER TABLE behavior_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own analyses"
  ON behavior_analyses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert analyses"
  ON behavior_analyses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update viewed status"
  ON behavior_analyses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_behavior_analyses_user_id 
  ON behavior_analyses(user_id);

CREATE INDEX IF NOT EXISTS idx_behavior_analyses_created_at 
  ON behavior_analyses(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_behavior_analyses_user_recent 
  ON behavior_analyses(user_id, created_at DESC);