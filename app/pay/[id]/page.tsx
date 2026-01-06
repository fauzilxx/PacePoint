'use client';

import { useState, useEffect, use } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

interface PaymentDetails {
    id: string;
    amount: number;
    status: 'PENDING' | 'PAID';
    createdAt: string;
}

export default function PublicPaymentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [payment, setPayment] = useState<PaymentDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { theme } = useTheme();

    // Use environment variable for API URL, fallback to localhost for dev if not set
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    useEffect(() => {
        const fetchPayment = async () => {
            try {
                const res = await fetch(`${API_URL}/api/pay/${id}`);
                if (!res.ok) throw new Error('Payment not found');
                const data = await res.json();
                setPayment(data);
            } catch (err) {
                setError('Invalid or expired payment link.');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchPayment();
    }, [id, API_URL]);

    const handlePayment = async () => {
        setProcessing(true);
        try {
            const res = await fetch(`${API_URL}/api/pay/${id}/confirm`, {
                method: 'POST',
            });
            if (!res.ok) throw new Error('Payment failed');

            const data = await res.json();
            if (data.status === 'PAID') {
                setPayment(prev => prev ? { ...prev, status: 'PAID' } : null);
            }
        } catch (err) {
            alert('Payment failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error || !payment) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md border-destructive">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive">
                            <XCircle /> Error
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{error || 'Payment not found'}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 font-sans">
            <Card className="w-full max-w-md shadow-lg border-primary/20">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-primary">Confirm Payment</CardTitle>
                    <CardDescription>PacePoint Secured Checkout (Mock)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg flex justify-between items-center">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="text-3xl font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(payment.amount)}</span>
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex justify-between">
                            <span>Payment ID</span>
                            <span className="font-mono">{payment.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Created At</span>
                            <span>{new Date(payment.createdAt).toLocaleTimeString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Status</span>
                            <span className={`font-bold ${payment.status === 'PAID' ? 'text-green-500' : 'text-yellow-500'}`}>
                                {payment.status}
                            </span>
                        </div>
                    </div>

                    {payment.status === 'PAID' ? (
                        <div className="flex flex-col items-center justify-center py-6 text-green-500 animate-in zoom-in duration-300">
                            <CheckCircle className="h-16 w-16 mb-2" />
                            <h3 className="text-xl font-bold">Payment Successful</h3>
                            <p className="text-sm text-muted-foreground">You may close this window.</p>
                        </div>
                    ) : (
                        <div className="pt-4">
                            {/* Mock Payment Options UI - Just Visuals */}
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                <div className="h-10 rounded border bg-card flex items-center justify-center text-xs font-semibold cursor-pointer border-primary/50 text-primary">
                                    Wallet
                                </div>
                                <div className="h-10 rounded border bg-muted flex items-center justify-center text-xs text-muted-foreground opacity-50 cursor-not-allowed">
                                    Card
                                </div>
                                <div className="h-10 rounded border bg-muted flex items-center justify-center text-xs text-muted-foreground opacity-50 cursor-not-allowed">
                                    Bank
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    {payment.status !== 'PAID' && (
                        <Button
                            className="w-full h-12 text-lg"
                            onClick={handlePayment}
                            disabled={processing}
                        >
                            {processing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Pay Now'}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
