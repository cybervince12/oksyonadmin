import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://ikvsahtemgarvhkvaftl.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrdnNhaHRlbWdhcnZoa3ZhZnRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkyNTM4MzksImV4cCI6MjA0NDgyOTgzOX0.8Il_7DeIq7FISKwf432O8cQH1xhhn9PVh-TWRbTkF5s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
