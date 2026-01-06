'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Trash2, ArrowLeft, Save } from "lucide-react"
import { useState, use, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { updateEvent, eventByIdFetcher } from "@/lib/api/events"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import useSWR from "swr"

interface FormField {
    id: number
    label: string
    type: string
    required: boolean
}

export default function EditFormPage({ params }: { params: Promise<{ id: string }> }) {
    const { user, isLoading: isAuthLoading } = useAuth({ requireAuth: true, requiredRole: 'organizer' })
    const router = useRouter()
    const { id } = use(params)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Data Fetching
    const { data: event, error, isLoading: isEventLoading } = useSWR(
        id ? parseInt(id) : null,
        eventByIdFetcher(parseInt(id))
    )

    // State
    const [formFields, setFormFields] = useState<FormField[]>([
        { id: 1, label: "Full Name", type: "text", required: true },
        { id: 2, label: "Email", type: "email", required: true },
        { id: 3, label: "Phone Number", type: "tel", required: true },
    ])

    // Populate state when event data is loaded
    useEffect(() => {
        if (event && event.form_schema) {
            // Ensure form_schema is treated as FormField[]
            // In a real app we might want better validation here
            const schema = event.form_schema as FormField[]
            if (Array.isArray(schema) && schema.length > 0) {
                setFormFields(schema)
            }
        }
    }, [event])

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

    const handleUpdate = async () => {
        if (!user || !event) return

        try {
            setIsSubmitting(true)
            await updateEvent(event.id, {
                form_schema: formFields,
                updated_at: new Date().toISOString(),
            })

            toast.success("Form updated successfully!")
            router.push('/organizer/events')
        } catch (error) {
            console.error('Failed to update form:', error)
            toast.error("Failed to update form. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isAuthLoading || isEventLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>
    if (error) return <div className="p-8 text-center text-red-500">Failed to load event</div>

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
            </Button>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Registration Form</h1>
                    <p className="text-muted-foreground mt-2">
                        Customize what data you collect for {event?.name}
                    </p>
                </div>
                <Button onClick={handleUpdate} disabled={isSubmitting} size="lg" className="bg-green-600 hover:bg-green-700">
                    {isSubmitting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form Builder Panel */}
                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle>Form Fields</CardTitle>
                        <CardDescription>Manage the fields in your registration form.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 max-h-[700px] overflow-y-auto pr-4">
                        {formFields.map((field, index) => (
                            <div key={field.id} className="p-4 border border-border rounded-lg space-y-3 bg-muted/20 hover:border-primary/50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <Badge variant="outline" className="bg-background">Field {index + 1}</Badge>
                                    <Button variant="ghost" size="sm" onClick={() => removeField(field.id)} disabled={field.required && (field.label === 'Full Name' || field.label === 'Email')}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>

                                <div className="space-y-2">
                                    <Label>Field Label</Label>
                                    <Input
                                        value={field.label}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField(field.id, 'label', e.target.value)}
                                        disabled={field.label === 'Full Name' || field.label === 'Email'}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
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
                                    <div className="flex items-end pb-2">
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id={`required-${field.id}`}
                                                checked={field.required}
                                                onCheckedChange={(checked) => updateField(field.id, 'required', checked)}
                                                disabled={field.label === 'Full Name' || field.label === 'Email'}
                                            />
                                            <Label htmlFor={`required-${field.id}`} className="font-normal cursor-pointer">
                                                Required
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Button variant="outline" className="w-full border-dashed py-6" onClick={addField}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Custom Field
                        </Button>
                    </CardContent>
                </Card>

                {/* Form Preview */}
                <Card className="h-fit sticky top-8 border-2 border-primary/10">
                    <CardHeader className="bg-muted/30">
                        <CardTitle>Live Preview</CardTitle>
                        <CardDescription>This is exactly how it will look to participants.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form className="space-y-6 pointer-events-none">
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
                                Register Now
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
