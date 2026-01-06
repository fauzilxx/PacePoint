'use client'

import { use } from 'react'
import { Navbar } from "@/components/navbar"
import EventDetails from "./EventDetails"

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <EventDetails eventId={parseInt(id, 10)} />
    </div>
  )
}
