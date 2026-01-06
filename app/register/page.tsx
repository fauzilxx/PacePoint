import { Navbar } from "@/components/navbar"
import RegisterForm from "./RegisterForm"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 bg-muted/30">
        <div className="container max-w-7xl mx-auto px-6 md:px-12">
          <RegisterForm />
        </div>
      </main>
    </div>
  )
}
