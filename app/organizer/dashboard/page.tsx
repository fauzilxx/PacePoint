import { Navbar } from "@/components/navbar"
import OrganizerDashboardContent from "./OrganizerDashboardContent"

export default function OrganizerDashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <OrganizerDashboardContent />
    </div>
  )
}
