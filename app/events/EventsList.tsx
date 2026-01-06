'use client'

import useSWR from 'swr'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, MapPin, Users, Search, AlertCircle } from "lucide-react"
import Link from "next/link"
import AnimatedContent from "@/components/AnimatedContent"
import { EventCardSkeletonGrid } from "@/components/EventCardSkeleton"
import { fetchActiveEvents } from "@/lib/api/events"
import { format } from "date-fns"
import { useState, useMemo } from "react"

export default function EventsList() {
  const { data: events, error, isLoading } = useSWR('active-events', fetchActiveEvents)
  const [searchQuery, setSearchQuery] = useState('')

  // Filter events based on search query
  const filteredEvents = useMemo(() => {
    if (!events) return []
    if (!searchQuery.trim()) return events

    const query = searchQuery.toLowerCase()
    return events.filter(event =>
      event.name.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query)
    )
  }, [events, searchQuery])

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 border-b border-border">
        <div className="container max-w-7xl mx-auto py-16 md:py-20 px-6 md:px-12">
          <AnimatedContent duration={0.8} initialOpacity={0} distance={30}>
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                Browse All Events
              </h1>
              <p className="text-lg text-muted-foreground">
                Discover running and trail events near you
              </p>

              {/* Search Bar */}
              <div className="max-w-xl mx-auto pt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events by name or location..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </AnimatedContent>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 md:py-24">
        <div className="container max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <EventCardSkeletonGrid count={6} />
            ) : error ? (
              <div className="col-span-full text-center py-12">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <p className="text-muted-foreground">Failed to load events. Please try again later.</p>
              </div>
            ) : filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => (
                <AnimatedContent
                  key={event.id}
                  duration={0.8}
                  initialOpacity={0}
                  distance={50}
                  delay={index * 0.1}
                >
                  <Card className="h-full flex flex-col overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="relative aspect-[3/2] overflow-hidden flex-shrink-0">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="bg-card/90 backdrop-blur">
                          {event.category === "trail" ? "Trail Run" : "Road Run"}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4 space-y-3 flex-grow">
                      <h3 className="font-semibold text-lg text-foreground line-clamp-2 min-h-[3.5rem]">{event.name}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(event.date), 'MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{event.current_participants || 0} registered</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {event.distances.map((distance: string) => (
                          <Badge key={distance} variant="outline" className="text-xs">
                            {distance}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button className="w-full" asChild>
                        <Link href={`/events/${event.slug || event.id}`}>View Details</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </AnimatedContent>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">
                  {searchQuery ? 'No events match your search.' : 'No events available.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
