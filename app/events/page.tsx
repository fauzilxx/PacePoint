import { Navbar } from "@/components/navbar"
import EventsList from "./EventsList"

export default function EventsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <EventsList />
    </div>
  )
}
