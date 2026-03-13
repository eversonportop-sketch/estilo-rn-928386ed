import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://leluyitpsvioreieqghe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlbHV5aXRwc3Zpb3JlaWVxZ2hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MDgwMDIsImV4cCI6MjA4Nzk4NDAwMn0.zbKEW1nnR3-oHADrpzSIoQL-qv4DWp9NfjDBBsDErcE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
