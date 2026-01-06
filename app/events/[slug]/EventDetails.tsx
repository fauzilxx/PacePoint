'use client'

import useSWR from 'swr'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, DollarSign, Tag, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { fetchEventBySlug, EventWithOrganizer } from "@/lib/api/events"
import { format } from "date-fns"

interface EventDetailsProps {
  slug: string
}

export default function EventDetails({ slug }: EventDetailsProps) {
  const { data: event, error, isLoading } = useSWR<EventWithOrganizer>(
    slug ? `event-${slug}` : null,
    () => fetchEventBySlug(slug)
  )

  if (isLoading) {
    return (
      <main className="flex-1 py-12">
        <div className="container max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading event details...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error || !event) {
    return (
      <main className="flex-1 py-12">
        <div className="container max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <h2 className="text-xl font-semibold text-foreground">Event Not Found</h2>
            <p className="text-muted-foreground">The event you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link href="/events">Browse All Events</Link>
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 py-12">
      <div className="container max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Event Banner */}
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-lg border border-border">
            <img
              src={event.image || "/placeholder.svg"}
              alt={event.name}
              className="object-cover w-full h-full"
            />
            <div className="absolute top-4 right-4">
              <Badge className="bg-primary text-primary-foreground text-sm px-3 py-1">
                {event.status === 'active' ? 'Open for Registration' : event.status}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">{event.name}</h1>
                <p className="text-muted-foreground">
                  Organized by <span className="font-semibold text-foreground">{event.organizer?.full_name || 'Event Organizer'}</span>
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>About This Event</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                  {event.description ? (
                    <p>{event.description}</p>
                  ) : (
                    <p>No description available for this event.</p>
                  )}
                  <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">What's Included</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Official race bib and timing chip</li>
                    <li>Technical event t-shirt</li>
                    <li>Finisher medal for all participants</li>
                    <li>Post-race refreshments and meals</li>
                    <li>Professional timing and results</li>
                    <li>Aid stations with hydration and nutrition</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Date & Time</p>
                      <p className="text-sm text-muted-foreground">{format(new Date(event.date), 'MMMM d, yyyy')}</p>
                      <p className="text-sm text-muted-foreground">{format(new Date(event.date), 'h:mm a')} Start</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Location</p>
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Tag className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Category</p>
                      <p className="text-sm text-muted-foreground">{event.category === 'trail' ? 'Trail Run' : 'Road Run'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Registration Fee</p>
                      <p className="text-sm text-muted-foreground">${event.price}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Participants</p>
                      <p className="text-sm text-muted-foreground">
                        {event.current_participants || 0} / {event.max_participants || '∞'} spots filled
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distance Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {event.distances.map((distance: string) => (
                      <Badge key={distance} variant="outline" className="w-full justify-center py-2">
                        {distance}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Button size="lg" className="w-full" asChild>
                <Link href={`/events/${event.slug || event.id}/register`}>Register Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
