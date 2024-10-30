import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://lssdyqcpbcrnhmlgrble.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxzc2R5cWNwYmNybmhtbGdyYmxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg3MTQyNDEsImV4cCI6MjA0NDI5MDI0MX0.QugPAZMtjf9N_WgoSRkQh3_F6OeD0UTCg1qH-JHm2V0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
