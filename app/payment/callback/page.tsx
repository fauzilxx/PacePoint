"use client"

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function PaymentCallbackPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const paymentId = searchParams.get('id')
    const userId = searchParams.get('user')
    const amount = searchParams.get('amount')

    useEffect(() => {
        if (paymentId && userId) {
            // Mark payment as confirmed in sessionStorage
            const paymentKey = `payment_${paymentId}_${userId}`
            sessionStorage.setItem(paymentKey, JSON.stringify({
                status: 'confirmed',
                timestamp: new Date().toISOString(),
                amount: amount
            }))

            // Redirect after showing success message
            setTimeout(() => {
                // Close this tab/window (if opened from QR scan)
                window.close()

                // If window.close() doesn't work (same tab), redirect to home
                setTimeout(() => {
                    router.push('/')
                }, 500)
            }, 2000)
        }
    }, [paymentId, userId, amount, router])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
            <Card className="max-w-md w-full">
                <CardContent className="pt-6 text-center">
                    <div className="mb-6">
                        <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto animate-bounce" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                        Payment Confirmed!
                    </h1>
                    <p className="text-muted-foreground mb-4">
                        Your payment of Rp {amount ? Number(amount).toLocaleString('id-ID') : '0'} has been confirmed.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Redirecting...</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
