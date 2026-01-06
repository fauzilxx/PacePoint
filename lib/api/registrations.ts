import { supabase } from '@/lib/supabase'

export type RegistrationWithEvent = {
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
  event?: {
    id: number
    name: string
    date: string
    location: string
    image: string | null
    category: 'trail' | 'road'
    price: number
  }
}

// Fetch user's registrations
export async function fetchUserRegistrations(userId: string) {
  const { data, error } = await supabase
    .from('registrations')
    .select(`
      *,
      event:events(
        id,
        name,
        date,
        location,
        image,
        category,
        price
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching registrations:', error)
    throw new Error(error.message)
  }

  return data as RegistrationWithEvent[]
}

// Fetch single registration
export async function fetchRegistration(registrationId: number) {
  const { data, error } = await supabase
    .from('registrations')
    .select(`
      *,
      event:events(*)
    `)
    .eq('id', registrationId)
    .single()

  if (error) {
    console.error('Error fetching registration:', error)
    throw new Error(error.message)
  }

  return data as RegistrationWithEvent
}

// Create registration
export async function createRegistration(registration: {
  user_id: string
  event_id: number
  distance: string
  tshirt_size?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  medical_conditions?: string
}) {
  const { data, error } = await supabase
    .from('registrations')
    .insert(registration)
    .select()
    .single()

  if (error) {
    console.error('Error creating registration:', error)
    throw new Error(error.message)
  }

  return data
}

// Update registration
export async function updateRegistration(
  registrationId: number,
  updates: Partial<RegistrationWithEvent>
) {
  const { data, error } = await supabase
    .from('registrations')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', registrationId)
    .select()
    .single()

  if (error) {
    console.error('Error updating registration:', error)
    throw new Error(error.message)
  }

  return data
}

// Cancel registration
export async function cancelRegistration(registrationId: number) {
  const { data, error } = await supabase
    .from('registrations')
    .update({ 
      status: 'cancelled',
      updated_at: new Date().toISOString() 
    })
    .eq('id', registrationId)
    .select()
    .single()

  if (error) {
    console.error('Error cancelling registration:', error)
    throw new Error(error.message)
  }

  return data
}
