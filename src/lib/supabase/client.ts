import { createClient } from '@supabase/supabase-js'

//const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
//const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabaseUrl = 'https://ihtecsikncmnzsanpdaa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlodGVjc2lrbmNtbnpzYW5wZGFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDk5NTk4MCwiZXhwIjoyMDkwNTcxOTgwfQ.TWUGXJu54eSeP__gzYmzFgyybEoqQQjJo3HWYTA_BZ8'

console.log("SUPABASE URL:", supabaseUrl)
console.log("SUPABASE KEY:", supabaseAnonKey?.substring(0, 20))

export const supabase = createClient(supabaseUrl, supabaseAnonKey)