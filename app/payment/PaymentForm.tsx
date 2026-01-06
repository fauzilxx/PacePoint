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

export default function PaymentForm() {
    const router = useRouter()
    const { user, isLoading: isAuthLoading } = useAuth({
        requireAuth: true,
        redirectTo: '/login',
    })

    const [paymentMethod, setPaymentMethod] = useState<'qris' | 'card' | 'transfer'>('qris')
    const [paymentProof, setPaymentProof] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [paymentSuccess, setPaymentSuccess] = useState(false)
    const [eventData, setEventData] = useState<any>(null)

    useEffect(() => {
        const storedData = sessionStorage.getItem('pendingRegistration')
        if (storedData) {
            setEventData(JSON.parse(storedData))
        } else {
            // Redirect if no registration data found
            router.push('/events')
        }
    }, [router])

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
                paymentMethod: paymentMethod,
                paymentDate: new Date().toISOString(),
                status: 'confirmed',
                transactionId: 'TRX' + Date.now(),
                userId: user?.id
            }

            sessionStorage.setItem('lastPayment', JSON.stringify(paymentData))

            // Redirect to confirmation after 2 seconds
            setTimeout(() => {
                router.push('/payment/success')
            }, 2000)
        }, 2000)
    }

    const handleCardPayment = () => {
        if (!eventData) return
        // Simulate Stripe/payment gateway integration
        setIsProcessing(true)
        setTimeout(() => {
            setIsProcessing(false)
            setPaymentSuccess(true)

            const paymentData = {
                eventId: eventData.eventId,
                eventName: eventData.eventName,
                amount: eventData.price,
                paymentMethod: 'card',
                paymentDate: new Date().toISOString(),
                status: 'confirmed',
                transactionId: 'TRX' + Date.now(),
                userId: user?.id
            }

            sessionStorage.setItem('lastPayment', JSON.stringify(paymentData))

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
                    {/* Payment Method Tabs */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Select Payment Method</CardTitle>
                            <CardDescription>Choose your preferred payment option</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                <button
                                    onClick={() => setPaymentMethod('qris')}
                                    className={`p-4 rounded-lg border-2 transition-all ${paymentMethod === 'qris'
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'
                                        }`}
                                >
                                    <Smartphone className="h-6 w-6 mx-auto mb-2" />
                                    <p className="text-sm font-medium">QRIS</p>
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('card')}
                                    className={`p-4 rounded-lg border-2 transition-all ${paymentMethod === 'card'
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'
                                        }`}
                                >
                                    <CreditCard className="h-6 w-6 mx-auto mb-2" />
                                    <p className="text-sm font-medium">Card</p>
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('transfer')}
                                    className={`p-4 rounded-lg border-2 transition-all ${paymentMethod === 'transfer'
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'
                                        }`}
                                >
                                    <Wallet className="h-6 w-6 mx-auto mb-2" />
                                    <p className="text-sm font-medium">Transfer</p>
                                </button>
                            </div>

                            {/* QRIS Payment */}
                            {paymentMethod === 'qris' && (
                                <div className="space-y-4">
                                    <div className="bg-muted/50 p-8 rounded-lg flex justify-center">
                                        <div className="bg-white p-6 rounded-lg shadow-sm">
                                            {/* In a real app, this would be a dynamic QR code */}
                                            <div className="w-64 h-64 bg-white flex items-center justify-center border-2 border-dashed">
                                                <p className="text-center text-sm text-muted-foreground">QRIS Code Placeholder</p>
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

                                    <div className="space-y-2">
                                        <Label htmlFor="payment-proof" className="text-foreground">
                                            Upload Payment Proof <span className="text-destructive">*</span>
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

                                    <Button
                                        size="lg"
                                        className="w-full"
                                        onClick={handleSubmitPayment}
                                        disabled={!paymentProof || isProcessing}
                                    >
                                        {isProcessing ? 'Processing...' : 'Submit Payment Proof'}
                                    </Button>
                                </div>
                            )}

                            {/* Card Payment */}
                            {paymentMethod === 'card' && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Card Number</Label>
                                        <Input placeholder="1234 5678 9012 3456" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Expiry Date</Label>
                                            <Input placeholder="MM/YY" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>CVV</Label>
                                            <Input placeholder="123" type="password" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Cardholder Name</Label>
                                        <Input placeholder="John Doe" />
                                    </div>
                                    <Button
                                        size="lg"
                                        className="w-full"
                                        onClick={handleCardPayment}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? 'Processing...' : `Pay Rp {eventData.price.toLocaleString('id-ID')}`}
                                    </Button>
                                    <p className="text-xs text-muted-foreground text-center">
                                        Secured by Stripe • Your payment information is encrypted
                                    </p>
                                </div>
                            )}

                            {/* Bank Transfer */}
                            {paymentMethod === 'transfer' && (
                                <div className="space-y-4">
                                    <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Bank Name</p>
                                            <p className="font-semibold">Bank Central Asia (BCA)</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Account Number</p>
                                            <p className="font-semibold">1234567890</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Account Name</p>
                                            <p className="font-semibold">PacePoint Events</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Amount</p>
                                            <p className="font-semibold text-primary">Rp {eventData.price.toLocaleString('id-ID')}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="transfer-proof">Upload Transfer Receipt</Label>
                                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                                            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                            {paymentProof ? (
                                                <p className="text-sm text-foreground font-medium">{paymentProof.name}</p>
                                            ) : (
                                                <p className="text-sm text-muted-foreground mb-1">Upload your transfer receipt</p>
                                            )}
                                            <p className="text-xs text-muted-foreground">PNG, JPG or PDF (max. 5MB)</p>
                                            <Input
                                                id="transfer-proof"
                                                type="file"
                                                accept="image/*,.pdf"
                                                className="hidden"
                                                onChange={handleFileUpload}
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        size="lg"
                                        className="w-full"
                                        onClick={handleSubmitPayment}
                                        disabled={!paymentProof || isProcessing}
                                    >
                                        {isProcessing ? 'Processing...' : 'Submit Transfer Proof'}
                                    </Button>
                                </div>
                            )}
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
