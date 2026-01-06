"use client"

import { Navbar } from "@/components/navbar"
import PaymentForm from "./PaymentForm"

export default function PaymentPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 bg-muted/30">
        <div className="container max-w-7xl mx-auto px-6 md:px-12">
          <PaymentForm />
        </div>
      </main>
    </div>
  )
}
