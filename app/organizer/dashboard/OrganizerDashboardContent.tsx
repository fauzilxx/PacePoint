'use client'

import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Calendar, Plus, FormInput, Users, LogOut, Edit, Eye, Loader2, AlertCircle } from "lucide-react"
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
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
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
    <div className="flex-1 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-sidebar">
        <div className="p-6">
          <h2 className="font-semibold text-sidebar-foreground mb-6">Organizer</h2>
          <nav className="space-y-2">
            <Link
              href="/organizer/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-md bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/organizer/events"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <Calendar className="h-4 w-4" />
              My Events
            </Link>
            <Link
              href="/organizer/create"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Event
            </Link>
            <Link
              href="/organizer/form-builder"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <FormInput className="h-4 w-4" />
              Form Builder
            </Link>
            <Link
              href="/organizer/participants"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <Users className="h-4 w-4" />
              Participants
            </Link>
            <button
              onClick={signOut}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors w-full mt-4"
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage your events and participants</p>
            </div>
            <Button asChild>
              <Link href="/organizer/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{totalEvents}</div>
                <p className="text-xs text-muted-foreground mt-1">{activeEvents} active, {draftEvents} draft</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Participants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{totalParticipants}</div>
                <p className="text-xs text-muted-foreground mt-1">Across all events</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">${totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">From registrations</p>
              </CardContent>
            </Card>
          </div>

          {/* Events Table */}
          <Card>
            <CardHeader>
              <CardTitle>My Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {eventsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">Loading events...</span>
                  </div>
                ) : eventsError ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                    <p className="text-muted-foreground">Failed to load events</p>
                  </div>
                ) : myEvents && myEvents.length > 0 ? (
                  myEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-foreground">{event.name}</h3>
                          <Badge variant={event.status === "active" ? "default" : "secondary"}>
                            {event.status === 'active' ? 'Active' : event.status === 'draft' ? 'Draft' : event.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(event.date), 'MMMM d, yyyy')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {event.current_participants || 0} participants
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/organizer/events/${event.id}/edit`}>
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/organizer/events/${event.id}/form`}>
                            <FormInput className="h-3 w-3 mr-1" />
                            Form
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/events/${event.id}`}>
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">You haven't created any events yet.</p>
                    <Button asChild>
                      <Link href="/organizer/create">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Event
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
