import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const PROJECT_URL = process.env.NEXT_PUBLIC_PROJECT_URL || 'project_url'
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'api_key'

export const supabase = createClient(PROJECT_URL, API_KEY)