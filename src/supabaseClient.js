import { createClient } from '@supabase/supabase-js'

// Replace with your actual Supabase URL and Anon Key
const supabaseUrl = 'https://uqkovdggjffblixvedal.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxa292ZGdnamZmYmxpeHZlZGFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQyNzE4MTcsImV4cCI6MjEwOTg0NzgxN30.yMUbGy6t6BL2-p6ge9IPRJGYxYUKKvy8WUHVjedwjgI'

export const supabase = createClient(supabaseUrl, supabaseKey)