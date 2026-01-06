'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, User } from '@/lib/supabase'
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
    const initRef = useRef(false)

    const fetchUserProfile = useCallback(async (userId: string): Promise<User | null> => {
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

            return userProfile
        } catch (error) {
            console.error('Error in fetchUserProfile:', error)
            return null
        }
    }, [])

    useEffect(() => {
        // Prevent double initialization in React Strict Mode
        if (initRef.current) return
        initRef.current = true

        let mounted = true

        // Get initial session
        const getInitialSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession()

                if (!mounted) return

                if (error) {
                    console.error('Error getting session:', error)
                    setAuthState({ user: null, session: null, isLoading: false })
                    return
                }

                if (session?.user) {
                    const userProfile = await fetchUserProfile(session.user.id)
                    if (mounted) {
                        // If profile fetch failed, clear the session state
                        if (!userProfile) {
                            setAuthState({ user: null, session: null, isLoading: false })
                        } else {
                            setAuthState({ 
                                user: userProfile, 
                                session, 
                                isLoading: false 
                            })
                        }
                    }
                } else {
                    if (mounted) {
                        setAuthState({ user: null, session: null, isLoading: false })
                    }
                }
            } catch (error) {
                console.error('Error in getInitialSession:', error)
                if (mounted) {
                    setAuthState({ user: null, session: null, isLoading: false })
                }
            }
        }

        getInitialSession()

        // Subscribe to auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (!mounted) return

                console.log('Auth state changed:', event)

                if (event === 'SIGNED_OUT') {
                    setAuthState({ user: null, session: null, isLoading: false })
                } else if (session?.user) {
                    const userProfile = await fetchUserProfile(session.user.id)
                    if (mounted) {
                        if (!userProfile) {
                            setAuthState({ user: null, session: null, isLoading: false })
                        } else {
                            setAuthState({ 
                                user: userProfile, 
                                session, 
                                isLoading: false 
                            })
                        }
                    }
                } else {
                    if (mounted) {
                        setAuthState({ user: null, session: null, isLoading: false })
                    }
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
