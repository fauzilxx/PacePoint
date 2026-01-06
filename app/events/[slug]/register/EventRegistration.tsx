"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Loader2 } from "lucide-react"
import { useState, use, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Navbar } from "@/components/navbar"
import useSWR from "swr"
import { eventBySlugFetcher } from "@/lib/api/events"
import { format } from "date-fns"

interface EventRegistrationProps {
    params: Promise<{ slug: string }>
}

interface FormField {
    id: number
    label: string
    type: string
    required: boolean
}

export default function EventRegistration({ params }: EventRegistrationProps) {
    const router = useRouter()
    const { slug } = use(params)
    const { user, isLoading: isAuthLoading } = useAuth({
        requireAuth: true,
        requiredRole: 'runner',
        redirectTo: '/login',
    })

    const { data: event, error, isLoading: isEventLoading } = useSWR(
        slug ? `event-${slug}` : null,
        slug ? eventBySlugFetcher(slug) : null
    )

    const [formData, setFormData] = useState<Record<string, any>>({})
    const [dynamicFields, setDynamicFields] = useState<FormField[]>([])

    useEffect(() => {
        if (event?.form_schema) {
            const schema = event.form_schema as FormField[]
            if (Array.isArray(schema) && schema.length > 0) {
                setDynamicFields(schema)
            } else {
                // Fallback default fields if no schema
                setDynamicFields([
                    { id: 1, label: "Full Name", type: "text", required: true },
                    { id: 2, label: "Email", type: "email", required: true },
                    { id: 3, label: "Phone Number", type: "tel", required: true },
                ])
            }
        } else if (event) {
            // Fallback default fields if event loaded but no schema
            setDynamicFields([
                { id: 1, label: "Full Name", type: "text", required: true },
                { id: 2, label: "Email", type: "email", required: true },
                { id: 3, label: "Phone Number", type: "tel", required: true },
            ])
        }
    }, [event])

    if (isAuthLoading || isEventLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading event details...</p>
                </div>
            </div>
        )
    }

    if (!user || !event) return <div className="p-8 text-center">Event not found</div>

    const handleInputChange = (label: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [label]: value
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Save registration data using Supabase user ID
        const registrationData = {
            eventId: event.id,
            eventName: event.name,
            userId: user.id,
            registrationDate: new Date().toISOString(),
            formData: formData,
            price: event.price
        }
        // Store temporarily for payment flow
        sessionStorage.setItem('pendingRegistration', JSON.stringify(registrationData))

        // Redirect to payment
        router.push('/payment')
    }

    // Filter distances based on event data
    const distanceOptions = event.distances || []

    return (
        <div className="max-w-3xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">Event Registration</CardTitle>
                    <CardDescription>Register for {event.name} on {format(new Date(event.date), "PPP")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Always show Distance Selection if multiple available */}
                        {distanceOptions.length > 0 && (
                            <div className="space-y-2">
                                <Label className="text-foreground">Distance Category <span className="text-destructive ml-1">*</span></Label>
                                <Select required onValueChange={(val) => handleInputChange("Distance", val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Distance" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {distanceOptions.map((dist) => (
                                            <SelectItem key={dist} value={dist}>{dist}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {dynamicFields.map((field) => (
                            <div key={field.id} className="space-y-2">
                                <Label htmlFor={`field-${field.id}`} className="text-foreground">
                                    {field.label}
                                    {field.required && <span className="text-destructive ml-1">*</span>}
                                </Label>

                                {field.type === "select" ? (
                                    <Select required={field.required} onValueChange={(val) => handleInputChange(field.label, val)}>
                                        <SelectTrigger id={`field-${field.id}`}>
                                            <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="option1">Option 1</SelectItem>
                                            <SelectItem value="option2">Option 2</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : field.type === "date" ? (
                                    <div className="relative">
                                        <Input
                                            id={`field-${field.id}`}
                                            type="date"
                                            required={field.required}
                                            className="pr-10"
                                            onChange={(e) => handleInputChange(field.label, e.target.value)}
                                        />
                                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                    </div>
                                ) : (
                                    <Input
                                        id={`field-${field.id}`}
                                        type={field.type}
                                        placeholder={`Enter ${field.label.toLowerCase()}`}
                                        required={field.required}
                                        onChange={(e) => handleInputChange(field.label, e.target.value)}
                                    />
                                )}
                            </div>
                        ))}

                        <div className="pt-6 space-y-4">
                            <div className="bg-muted p-4 rounded-lg">
                                <p className="text-sm text-muted-foreground">
                                    <span className="font-semibold text-foreground">Registration Fee:</span> Rp {event.price.toLocaleString('id-ID')}
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
