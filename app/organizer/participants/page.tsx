'use client'

import { useAuth } from "@/hooks/useAuth"
import { Loader2 } from "lucide-react"

export default function ParticipantsPage() {
    const { isLoading } = useAuth({ requireAuth: true, requiredRole: 'organizer' })

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Participants</h1>
                <p className="text-muted-foreground mt-2">View and manage participants across all your events.</p>
            </div>
            <div className="p-12 border rounded-lg border-dashed flex items-center justify-center text-muted-foreground">
                Participants table will be here.
            </div>
        </div>
    )
}
