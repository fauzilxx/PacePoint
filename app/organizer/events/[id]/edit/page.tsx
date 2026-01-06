'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { CalendarIcon, Loader2, Plus, Trash2, ArrowLeft, ImageIcon, X, UploadCloud } from "lucide-react"
import { useState, use, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"
import { updateEvent, eventByIdFetcher } from "@/lib/api/events"
import { uploadEventImage } from "@/lib/api/storage"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import useSWR from "swr"
import Image from "next/image"

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
    const { user, isLoading: isAuthLoading } = useAuth({ requireAuth: true, requiredRole: 'organizer' })
    const router = useRouter()
    const { id } = use(params)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Data Fetching
    const { data: event, error, isLoading: isEventLoading } = useSWR(
        id ? parseInt(id) : null,
        eventByIdFetcher(parseInt(id))
    )

    // State
    const [date, setDate] = useState<Date>()
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const [newDistance, setNewDistance] = useState('')

    // Image State
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    const [eventDetails, setEventDetails] = useState({
        name: '',
        description: '',
        location: '',
        price: '',
        quota: '',
        category: 'road',
        distances: [] as string[],
        image: '' as string | null
    })

    // Populate state when event data is loaded
    useEffect(() => {
        if (event) {
            setDate(new Date(event.date))
            setEventDetails({
                name: event.name,
                description: event.description || '',
                location: event.location,
                price: event.price.toString(),
                quota: event.max_participants.toString(),
                category: event.category || 'road',
                distances: event.distances || [],
                image: event.image
            })
            if (event.image) {
                setImagePreview(event.image)
            }
        }
    }, [event])

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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Basic validation
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error("Image size should be less than 5MB")
                return
            }

            setImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const removeImage = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setImageFile(null)
        setImagePreview(null)
        setEventDetails(prev => ({ ...prev, image: null }))
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const triggerFileInput = () => {
        fileInputRef.current?.click()
    }

    const handleUpdate = async () => {
        if (!user || !event) return

        try {
            setIsSubmitting(true)

            let imageUrl = eventDetails.image

            // Upload image if a new file is selected
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop()
                const fileName = `event-${event.id}-${Date.now()}.${fileExt}`
                imageUrl = await uploadEventImage(imageFile, fileName)
            }

            await updateEvent(event.id, {
                name: eventDetails.name,
                description: eventDetails.description,
                date: date!.toISOString(),
                location: eventDetails.location,
                price: parseFloat(eventDetails.price),
                max_participants: parseInt(eventDetails.quota),
                category: eventDetails.category as 'road' | 'trail',
                distances: eventDetails.distances,
                image: imageUrl,
                updated_at: new Date().toISOString(),
            })

            toast.success("Event updated successfully!")
            router.push('/organizer/events')
        } catch (error) {
            console.error('Failed to update event:', error)
            toast.error("Failed to update event. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isAuthLoading || isEventLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>
    if (error) return <div className="p-8 text-center text-red-500">Failed to load event</div>

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
            </Button>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Event</h1>
                    <p className="text-muted-foreground mt-2">
                        Update details for {event?.name}
                    </p>
                </div>
            </div>

            <Card className="animate-in fade-in slide-in-from-right-4 duration-300">
                <CardHeader>
                    <CardTitle>Event Details</CardTitle>
                    <CardDescription>Update your event information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Image Upload Section */}
                    <div className="space-y-2">
                        <Label>Event Pamphlet / Poster</Label>
                        <div
                            onClick={triggerFileInput}
                            className={cn(
                                "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-muted/50 max-w-md mx-auto aspect-video relative overflow-hidden group",
                                imagePreview ? "border-primary" : "border-muted-foreground/25"
                            )}
                        >
                            <Input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />

                            {imagePreview ? (
                                <>
                                    <Image
                                        src={imagePreview}
                                        alt="Event Preview"
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <p className="text-white font-medium flex items-center gap-2">
                                            <UploadCloud className="w-4 h-4" /> Change Image
                                        </p>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={removeImage}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </>
                            ) : (
                                <div className="text-center space-y-2">
                                    <div className="bg-muted rounded-full p-4 inline-flex">
                                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Click to upload image</p>
                                        <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

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

                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select
                            value={eventDetails.category}
                            onValueChange={(value) => setEventDetails({ ...eventDetails, category: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="road">Road Run</SelectItem>
                                <SelectItem value="trail">Trail Run</SelectItem>
                            </SelectContent>
                        </Select>
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
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button onClick={handleUpdate} disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...
                            </>
                        ) : "Save Changes"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
