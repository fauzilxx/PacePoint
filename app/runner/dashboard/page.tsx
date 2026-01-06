import { Navbar } from "@/components/navbar"
import RunnerDashboardContent from "./RunnerDashboardContent"

export default function RunnerDashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <RunnerDashboardContent />
    </div>
  )
}
