import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://tssqkpvnnoazupcppbdf.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzc3FrcHZubm9henVwY3BwYmRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0OTcyMjUsImV4cCI6MjA4OTA3MzIyNX0.vjRGuD8p6c8E_w9HiNgzELQWpnN6kXONHpvSFmZxul8'

export const db = createClient(SUPABASE_URL, SUPABASE_KEY)