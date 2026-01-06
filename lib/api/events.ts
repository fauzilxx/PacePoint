import { createClient } from '@/lib/client'
import { Event } from '@/lib/types'

// Types for creating/updating events
export type CreateEventData = Omit<Event, 'id' | 'created_at' | 'organizer_id'> & {
    organizer_id?: string
    form_schema?: any
}

export type UpdateEventData = Partial<CreateEventData>

export type EventWithOrganizer = Event & {
    organizer?: {
        full_name: string
        email: string
    }
}

// Fetch all events (with optional filters)
export async function fetchEvents(options?: {
    status?: string
    category?: 'trail' | 'road'
    limit?: number
}) {
    const supabase = createClient()
    let query = supabase
        .from('events')
        .select(`
      *,
      organizer:profiles!events_organizer_id_fkey(full_name, email)
    `)
        .order('date', { ascending: true })

    // Filter by status (default to active for public pages)
    if (options?.status) {
        query = query.eq('status', options.status)
    }

    // Filter by category
    if (options?.category) {
        query = query.eq('category', options.category)
    }

    // Limit results
    if (options?.limit) {
        query = query.limit(options.limit)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching events:', error)
        throw new Error(error.message)
    }

    return data as EventWithOrganizer[]
}

// Fetch active events only (for public pages)
export async function fetchActiveEvents(limit?: number) {
    return fetchEvents({ status: 'active', limit })
}

// Fetch single event by ID
export async function fetchEventById(id: number) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('events')
        .select(`
      *,
      organizer:profiles!events_organizer_id_fkey(full_name, email)
    `)
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching event:', error)
        throw new Error(error.message)
    }

    return data as EventWithOrganizer
}

// Fetch events by organizer ID
export async function fetchOrganizerEvents(organizerId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('organizer_id', organizerId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching organizer events:', error)
        throw new Error(error.message)
    }

    return data as Event[]
}

// Create a new event
export async function createEvent(eventData: CreateEventData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
        .from('events')
        .insert({
            ...eventData,
            organizer_id: user.id,
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating event:', error)
        throw new Error(error.message)
    }

    return data as Event
}

// Update an existing event
export async function updateEvent(id: number, eventData: UpdateEventData) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating event:', error)
        throw new Error(error.message)
    }

    return data as Event
}

// Delete an event
export async function deleteEvent(id: number) {
    const supabase = createClient()
    const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting event:', error)
        throw new Error(error.message)
    }

    return true
}

// SWR fetcher functions
export const eventsFetcher = () => fetchActiveEvents()
export const eventByIdFetcher = (id: number) => () => fetchEventById(id)
export const organizerEventsFetcher = (organizerId: string) => () => fetchOrganizerEvents(organizerId)
