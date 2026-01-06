import { createClient } from '@/lib/client'
import { Withdrawal } from '@/lib/types'

// Fetch current wallet balance
export async function fetchWalletBalance(userId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('profiles')
        .select('wallet_balance, bank_name, bank_account_number, bank_account_holder')
        .eq('id', userId)
        .single()

    if (error) {
        console.error('Error fetching wallet balance:', error)
        throw new Error(error.message)
    }

    return data
}

// Request new withdrawal
export async function requestWithdrawal(userId: string, amount: number, bankDetails: any) {
    const supabase = createClient()

    // 1. Check balance first
    const { data: profile } = await supabase
        .from('profiles')
        .select('wallet_balance')
        .eq('id', userId)
        .single()

    if (!profile || (profile.wallet_balance || 0) < amount) {
        throw new Error('Insufficient balance')
    }

    // 2. Create withdrawal request
    const { data, error } = await supabase
        .from('withdrawals')
        .insert({
            user_id: userId,
            amount: amount,
            bank_details: bankDetails,
            status: 'pending'
        })
        .select()
        .single()

    if (error) throw error

    // 3. Deduct balance immediately (to prevent double withdraw)
    const { error: updateError } = await supabase.rpc('decrement_balance', {
        user_id_param: userId,
        amount_param: amount
    })

    // Fallback if RPC doesn't exist (simpler implementation for prototype)
    if (updateError) {
        await supabase
            .from('profiles')
            .update({ wallet_balance: (profile.wallet_balance || 0) - amount })
            .eq('id', userId)
    }

    return data
}

// Fetch withdrawal history
export async function fetchWithdrawals(userId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    if (error) throw error

    return data as Withdrawal[]
}

// SYSTEM: Distribute funds to organizer (Simulating Split Payment)
export async function distributeFundsToOrganizer(eventId: string, amount: number) {
    const supabase = createClient()

    // 1. Get Organizer ID from Event
    const { data: event } = await supabase
        .from('events')
        .select('organizer_id, name')
        .eq('id', eventId)
        .single()

    if (!event) throw new Error('Event not found')

    // 2. Calculate Split (Platform Fee 5%)
    const platformFee = amount * 0.05
    const organizerAmount = amount - platformFee

    // 3. Add to Organizer's Wallet
    // Ideally use RPC for atomicity, but for now fetching + updating is fine for MVP
    const { data: profile } = await supabase
        .from('profiles')
        .select('wallet_balance')
        .eq('id', event.organizer_id)
        .single()

    const currentBalance = Number(profile?.wallet_balance || 0)
    const newBalance = currentBalance + organizerAmount

    const { error } = await supabase
        .from('profiles')
        .update({ wallet_balance: newBalance })
        .eq('id', event.organizer_id)

    if (error) {
        console.error('Error distributing funds:', error)
        throw new Error('Failed to distribute funds')
    }

    return {
        success: true,
        organizerId: event.organizer_id,
        amountAdded: organizerAmount,
        platformFee: platformFee
    }
}
