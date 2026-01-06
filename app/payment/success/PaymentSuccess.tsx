"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Download, Calendar, MapPin, User, Hash, CreditCard, Share2, Loader2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

export default function PaymentSuccess() {
    const router = useRouter()
    const { user, isLoading } = useAuth({
        requireAuth: true,
        redirectTo: '/login',
    })
    const [paymentData, setPaymentData] = useState<any>(null)

    useEffect(() => {
        const payment = sessionStorage.getItem('lastPayment')

        if (!payment) {
            router.push('/')
            return
        }

        setPaymentData(JSON.parse(payment))
    }, [router])

    const handleDownloadTicket = () => {
        // Simulate ticket download
        alert('E-Ticket downloaded! Check your downloads folder.')
    }

    const handleShareTicket = () => {
        // Simulate sharing
        alert('Share link copied to clipboard!')
    }

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

    if (!paymentData || !user) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Success Message */}
            <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
                <CardContent className="pt-6 text-center">
                    <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-foreground mb-2">Payment Successful!</h1>
                    <p className="text-muted-foreground mb-4">
                        Your registration has been confirmed. We've sent a confirmation email to {user.email}
                    </p>
                    <Badge variant="default" className="bg-green-500">
                        Registration Confirmed
                    </Badge>
                </CardContent>
            </Card>

            {/* E-Ticket */}
            <Card>
                <CardContent className="p-0">
                    {/* Ticket Header */}
                    <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 rounded-t-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <Calendar className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm opacity-90">E-Ticket</p>
                                    <p className="font-semibold">PacePoint Events</p>
                                </div>
                            </div>
                            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                                {paymentData.transactionId}
                            </Badge>
                        </div>
                        <h2 className="text-2xl font-bold">{paymentData.eventName}</h2>
                    </div>

                    {/* Ticket Body */}
                    <div className="p-6 space-y-6">
                        {/* Participant Info */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <User className="h-4 w-4" />
                                    <span>Participant</span>
                                </div>
                                <p className="font-semibold text-foreground">{user.full_name}</p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <Hash className="h-4 w-4" />
                                    <span>Bib Number</span>
                                </div>
                                <p className="font-semibold text-foreground">A{Math.floor(1000 + Math.random() * 9000)}</p>
                            </div>
                        </div>

                        {/* Event Details */}
                        <div className="border-t border-border pt-6 space-y-4">
                            <div className="flex items-start gap-3">
                                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <p className="font-semibold text-foreground">Date & Time</p>
                                    <p className="text-sm text-muted-foreground">March 15, 2025 • 7:00 AM Start</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <p className="font-semibold text-foreground">Location</p>
                                    <p className="text-sm text-muted-foreground">Blue Ridge Mountains, Mountain View Park</p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="border-t border-border pt-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <CreditCard className="h-4 w-4" />
                                    <span>Payment Details</span>
                                </div>
                                <Badge variant="default">Paid</Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Amount Paid</span>
                                <span className="font-semibold text-foreground">${paymentData.amount}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                                <span className="text-muted-foreground">Payment Method</span>
                                <span className="text-foreground capitalize">{paymentData.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                                <span className="text-muted-foreground">Transaction Date</span>
                                <span className="text-foreground">{new Date(paymentData.paymentDate).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* QR Code */}
                        <div className="border-t border-border pt-6">
                            <div className="bg-muted/50 p-6 rounded-lg">
                                <p className="text-sm text-center text-muted-foreground mb-4">Scan this QR code at event check-in</p>
                                <div className="bg-white p-4 rounded-lg inline-block mx-auto block w-full max-w-[200px]">
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${paymentData.transactionId}`}
                                        alt="Event QR Code"
                                        className="w-full h-auto"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3 pt-4">
                            <Button variant="outline" onClick={handleDownloadTicket}>
                                <Download className="h-4 w-4 mr-2" />
                                Download E-Ticket
                            </Button>
                            <Button variant="outline" onClick={handleShareTicket}>
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                            </Button>
                        </div>
                    </div>

                    {/* Ticket Footer */}
                    <div className="bg-muted/30 p-4 rounded-b-lg text-center">
                        <p className="text-xs text-muted-foreground">
                            Please present this e-ticket at registration desk on event day
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
                <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-3">What's Next?</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Check your email for confirmation and additional event details</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Download your e-ticket or save it to your mobile wallet</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Arrive at least 30 minutes before the event starts</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Bring a valid ID and your e-ticket for check-in</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
                <Button variant="outline" asChild>
                    <Link href="/runner/dashboard">Go to Dashboard</Link>
                </Button>
                <Button asChild>
                    <Link href="/events">Browse More Events</Link>
                </Button>
            </div>
        </div>
    )
}
