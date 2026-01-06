import { Navbar } from "@/components/navbar"
import LoginForm from "./LoginForm"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 bg-muted/30">
        <div className="container max-w-7xl mx-auto px-6 md:px-12">
          <LoginForm />
        </div>
      </main>
    </div>
  )
}
