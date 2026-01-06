'use client'

import { useAuth } from "@/hooks/useAuth"
import { Loader2, LayoutDashboard, Pencil, Eye } from "lucide-react"
import useSWR from "swr"
import { organizerEventsFetcher } from "@/lib/api/events"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function MyEventsPage() {
    const { user, isLoading: authLoading } = useAuth({ requireAuth: true, requiredRole: 'organizer' })
    const { data: events, error, isLoading: eventsLoading } = useSWR(
        user ? `organizer-events-${user.id}` : null,
        organizerEventsFetcher(user?.id || '')
    )

    const isLoading = authLoading || eventsLoading

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>

    return (
        <div className="p-8">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Events</h1>
                    <p className="text-muted-foreground mt-2">Manage all your created events here.</p>
                </div>
                <Button onClick={() => window.location.href = '/organizer/create'}>Create New Event</Button>
            </div>

            {events && events.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {events.map((event) => (
                        <Card key={event.id}>
                            <CardHeader>
                                <CardTitle className="line-clamp-1">{event.name}</CardTitle>
                                <CardDescription>{format(new Date(event.date), "PPP")}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{event.description}</p>
                                <div className="flex gap-2">
                                    <Badge variant={event.status === 'active' ? 'default' : 'secondary'}>
                                        {event.status}
                                    </Badge>
                                    <Badge variant="outline">{event.category}</Badge>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-3 gap-2 w-full">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="w-full bg-emerald-100/50 hover:bg-emerald-100 text-emerald-800 border-none"
                                        onClick={() => window.location.href = `/organizer/events/${event.id}/form`}
                                    >
                                        <LayoutDashboard className="h-4 w-4 mr-2" />
                                        Form
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                        onClick={() => window.location.href = `/organizer/events/${event.id}/edit`}
                                    >
                                        <Pencil className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="w-full bg-emerald-800 hover:bg-emerald-900"
                                        onClick={() => window.location.href = `/events/${event.slug || event.id}`}
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        View
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="p-12 border rounded-lg border-dashed flex flex-col items-center justify-center text-muted-foreground gap-4">
                    <p>You haven't created any events yet.</p>
                    <Button onClick={() => window.location.href = '/organizer/create'}>Create Your First Event</Button>
                </div>
            )}
        </div>
    )
}
