import { OrganizerSidebar } from "@/components/organizer-sidebar"
import { Navbar } from "@/components/navbar"

export default function OrganizerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />
            <div className="flex flex-1">
                <OrganizerSidebar />
                <main className="flex-1 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    )
}
