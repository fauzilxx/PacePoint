'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { CalendarIcon, Loader2, ChevronRight, ChevronLeft, Plus, Trash2, LayoutDashboard } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"
import { createEvent } from "@/lib/api/events"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface FormField {
    id: number
    label: string
    type: string
    required: boolean
}

export default function CreateEventPage() {
    const { user, isLoading } = useAuth({ requireAuth: true, requiredRole: 'organizer' })
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Step 1: Event Details State
    const [date, setDate] = useState<Date>()
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const [newDistance, setNewDistance] = useState('')
    const [eventDetails, setEventDetails] = useState({
        name: '',
        description: '',
        location: '',
        price: '',
        quota: '',
        distances: [] as string[]
    })

    // Step 2: Form Builder State
    const [formFields, setFormFields] = useState<FormField[]>([
        { id: 1, label: "Full Name", type: "text", required: true },
        { id: 2, label: "Email", type: "email", required: true },
        { id: 3, label: "Phone Number", type: "tel", required: true },
    ])

    const addDistance = () => {
        if (!newDistance.trim()) return
        if (eventDetails.distances.includes(newDistance.trim())) {
            setNewDistance('')
            return
        }
        setEventDetails(prev => ({
            ...prev,
            distances: [...prev.distances, newDistance.trim()]
        }))
        setNewDistance('')
    }

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>

    const handleNext = () => {
        if (step === 1) {
            if (!eventDetails.name || !date || !eventDetails.location || !eventDetails.price || !eventDetails.quota) {
                toast.error("Please fill in all required fields")
                return
            }
            if (eventDetails.distances.length === 0) {
                toast.error("Please add at least one distance option")
                return
            }
        }
        setStep(2)
    }

    const handleBack = () => {
        setStep(1)
    }

    const handlePublish = async () => {
        if (!user) return

        try {
            setIsSubmitting(true)
            // Generate slug from name
            const slug = eventDetails.name
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '') +
                '-' + Math.floor(Math.random() * 1000) // Append random number to ensure uniqueness

            await createEvent({
                name: eventDetails.name,
                description: eventDetails.description,
                date: date!.toISOString(),
                location: eventDetails.location,
                price: parseFloat(eventDetails.price),
                max_participants: parseInt(eventDetails.quota),
                current_participants: 0,
                category: 'road',
                status: 'active',
                distances: eventDetails.distances,
                image: null,
                updated_at: new Date().toISOString(),
                slug: slug,
                // @ts-ignore - form_schema is optional in types depending on version, forcing it here
                form_schema: formFields
            })

            toast.success("Event created successfully!")
            router.push('/organizer/events')
        } catch (error) {
            console.error('Failed to create event:', error)
            toast.error("Failed to create event. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const addField = () => {
        const newField = {
            id: Date.now(),
            label: "New Field",
            type: "text",
            required: false,
        }
        setFormFields([...formFields, newField])
    }

    const removeField = (id: number) => {
        setFormFields(formFields.filter((field) => field.id !== id))
    }

    const updateField = (id: number, key: keyof FormField, value: any) => {
        setFormFields(formFields.map(f => f.id === id ? { ...f, [key]: value } : f))
    }

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create New Event</h1>
                    <p className="text-muted-foreground mt-2">
                        {step === 1 ? "Step 1: Basic Information" : "Step 2: Registration Form Requirements"}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", step >= 1 ? "bg-primary" : "bg-muted")} />
                    <div className={cn("w-10 h-1", step >= 2 ? "bg-primary" : "bg-muted")} />
                    <div className={cn("w-3 h-3 rounded-full", step >= 2 ? "bg-primary" : "bg-muted")} />
                </div>
            </div>

            {step === 1 && (
                <Card className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <CardHeader>
                        <CardTitle>Event Details</CardTitle>
                        <CardDescription>Tell us about your running event.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Event Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g. Jakarta Marathon 2024"
                                value={eventDetails.name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEventDetails({ ...eventDetails, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe your event..."
                                className="min-h-[100px]"
                                value={eventDetails.description}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEventDetails({ ...eventDetails, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Date</Label>
                                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={(newDate: Date | undefined) => {
                                                if (newDate) {
                                                    setDate(newDate)
                                                    setIsCalendarOpen(false)
                                                }
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    placeholder="e.g. GBK Senayan"
                                    value={eventDetails.location}
                                    onChange={(e) => setEventDetails({ ...eventDetails, location: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label>Distance Options</Label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {eventDetails.distances.map((dist) => (
                                    <Badge key={dist} variant="secondary" className="px-3 py-1 text-sm bg-orange-100 hover:bg-orange-200 text-orange-800 border-none flex items-center gap-2">
                                        {dist}
                                        <button
                                            onClick={() => setEventDetails(prev => ({ ...prev, distances: prev.distances.filter(d => d !== dist) }))}
                                            className="hover:bg-orange-200 rounded-full p-0.5"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add distance (e.g. 5K, 10K, Half Marathon)"
                                    value={newDistance}
                                    onChange={(e) => setNewDistance(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            addDistance()
                                        }
                                    }}
                                />
                                <Button type="button" onClick={addDistance} variant="outline">
                                    <Plus className="h-4 w-4 mr-2" /> Add
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Registration Fee (Rp)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    placeholder="0"
                                    value={eventDetails.price}
                                    onChange={(e) => setEventDetails({ ...eventDetails, price: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="quota">Max Participants</Label>
                                <Input
                                    id="quota"
                                    type="number"
                                    placeholder="Unlimited"
                                    value={eventDetails.quota}
                                    onChange={(e) => setEventDetails({ ...eventDetails, quota: e.target.value })}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button onClick={handleNext}>
                            Next Step <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                    </CardFooter>
                </Card>
            )
            }

            {
                step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Form Builder Panel */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Customize Registration Form</CardTitle>
                                    <CardDescription>Define what data you need from participants.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 max-h-[600px] overflow-y-auto pr-4">
                                    {formFields.map((field, index) => (
                                        <div key={field.id} className="p-4 border border-border rounded-lg space-y-3 bg-muted/20">
                                            <div className="flex items-center justify-between">
                                                <Badge variant="outline">Field {index + 1}</Badge>
                                                <Button variant="ghost" size="sm" onClick={() => removeField(field.id)} disabled={field.required && field.label === 'Full Name'}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Field Label</Label>
                                                <Input
                                                    value={field.label}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField(field.id, 'label', e.target.value)}
                                                    disabled={field.label === 'Full Name' || field.label === 'Email'} // Lock basic fields
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Field Type</Label>
                                                <Select value={field.type} onValueChange={(val) => updateField(field.id, 'type', val)}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="text">Text</SelectItem>
                                                        <SelectItem value="email">Email</SelectItem>
                                                        <SelectItem value="tel">Phone</SelectItem>
                                                        <SelectItem value="date">Date</SelectItem>
                                                        <SelectItem value="number">Number</SelectItem>
                                                        <SelectItem value="select">Dropdown</SelectItem>
                                                        <SelectItem value="file">File Upload</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    id={`required-${field.id}`}
                                                    checked={field.required}
                                                    onCheckedChange={(checked) => updateField(field.id, 'required', checked)}
                                                    disabled={field.label === 'Full Name' || field.label === 'Email'}
                                                />
                                                <Label htmlFor={`required-${field.id}`} className="font-normal">
                                                    Required field
                                                </Label>
                                            </div>
                                        </div>
                                    ))}

                                    <Button variant="outline" className="w-full border-dashed" onClick={addField}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Custom Field
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Form Preview */}
                            <Card className="h-fit sticky top-8">
                                <CardHeader>
                                    <CardTitle>Live Preview</CardTitle>
                                    <CardDescription>This is how your form will look to participants.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form className="space-y-6 pointer-events-none opacity-90">
                                        {formFields.map((field) => (
                                            <div key={field.id} className="space-y-2">
                                                <Label>
                                                    {field.label}
                                                    {field.required && <span className="text-destructive ml-1">*</span>}
                                                </Label>
                                                {field.type === "select" ? (
                                                    <Select>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="option1">Option 1</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <Input
                                                        type={field.type}
                                                        placeholder={`Enter ${field.label.toLowerCase()}`}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                        <Button className="w-full">
                                            Register (Preview)
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="flex justify-between pt-6 border-t">
                            <Button variant="outline" onClick={handleBack} disabled={isSubmitting}>
                                <ChevronLeft className="h-4 w-4 mr-2" /> Back
                            </Button>
                            <Button size="lg" className="bg-green-600 hover:bg-green-700" onClick={handlePublish} disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" /> Publishing...
                                    </>
                                ) : "Publish Event"}
                            </Button>
                        </div>
                    </div>
                )
            }
        </div >
    )
}
