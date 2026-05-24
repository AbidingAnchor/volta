import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://axvyynsbauvphesyznvv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dnl5bnNiYXV2cGhlc3l6bnZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1Nzg1MzIsImV4cCI6MjA5NTE1NDUzMn0.uZPlxH9CLU4H6sb5b4Iqrci9n0eTF87zrbPRh6j15VA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
