"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Loader2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Navbar } from "@/components/navbar" // Still need imports for loading state rendering if we include it here.
// Wait, the page.tsx handles layout including Navbar. 
// If useAuth loading, we typically show full screen loading which typically includes Navbar or at least centered spinner.
// The extracted component should just be the registration form part? 
// Or should it include the `useAuth` check and return null/loading?
// The user asked for "page.tsx = route entry (import Navbar + Component)".
// So Component should handle the main content.

export default function EventRegistration() {
    const router = useRouter()
    const { user, isLoading } = useAuth({
        requireAuth: true,
        requiredRole: 'runner',
        redirectTo: '/login',
    })

    const [formFields] = useState([
        { id: 1, label: "Full Name", type: "text", required: true },
        { id: 2, label: "Email Address", type: "email", required: true },
        { id: 3, label: "Phone Number", type: "tel", required: true },
        {
            id: 4,
            label: "Distance Category",
            type: "select",
            required: true,
            options: ["5K Trail", "10K Trail", "15K Trail Challenge"],
        },
        { id: 5, label: "Date of Birth", type: "date", required: true },
        { id: 6, label: "T-Shirt Size", type: "select", required: true, options: ["XS", "S", "M", "L", "XL", "XXL"] },
        { id: 7, label: "Emergency Contact Name", type: "text", required: true },
        { id: 8, label: "Emergency Contact Phone", type: "tel", required: true },
        { id: 9, label: "Medical Conditions (Optional)", type: "text", required: false },
    ])

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        )
    }

    if (!user) return null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Save registration data using Supabase user ID
        const registrationData = {
            eventId: 1,
            eventName: "Mountain Ridge Trail Run",
            userId: user.id,
            registrationDate: new Date().toISOString()
        }
        // Store temporarily for payment flow
        sessionStorage.setItem('pendingRegistration', JSON.stringify(registrationData))

        // Redirect to payment
        router.push('/payment')
    }

    return (
        <div className="max-w-3xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">Event Registration</CardTitle>
                    <CardDescription>Complete the form below to register for Mountain Ridge Trail Run</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {formFields.map((field) => (
                            <div key={field.id} className="space-y-2">
                                <Label htmlFor={`field-${field.id}`} className="text-foreground">
                                    {field.label}
                                    {field.required && <span className="text-destructive ml-1">*</span>}
                                </Label>

                                {field.type === "select" ? (
                                    <Select>
                                        <SelectTrigger id={`field-${field.id}`}>
                                            <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {field.options?.map((option) => (
                                                <SelectItem key={option} value={option.toLowerCase().replace(/\s+/g, "-")}>
                                                    {option}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : field.type === "date" ? (
                                    <div className="relative">
                                        <Input id={`field-${field.id}`} type="date" required={field.required} className="pr-10" />
                                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                    </div>
                                ) : (
                                    <Input
                                        id={`field-${field.id}`}
                                        type={field.type}
                                        placeholder={`Enter ${field.label.toLowerCase()}`}
                                        required={field.required}
                                    />
                                )}
                            </div>
                        ))}

                        <div className="pt-6 space-y-4">
                            <div className="bg-muted p-4 rounded-lg">
                                <p className="text-sm text-muted-foreground">
                                    <span className="font-semibold text-foreground">Registration Fee:</span> $55
                                </p>
                            </div>

                            <Button type="submit" size="lg" className="w-full">
                                Proceed to Payment
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
