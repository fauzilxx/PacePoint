import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Missing Supabase environment variables. Please check your .env.local file.')
  console.warn('Create .env.local with:')
  console.warn('NEXT_PUBLIC_SUPABASE_URL=your-url')
  console.warn('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// Database Types
export type User = {
  id: string
  email: string
  full_name: string
  role: 'runner' | 'organizer'
  created_at: string
}

export type Event = {
  id: number
  name: string
  date: string
  location: string
  image: string | null
  distances: string[]
  max_participants: number | null
  current_participants: number
  category: 'trail' | 'road'
  price: number
  description: string | null
  organizer_id: string
  status: 'draft' | 'active' | 'cancelled' | 'completed'
  created_at: string
  updated_at: string
}

export type Registration = {
  id: number
  user_id: string
  event_id: number
  distance: string
  bib_number: string | null
  tshirt_size: string | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  medical_conditions: string | null
  status: 'pending' | 'confirmed' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'refunded'
  created_at: string
  updated_at: string
}

export type Payment = {
  id: number
  registration_id: number
  amount: number
  payment_method: 'qris' | 'card' | 'transfer'
  transaction_id: string
  payment_proof_url: string | null
  status: 'pending' | 'confirmed' | 'failed' | 'refunded'
  payment_date: string | null
  created_at: string
  updated_at: string
}
