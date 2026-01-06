"use client"

import { Navbar } from "@/components/navbar"
import FormBuilder from "./FormBuilder"

export default function FormBuilderPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <FormBuilder />
    </div>
  )
}
