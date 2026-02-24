import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hncblzacgvqnotmjmqft.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuY2JsemFjZ3Zxbm90bWptcWZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MDYxOTYsImV4cCI6MjA3MTA4MjE5Nn0.P07ox30Z8y9z9OnYsZB157YQBhhtJ9pCpTH6ibVC_gk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export { supabaseUrl }
