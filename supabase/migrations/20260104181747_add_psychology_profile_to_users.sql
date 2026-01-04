/*
  # Add Psychology Profile to Users

  1. Changes
    - Add `psychology_profile` column to `users` table
      - Stores comprehensive psychological analysis as JSONB
      - Includes self-talk patterns, motivation sources, resilience style
      - Contains coaching preferences and risk factors
      - Nullable to allow gradual profile building

  2. Benefits
    - Enables deeply personalized AI coaching
    - Stores rich psychological insights for adaptive responses
    - Allows progressive profiling over time
    - Maintains user privacy within their own record

  3. Security
    - No RLS changes needed (inherits existing user policies)
    - Users can only access their own psychology profile
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'psychology_profile'
  ) THEN
    ALTER TABLE users ADD COLUMN psychology_profile jsonb;
  END IF;
END $$;