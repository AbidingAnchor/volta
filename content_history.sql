-- Create content_history table
CREATE TABLE IF NOT EXISTS content_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  input_text TEXT NOT NULL,
  twitter TEXT,
  linkedin TEXT,
  instagram TEXT,
  facebook TEXT,
  email TEXT,
  tone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE content_history ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only view their own content history
CREATE POLICY "Users can view own content history"
  ON content_history FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can insert their own content history
CREATE POLICY "Users can insert own content history"
  ON content_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can delete their own content history
CREATE POLICY "Users can delete own content history"
  ON content_history FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_content_history_user_created
  ON content_history(user_id, created_at DESC);
