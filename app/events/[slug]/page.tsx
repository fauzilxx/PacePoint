'use client'

import { use } from 'react'
import { Navbar } from "@/components/navbar"
import EventDetails from "./EventDetails"

export default function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <EventDetails slug={slug} />
    </div>
  )
}
