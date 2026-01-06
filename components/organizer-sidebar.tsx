'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Calendar, Plus, FormInput, Users, LogOut, Wallet } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

export function OrganizerSidebar() {
    const pathname = usePathname()
    const { user, signOut } = useAuth()

    const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/')

    return (
        <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col h-screen sticky top-0">
            <div className="p-6 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-8">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <LayoutDashboard className="h-6 w-6 text-primary" />
                    </div>
                    <span className="font-bold text-lg">Organizer</span>
                </div>

                <nav className="space-y-2 flex-1">
                    <Link
                        href="/organizer/dashboard"
                        className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-all ${isActive('/organizer/dashboard')
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                    </Link>
                    <Link
                        href="/organizer/events"
                        className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-all ${isActive('/organizer/events') && !isActive('/organizer/events/create') // Exception for create if needed
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                    >
                        <Calendar className="h-4 w-4" />
                        My Events
                    </Link>
                    <Link
                        href="/organizer/create"
                        className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-all ${isActive('/organizer/create')
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                    >
                        <Plus className="h-4 w-4" />
                        Create Event
                    </Link>

                    <Link
                        href="/organizer/participants"
                        className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-all ${isActive('/organizer/participants')
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                    >
                        Participants
                    </Link>

                    <Link
                        href="/organizer/wallet"
                        className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-all ${isActive('/organizer/wallet')
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                    >
                        <Wallet className="h-4 w-4" />
                        My Funds
                    </Link>
                </nav>

                {user && (
                    <div className="pt-6 border-t border-border">
                        <div className="flex items-center gap-3 px-3 mb-4">
                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                {user.full_name?.charAt(0) || 'O'}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium truncate">{user.full_name}</p>
                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={signOut}
                            className="flex items-center gap-3 px-3 py-2 rounded-md text-destructive hover:bg-destructive/10 transition-colors w-full text-sm font-medium"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </aside>
    )
}
