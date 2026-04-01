CREATE TABLE IF NOT EXISTS scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_scores_score ON scores(score DESC);
CREATE INDEX IF NOT EXISTS idx_scores_created_at ON scores(created_at DESC);