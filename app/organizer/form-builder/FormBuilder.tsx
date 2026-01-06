"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, Calendar, Plus, FormInput, Users, LogOut, Trash2, Save } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
// Note: Ideally this should also use useAuth for logout and route protection, 
// but extracting as-is from original page.tsx first.

export default function FormBuilder() {
    const [fields, setFields] = useState([
        { id: 1, label: "Full Name", type: "text", required: true },
        { id: 2, label: "Email", type: "email", required: true },
    ])

    const addField = () => {
        const newField = {
            id: Date.now(),
            label: "New Field",
            type: "text",
            required: false,
        }
        setFields([...fields, newField])
    }

    const removeField = (id: number) => {
        setFields(fields.filter((field) => field.id !== id))
    }

    return (
        <div className="flex-1 flex">
            {/* Sidebar - Duplicated from OrganizerDashboardContent, ideally should be a shared layout component */}
            <aside className="w-64 border-r border-border bg-sidebar">
                <div className="p-6">
                    <h2 className="font-semibold text-sidebar-foreground mb-6">Organizer</h2>
                    <nav className="space-y-2">
                        <Link
                            href="/organizer/dashboard"
                            className="flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Link>
                        <Link
                            href="/organizer/events"
                            className="flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                        >
                            <Calendar className="h-4 w-4" />
                            My Events
                        </Link>
                        <Link
                            href="/organizer/create"
                            className="flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Create Event
                        </Link>
                        <Link
                            href="/organizer/form-builder"
                            className="flex items-center gap-3 px-3 py-2 rounded-md bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        >
                            <FormInput className="h-4 w-4" />
                            Form Builder
                        </Link>
                        <Link
                            href="/organizer/participants"
                            className="flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                        >
                            <Users className="h-4 w-4" />
                            Participants
                        </Link>
                        <button className="flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors w-full mt-4">
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 bg-background">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Form Builder</h1>
                            <p className="text-muted-foreground mt-1">Create and customize your registration form</p>
                        </div>
                        <Button>
                            <Save className="h-4 w-4 mr-2" />
                            Save Form
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Form Builder Panel */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Form Fields</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="p-4 border border-border rounded-lg space-y-3">
                                        <div className="flex items-center justify-between">
                                            <Badge variant="secondary">Field {index + 1}</Badge>
                                            <Button variant="ghost" size="sm" onClick={() => removeField(field.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor={`label-${field.id}`}>Field Label</Label>
                                            <Input id={`label-${field.id}`} defaultValue={field.label} placeholder="Enter field label" />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor={`type-${field.id}`}>Field Type</Label>
                                            <Select defaultValue={field.type}>
                                                <SelectTrigger id={`type-${field.id}`}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="text">Text</SelectItem>
                                                    <SelectItem value="email">Email</SelectItem>
                                                    <SelectItem value="tel">Phone</SelectItem>
                                                    <SelectItem value="date">Date</SelectItem>
                                                    <SelectItem value="select">Dropdown</SelectItem>
                                                    <SelectItem value="file">File Upload</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Checkbox id={`required-${field.id}`} defaultChecked={field.required} />
                                            <Label htmlFor={`required-${field.id}`} className="font-normal">
                                                Required field
                                            </Label>
                                        </div>
                                    </div>
                                ))}

                                <Button variant="outline" className="w-full bg-transparent" onClick={addField}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Field
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Form Preview */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Form Preview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form className="space-y-6">
                                    {fields.map((field) => (
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
                                                        <SelectItem value="option2">Option 2</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <Input
                                                    type={field.type}
                                                    placeholder={`Enter ${field.label.toLowerCase()}`}
                                                    required={field.required}
                                                />
                                            )}
                                        </div>
                                    ))}

                                    <Button type="submit" className="w-full" disabled>
                                        Submit (Preview Only)
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}
