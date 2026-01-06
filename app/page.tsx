'use client'

import useSWR from 'swr'
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, AlertCircle } from "lucide-react"
import Link from "next/link"
import AnimatedContent from "@/components/AnimatedContent"
import { EventCardSkeletonGrid } from "@/components/EventCardSkeleton"
import { fetchActiveEvents } from "@/lib/api/events"
import { fetchPublishedBlogPosts } from "@/lib/api/blog"
import { format } from "date-fns"

export default function HomePage() {
  const { data: events, error: eventsError, isLoading: eventsLoading } = useSWR('active-events-home', () => fetchActiveEvents(4))
  const { data: blogPosts, error: blogError, isLoading: blogLoading } = useSWR('blog-posts-home', () => fetchPublishedBlogPosts(3))

  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 border-b border-border">
        <div className="container max-w-7xl mx-auto py-24 md:py-32 px-6 md:px-12">
          <AnimatedContent duration={1} initialOpacity={0} distance={50}>
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance text-foreground">
                Find Your Pace, Discover Your Race
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground text-balance">
                Whether you're crushing your first 5K or conquering summit trails, we connect you with races that challenge and inspire. Your next adventure starts here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" onClick={() => smoothScrollTo('events')}>
                  Browse Events
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/organizer">Organize an Event</Link>
                </Button>
              </div>
            </div>
          </AnimatedContent>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section id="events" className="py-16 md:py-24">
        <div className="container max-w-7xl mx-auto px-6 md:px-12">
          <AnimatedContent duration={0.8} initialOpacity={0} distance={30}>
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">Upcoming Events</h2>
                <p className="text-muted-foreground mt-2">Register for your next challenge</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/events">View All</Link>
              </Button>
            </div>
          </AnimatedContent>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {eventsLoading ? (
              <EventCardSkeletonGrid count={4} />
            ) : eventsError ? (
              <div className="col-span-full text-center py-12">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <p className="text-muted-foreground">Failed to load events. Please try again later.</p>
              </div>
            ) : events && events.length > 0 ? (
              events.map((event, index) => (
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
                        {event.distances.map((distance) => (
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
                <p className="text-muted-foreground">No upcoming events available.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container max-w-7xl mx-auto px-6 md:px-12">
          <AnimatedContent duration={0.8} initialOpacity={0} distance={30}>
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">Latest from Our Blog</h2>
                <p className="text-muted-foreground mt-2">Tips, guides, and running insights</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/blog">Read More</Link>
              </Button>
            </div>
          </AnimatedContent>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogLoading ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">Loading blog posts...</p>
              </div>
            ) : blogError ? (
              <div className="col-span-full text-center py-12">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <p className="text-muted-foreground">Failed to load blog posts.</p>
              </div>
            ) : blogPosts && blogPosts.length > 0 ? (
              blogPosts.map((post, idx) => (
                <AnimatedContent
                  key={post.id}
                  duration={0.8}
                  initialOpacity={0}
                  distance={50}
                  delay={idx * 0.15}
                >
                  <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative aspect-video overflow-hidden flex-shrink-0">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-6 space-y-3 flex-grow">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        {post.published_at ? format(new Date(post.published_at), 'MMM dd, yyyy') : ''}
                      </p>
                      <h3 className="font-semibold text-lg text-foreground min-h-[3.5rem]">{post.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                      <Button variant="link" className="p-0 h-auto font-semibold text-primary" asChild>
                        <Link href={`/blog/${post.slug}`}>
                          Read Article →
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </AnimatedContent>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No blog posts available yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
