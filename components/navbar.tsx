'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { usePathname } from "next/navigation"

export function Navbar() {
  const pathname = usePathname()
  const isAuthPage = pathname === '/login' || pathname === '/register'
  
  // Only load auth state if not on auth pages
  const { user, isLoading, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-6 md:px-12">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Image src="/logo.avif" alt="PacePoint Logo" width={32} height={32} className="h-8 w-8" />
          <span className="text-xl font-bold text-foreground">
            PacePoint
          </span>
        </Link>
        <div className="flex items-center gap-3">
          {isAuthPage ? (
            // Don't show auth buttons on login/register pages
            null
          ) : isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : user ? (
            <>
              <span className="text-sm text-muted-foreground hidden md:block">
                Welcome, {user.full_name || user.email?.split('@')[0] || 'User'}
              </span>
              <Button variant="ghost" asChild>
                <Link href={user.role === 'organizer' ? '/organizer/dashboard' : '/runner/dashboard'}>
                  Dashboard
                </Link>
              </Button>
              <Button variant="outline" onClick={signOut}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
