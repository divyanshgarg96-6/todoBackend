

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eflqhjxgmdqixirrtgxg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmbHFoanhnbWRxaXhpcnJ0Z3hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMzk3MzQsImV4cCI6MjA3NDcxNTczNH0.nJkk2QdyfJ9vTEgVVxb2hFSRee7B1M_hTTq3nvuzRwg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
