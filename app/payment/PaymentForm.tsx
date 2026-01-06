"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Upload, CreditCard, Smartphone, Wallet, CheckCircle2, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { distributeFundsToOrganizer } from "@/lib/api/wallet"

export default function PaymentForm() {
    const router = useRouter()
    const { user, isLoading: isAuthLoading } = useAuth({
        requireAuth: true,
        redirectTo: '/login',
    })

    const [paymentProof, setPaymentProof] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [paymentSuccess, setPaymentSuccess] = useState(false)
    const [eventData, setEventData] = useState<any>(null)
    const [paymentId, setPaymentId] = useState<string>('')
    const [origin, setOrigin] = useState('')

    useEffect(() => {
        setOrigin(window.location.origin)
    }, [])

    useEffect(() => {
        const storedData = sessionStorage.getItem('pendingRegistration')
        if (storedData) {
            const data = JSON.parse(storedData)
            setEventData(data)
            // Generate unique payment ID
            const pId = `PAY-${data.eventId}-${user?.id}-${Date.now()}`
            setPaymentId(pId)
        } else {
            // Redirect if no registration data found
            router.push('/events')
        }
    }, [router, user])

    // Polling mechanism to check for payment confirmation
    useEffect(() => {
        if (!paymentId || !user?.id) return

        const paymentKey = `payment_${paymentId}_${user.id}`

        const checkPaymentStatus = () => {
            const paymentData = sessionStorage.getItem(paymentKey)
            if (paymentData) {
                const payment = JSON.parse(paymentData)
                if (payment.status === 'confirmed') {
                    // Payment confirmed via QR scan!
                    handleSubmitPayment()
                    // Clear the payment confirmation
                    sessionStorage.removeItem(paymentKey)
                }
            }
        }

        // Check every 2 seconds
        const interval = setInterval(checkPaymentStatus, 2000)

        return () => clearInterval(interval)
    }, [paymentId, user])

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setPaymentProof(file)
        }
    }

    const handleSubmitPayment = async () => {
        if (!eventData) return
        setIsProcessing(true)

        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false)
            setPaymentSuccess(true)

            // Save payment data to sessionStorage
            const paymentData = {
                eventId: eventData.eventId,
                eventName: eventData.eventName,
                amount: eventData.price,
                paymentMethod: 'qris',
                paymentDate: new Date().toISOString(),
                status: 'confirmed',
                transactionId: 'TRX' + Date.now(),
                userId: user?.id
            }

            // SIMULATION: Distribute funds
            distributeFundsToOrganizer(eventData.eventId, Number(eventData.price))
                .then(res => console.log('Funds distributed:', res))
                .catch(err => console.error('Fund distribution failed:', err))

            sessionStorage.setItem('lastPayment', JSON.stringify(paymentData))

            // Redirect to confirmation after 2 seconds
            setTimeout(() => {
                router.push('/payment/success')
            }, 2000)
        }, 2000)
    }



    if (isAuthLoading || !eventData) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading payment details...</p>
                </div>
            </div>
        )
    }

    if (!user) return null

    if (paymentSuccess) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Card className="max-w-md">
                    <CardContent className="pt-6 text-center">
                        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-foreground mb-2">Payment Processing</h2>
                        <p className="text-muted-foreground">Please wait while we confirm your payment...</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-8">Complete Payment</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Payment Method Selection */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>QRIS Payment</CardTitle>
                            <CardDescription>Scan the QR code below to pay</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="bg-muted/50 p-8 rounded-lg flex justify-center">
                                    <div className="bg-white p-6 rounded-lg shadow-sm">
                                        {/* Dynamic QR Code with Callback URL */}
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="bg-white p-2 rounded-lg border-2 border-border">
                                                {origin && (
                                                    <img
                                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                                                            `${origin}/payment/callback?id=${paymentId}&user=${user.id}&amount=${eventData.price}`
                                                        )}`}
                                                        alt="QRIS Code"
                                                        className="w-48 h-48 object-contain"
                                                    />
                                                )}
                                            </div>
                                            <div className="text-center">
                                                <p className="font-mono font-bold text-lg text-primary truncate max-w-[200px]">
                                                    ID: {paymentId.substring(0, 8)}...
                                                </p>
                                                <p className="text-xs text-muted-foreground">Scan QR to auto-confirm payment</p>

                                                <div className="mt-4 pt-4 border-t border-border w-full">
                                                    <p className="text-xs text-muted-foreground mb-2">Trouble scanning? (For Demo)</p>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            const url = `${origin}/payment/callback?id=${paymentId}&user=${user.id}&amount=${eventData.price}`
                                                            window.open(url, '_blank')
                                                        }}
                                                        className="w-full text-xs"
                                                        disabled={!origin}
                                                    >
                                                        <CreditCard className="h-3 w-3 mr-2" />
                                                        Open Payment Link directly
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                                    <h3 className="font-semibold text-foreground mb-2">Payment Instructions:</h3>
                                    <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                                        <li>Open your e-wallet or mobile banking app</li>
                                        <li>Select "Scan QR" or "QRIS" option</li>
                                        <li>Scan the QR code displayed above</li>
                                        <li>Confirm the payment amount (Rp {eventData.price.toLocaleString('id-ID')})</li>
                                        <li>Complete the payment</li>
                                        <li>Upload your payment proof below</li>
                                    </ol>
                                </div>

                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                                        <Smartphone className="h-4 w-4" />
                                        Auto-Confirmation Enabled
                                    </h3>
                                    <p className="text-sm text-green-700">
                                        When you scan this QR code, the payment will be automatically confirmed. No need to upload proof!
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="payment-proof" className="text-foreground">
                                        Upload Payment Proof <span className="text-muted-foreground text-xs">(Optional - Auto-confirmed via QR scan)</span>
                                    </Label>
                                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                        {paymentProof ? (
                                            <p className="text-sm text-foreground font-medium">{paymentProof.name}</p>
                                        ) : (
                                            <p className="text-sm text-muted-foreground mb-1">Click to upload or drag and drop</p>
                                        )}
                                        <p className="text-xs text-muted-foreground">PNG, JPG or PDF (max. 5MB)</p>
                                        <Input
                                            id="payment-proof"
                                            type="file"
                                            accept="image/*,.pdf"
                                            className="hidden"
                                            onChange={handleFileUpload}
                                        />
                                    </div>
                                </div>

                                <div className="text-center py-4">
                                    <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Waiting for QR scan...</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Order Summary */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="font-semibold text-foreground mb-1">{eventData.eventName}</p>
                                {eventData.formData?.['Distance'] && (
                                    <p className="text-sm text-muted-foreground">{eventData.formData['Distance']}</p>
                                )}
                            </div>

                            <div className="border-t border-border pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Registration Fee</span>
                                    <span className="text-foreground">Rp {eventData.price.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Service Fee</span>
                                    <span className="text-foreground">Rp 0</span>
                                </div>
                            </div>

                            <div className="border-t border-border pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-foreground">Total Amount</span>
                                    <span className="text-2xl font-bold text-primary">Rp {eventData.price.toLocaleString('id-ID')}</span>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Badge variant="secondary" className="w-full justify-center py-2">
                                    Waiting for Payment
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
