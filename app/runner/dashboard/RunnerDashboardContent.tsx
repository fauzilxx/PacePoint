'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, User, LogOut, Loader2, AlertCircle, Trophy, Clock } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { fetchUserRegistrations } from "@/lib/api/registrations"
import { fetchActiveEvents } from "@/lib/api/events"
import { format } from "date-fns"

export default function RunnerDashboardContent() {
  const router = useRouter()
  const { user, isLoading: authLoading, signOut } = useAuth({
    requireAuth: true,
    requiredRole: 'runner',
    redirectTo: '/login',
  })

  const [activeTab, setActiveTab] = useState('my-events')

  // Fetch user's registrations
  const { data: registrations, error: regError, isLoading: regLoading } = useSWR(
    user ? `registrations-${user.id}` : null,
    () => user ? fetchUserRegistrations(user.id) : null,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  )

  // Fetch available events
  const { data: availableEvents, error: eventsError, isLoading: eventsLoading } = useSWR(
    'available-events-runner',
    () => fetchActiveEvents(10),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  )

  if (authLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default"
      case "pending":
        return "secondary"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getPaymentColor = (status: string) => {
    switch (status) {
      case "paid":
        return "default"
      case "pending":
        return "secondary"
      case "refunded":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="flex-1 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-sidebar">
        <div className="p-6">
          <h2 className="font-semibold text-sidebar-foreground mb-6">Runner Dashboard</h2>
          <nav className="space-y-2">
            <Link
              href="/runner/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-md bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            >
              <Calendar className="h-4 w-4" />
              My Events
            </Link>
            <Link
              href="/runner/profile"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
            <button
              onClick={signOut}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors w-full"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-background">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
            <p className="text-muted-foreground mt-1">View available events and manage your registrations</p>
          </div>

          <div className="space-y-6">
            <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
              <button
                onClick={() => setActiveTab('my-events')}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  activeTab === 'my-events' ? 'bg-background text-foreground shadow-sm' : ''
                }`}
              >
                My Registrations
              </button>
              <button
                onClick={() => setActiveTab('available')}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  activeTab === 'available' ? 'bg-background text-foreground shadow-sm' : ''
                }`}
              >
                Available Events
              </button>
            </div>

            {/* My Registrations Tab */}
            {activeTab === 'my-events' && (
              <div>
                {regLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-muted-foreground">Loading your registrations...</p>
                    </div>
                  </div>
                ) : regError ? (
                  <Card>
                    <CardContent className="flex items-center justify-center py-12">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <AlertCircle className="h-8 w-8 text-destructive" />
                        <p className="text-sm text-muted-foreground">Failed to load registrations</p>
                        <p className="text-xs text-muted-foreground">{regError.message}</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : !registrations || registrations.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Registrations Yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        You haven't registered for any events. Browse available events to get started!
                      </p>
                      <Button onClick={() => setActiveTab('available')}>
                        Browse Events
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6">
                    {registrations.map((registration) => {
                      const event = registration.event
                      if (!event) return null
                      
                      return (
                        <Card key={registration.id}>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-xl">{event.name}</CardTitle>
                                <CardDescription className="mt-1">{registration.distance}</CardDescription>
                              </div>
                              <div className="flex gap-2">
                                <Badge variant={getStatusColor(registration.status)}>
                                  {registration.status}
                                </Badge>
                                <Badge variant={getPaymentColor(registration.payment_status)}>
                                  {registration.payment_status}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>{format(new Date(event.date), 'PPP')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  <span>{event.location}</span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/events/${event.id}`}>
                                    View Details
                                  </Link>
                                </Button>
                                {registration.payment_status === "pending" && (
                                  <Button size="sm" asChild>
                                    <Link href={`/payment?registration=${registration.id}`}>
                                      Complete Payment
                                    </Link>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Available Events Tab */}
            {activeTab === 'available' && (
              <div>
                {eventsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-muted-foreground">Loading available events...</p>
                    </div>
                  </div>
                ) : eventsError ? (
                  <Card>
                    <CardContent className="flex items-center justify-center py-12">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <AlertCircle className="h-8 w-8 text-destructive" />
                        <p className="text-sm text-muted-foreground">Failed to load events</p>
                        <p className="text-xs text-muted-foreground">{eventsError.message}</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : !availableEvents || availableEvents.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Events Available</h3>
                      <p className="text-sm text-muted-foreground">
                        There are no upcoming events at the moment. Check back soon!
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6">
                    {availableEvents.map((event) => {
                      const isRegistered = registrations?.some(r => r.event_id === event.id)
                      const isFull = event.max_participants ? event.current_participants >= event.max_participants : false

                      return (
                        <Card key={event.id}>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-xl">{event.name}</CardTitle>
                                <CardDescription className="mt-1">
                                  {event.distances && event.distances.length > 0 ? event.distances.join(', ') : 'N/A'}
                                </CardDescription>
                              </div>
                              <div className="flex gap-2">
                                {isFull && <Badge variant="destructive">Full</Badge>}
                                {isRegistered && <Badge>Registered</Badge>}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>{format(new Date(event.date), 'PPP')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  <span>{event.location}</span>
                                </div>
                              </div>
                              
                              <div className="text-sm space-y-1">
                                <p><strong>Registration Fee:</strong> Rp {event.price.toLocaleString('id-ID')}</p>
                                <p><strong>Participants:</strong> {event.current_participants}/{event.max_participants || 'Unlimited'}</p>
                                {event.description && (
                                  <p className="text-muted-foreground line-clamp-2">{event.description}</p>
                                )}
                              </div>

                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" asChild className="flex-1">
                                  <Link href={`/events/${event.id}`}>
                                    View Details
                                  </Link>
                                </Button>
                                {!isRegistered && !isFull && (
                                  <Button size="sm" asChild className="flex-1">
                                    <Link href={`/events/${event.id}/register`}>
                                      Register Now
                                    </Link>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
