
export type User = {
    id: string
    email: string
    full_name: string
    role: 'runner' | 'organizer'
    created_at: string
    wallet_balance?: number
    bank_name?: string
    bank_account_number?: string
    bank_account_holder?: string
}

export type Withdrawal = {
    id: number
    user_id: string
    amount: number
    status: 'pending' | 'approved' | 'rejected'
    bank_details: {
        bank_name: string
        account_number: string
        account_holder: string
    }
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
    slug: string
    form_schema?: any
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
