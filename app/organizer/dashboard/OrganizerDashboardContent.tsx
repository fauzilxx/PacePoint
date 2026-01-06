'use client'

import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Calendar, Plus, FormInput, Users, LogOut, Edit, Eye, Loader2, AlertCircle, TrendingUp, DollarSign, Trophy } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { fetchOrganizerEvents } from "@/lib/api/events"
import { format } from "date-fns"

export default function OrganizerDashboardContent() {
  const { user, isLoading: authLoading, signOut } = useAuth({
    requireAuth: true,
    requiredRole: 'organizer',
    redirectTo: '/login',
  })

  const { data: myEvents, error: eventsError, isLoading: eventsLoading } = useSWR(
    user?.id ? `organizer-events-${user.id}` : null,
    () => fetchOrganizerEvents(user!.id)
  )

  if (authLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  // Calculate stats from real data
  const totalEvents = myEvents?.length || 0
  const activeEvents = myEvents?.filter(e => e.status === 'active').length || 0
  const draftEvents = myEvents?.filter(e => e.status === 'draft').length || 0
  const totalParticipants = myEvents?.reduce((sum, e) => sum + (e.current_participants || 0), 0) || 0
  const totalRevenue = myEvents?.reduce((sum, e) => sum + ((e.current_participants || 0) * e.price), 0) || 0

  return (
    <div className="flex min-h-screen bg-gray-50/50 dark:bg-black">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card hidden md:block">
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-primary/10 p-2 rounded-lg">
              <LayoutDashboard className="h-6 w-6 text-primary" />
            </div>
            <span className="font-bold text-lg">Organizer</span>
          </div>

          <nav className="space-y-2 flex-1">
            <Link
              href="/organizer/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-md bg-primary/10 text-primary font-medium"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/organizer/events"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            >
              <Calendar className="h-4 w-4" />
              My Events
            </Link>
            <Link
              href="/organizer/create"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            >
              <Plus className="h-4 w-4" />
              Create Event
            </Link>
            <Link
              href="/organizer/form-builder"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            >
              <FormInput className="h-4 w-4" />
              Form Builder
            </Link>
            <Link
              href="/organizer/participants"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            >
              <Users className="h-4 w-4" />
              Participants
            </Link>
          </nav>

          <div className="pt-6 border-t border-border">
            <div className="flex items-center gap-3 px-3 mb-4">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                {user.full_name?.charAt(0) || 'O'}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">{user.full_name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-destructive hover:bg-destructive/10 transition-colors w-full text-sm font-medium"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with your events.</p>
            </div>
            <Button asChild className="shadow-lg shadow-primary/20">
              <Link href="/organizer/create">
                <Plus className="h-4 w-4 mr-2" />
                Create New Event
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalEvents}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-primary font-medium">{activeEvents} Active</span> • {draftEvents} Drafts
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalParticipants}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  +0% from last month
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp {totalRevenue.toLocaleString('id-ID')}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Gross revenue from registrations
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Events Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">Recent Events</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/organizer/events" className="text-primary hover:text-primary/80">
                  View All
                </Link>
              </Button>
            </div>

            <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
              <CardContent className="p-0">
                {eventsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : eventsError ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-destructive">
                    <AlertCircle className="h-8 w-8 mb-2" />
                    <p>Failed to load events.</p>
                  </div>
                ) : myEvents && myEvents.length > 0 ? (
                  <div className="divide-y divide-border">
                    {myEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-6 hover:bg-muted/30 transition-colors gap-4"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-lg text-foreground">{event.name}</h3>
                            <Badge variant={event.status === "active" ? "default" : "secondary"} className="capitalize">
                              {event.status}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" />
                              {format(new Date(event.date), 'MMMM d, yyyy')}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Users className="h-3.5 w-3.5" />
                              {event.current_participants || 0} participants
                            </div>
                            <div className="flex items-center gap-1.5">
                              <DollarSign className="h-3.5 w-3.5" />
                              Rp {event.price.toLocaleString('id-ID')}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2 md:pt-0">
                          <Button variant="outline" size="sm" asChild className="h-8">
                            <Link href={`/organizer/events/${event.id}/form`}>
                              <FormInput className="h-3.5 w-3.5 mr-1.5" />
                              Form
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild className="h-8">
                            <Link href={`/organizer/events/${event.id}/edit`}>
                              <Edit className="h-3.5 w-3.5 mr-1.5" />
                              Edit
                            </Link>
                          </Button>
                          <Button size="sm" asChild className="h-8">
                            <Link href={`/events/${event.id}`}>
                              <Eye className="h-3.5 w-3.5 mr-1.5" />
                              View
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                      <LayoutDashboard className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No Events Created Yet</h3>
                    <p className="text-muted-foreground max-w-sm mb-6">
                      Gt started by creating your first running event. Usually it takes less than 5 minutes!
                    </p>
                    <Button asChild size="lg" className="shadow-lg shadow-primary/20">
                      <Link href="/organizer/create">
                        <Plus className="h-5 w-5 mr-2" />
                        Create Your First Event
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        )
}
