import { createClient } from '@/lib/client'
import { User } from '@/lib/types'

// Update user profile
export async function updateUserProfile(userId: string, updates: Partial<User>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    throw new Error(error.message)
  }

  return data as User
}

// Get user profile
export async function getUserProfile(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    throw new Error(error.message)
  }

  return data as User
}

// Update password
export async function updatePassword(newPassword: string) {
  const supabase = createClient()
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (error) {
    console.error('Error updating password:', error)
    throw new Error(error.message)
  }

  return { success: true }
}

// Update email
export async function updateEmail(newEmail: string) {
  const supabase = createClient()
  const { error } = await supabase.auth.updateUser({
    email: newEmail
  })

  if (error) {
    console.error('Error updating email:', error)
    throw new Error(error.message)
  }

  return { success: true }
}
