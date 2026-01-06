'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from 'qrcode.react';
import { Loader2, RefreshCw, CheckCircle } from "lucide-react";

export default function PaymentInitiatorPage() {
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState<string>('10.00'); // Default mock amount
    const [paymentId, setPaymentId] = useState<string | null>(null);
    const [qrValue, setQrValue] = useState<string | null>(null);
    const [status, setStatus] = useState<'PENDING' | 'PAID'>('PENDING');

    // Use environment variable for API URL, fallback to localhost for dev if not set
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    const createPayment = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/pay/init`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: parseFloat(amount) })
            });
            const data = await res.json();
            setPaymentId(data.paymentId);
            setQrValue(data.paymentPageUrl);
            setStatus('PENDING');
        } catch (err) {
            console.error(err);
            alert('Failed to init payment');
        } finally {
            setLoading(false);
        }
    };

    // Poll for status
    useEffect(() => {
        if (!paymentId || status === 'PAID') return;

        const interval = setInterval(async () => {
            try {
                const res = await fetch(`${API_URL}/api/pay/${paymentId}/status`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.status === 'PAID') {
                        setStatus('PAID');
                        clearInterval(interval);
                    }
                }
            } catch (error) {
                console.error("Polling error", error);
            }
        }, 2000); // Poll every 2 seconds

        return () => clearInterval(interval);
    }, [paymentId, status, API_URL]);

    return (
        <div className="container mx-auto max-w-lg py-12 px-4">
            <Card>
                <CardHeader>
                    <CardTitle>QR Payment Mock</CardTitle>
                    <CardDescription>Generate a QR code to test the flow.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Amount to Pay ($)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    {!paymentId ? (
                        <div className="flex justify-center py-8 text-muted-foreground text-sm">
                            Click "Generate QR" to start.
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border-2 border-dashed border-gray-200">
                            {status === 'PAID' ? (
                                <div className="flex flex-col items-center text-green-600 animate-in fade-in duration-500">
                                    <CheckCircle className="w-24 h-24 mb-4" />
                                    <h3 className="text-2xl font-bold">Payment Received!</h3>
                                </div>
                            ) : (
                                <>
                                    {qrValue && (
                                        <div className="bg-white p-2">
                                            <QRCodeSVG value={qrValue} size={256} />
                                        </div>
                                    )}
                                    <p className="mt-4 text-xs text-center text-gray-500 max-w-[200px] break-all">
                                        Scan with camera or visit:<br />
                                        <a href={qrValue!} target="_blank" className="text-blue-500 hover:underline">{qrValue}</a>
                                    </p>
                                    <div className="flex items-center gap-2 mt-4 text-primary animate-pulse">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span className="text-sm font-medium">Waiting for payment...</span>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => { setPaymentId(null); setQrValue(null); setStatus('PENDING'); }}>
                        Reset
                    </Button>
                    {!paymentId && (
                        <Button onClick={createPayment} disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Generate QR
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
