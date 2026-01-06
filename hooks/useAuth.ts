'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/client'
import { User } from '@/lib/types'
import type { Session } from '@supabase/supabase-js'

interface AuthState {
    user: User | null
    session: Session | null
    isLoading: boolean
}

interface UseAuthOptions {
    redirectTo?: string
    requireAuth?: boolean
    requiredRole?: 'runner' | 'organizer'
}

export function useAuth(options: UseAuthOptions = {}) {
    const { redirectTo = '/login', requireAuth = false, requiredRole } = options
    const router = useRouter()
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        session: null,
        isLoading: true,
    })

    const fetchUserProfile = useCallback(async (userId: string): Promise<User | null> => {
        console.log('fetchUserProfile: fetching for', userId)
        try {
            const { data: userProfile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()

            if (error) {
                console.error('Error fetching user profile:', error)
                // If profile doesn't exist, sign out the user to clear invalid session
                if (error.code === 'PGRST116') {
                    console.log('Profile not found, signing out user')
                    await supabase.auth.signOut()
                }
                return null
            }

            console.log('fetchUserProfile: success', userProfile)
            return userProfile
        } catch (error) {
            console.error('Error in fetchUserProfile:', error)
            return null
        }
    }, [])

    useEffect(() => {
        let mounted = true

        // Function to handle state updates safely
        const handleAuthUpdate = async (session: Session | null) => {
            if (!mounted) return

            if (!session?.user) {
                setAuthState({ user: null, session: null, isLoading: false })
                return
            }

            // Add timeout to profile fetch to prevent infinite loading
            const timeoutPromise = new Promise<User | null>((resolve) => {
                setTimeout(() => {
                    console.warn('Profile fetch timed out')
                    resolve(null)
                }, 5000) // 5s timeout
            })

            try {
                const userProfile = await Promise.race([
                    fetchUserProfile(session.user.id),
                    timeoutPromise
                ])

                if (!mounted) return

                if (!userProfile) {
                    console.log('useAuth: No profile found or timed out, clearing state')
                    setAuthState({ user: null, session: null, isLoading: false })
                } else {
                    console.log('useAuth: Setting authenticated state')
                    setAuthState({
                        user: userProfile,
                        session,
                        isLoading: false
                    })
                }
            } catch (error) {
                console.error('Error in handleAuthUpdate', error)
                if (mounted) {
                    setAuthState({ user: null, session: null, isLoading: false })
                }
            }
        }

        // Check current session immediately
        supabase.auth.getSession().then(({ data: { session } }) => {
            handleAuthUpdate(session)
        })

        // Subscribe to changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth state changed:', event)
                if (event === 'SIGNED_OUT') {
                    if (mounted) setAuthState({ user: null, session: null, isLoading: false })
                } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                    handleAuthUpdate(session)
                }
            }
        )

        return () => {
            mounted = false
            subscription.unsubscribe()
        }
    }, [fetchUserProfile])

    // Handle redirects based on auth state
    useEffect(() => {
        if (authState.isLoading) return

        if (requireAuth && !authState.user) {
            const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
            // Don't redirect if already on login page
            if (currentPath !== redirectTo) {
                router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`)
            }
            return
        }

        if (requiredRole && authState.user && authState.user.role !== requiredRole) {
            // Redirect to the correct dashboard based on actual role
            const correctDashboard = authState.user.role === 'organizer'
                ? '/organizer/dashboard'
                : '/runner/dashboard'

            // Only redirect if not already on correct dashboard
            const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
            if (currentPath !== correctDashboard) {
                router.push(correctDashboard)
            }
        }
    }, [authState.isLoading, authState.user, requireAuth, requiredRole, redirectTo, router])

    const signOut = useCallback(async () => {
        try {
            // Clear auth state immediately
            setAuthState({ user: null, session: null, isLoading: false })

            const { error } = await supabase.auth.signOut()
            if (error) {
                console.error('Error signing out:', error)
            }

            // Use window.location for hard navigation to clear all state
            window.location.href = '/'
        } catch (error) {
            console.error('Error in signOut:', error)
            // Still redirect even if there's an error
            window.location.href = '/'
        }
    }, [])

    const refreshUser = useCallback(async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
            const userProfile = await fetchUserProfile(session.user.id)
            setAuthState(prev => ({
                ...prev,
                user: userProfile
            }))
        }
    }, [fetchUserProfile])

    return {
        user: authState.user,
        session: authState.session,
        isLoading: authState.isLoading,
        isAuthenticated: !!authState.user,
        signOut,
        refreshUser,
    }
}
