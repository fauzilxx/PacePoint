'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Wallet, ArrowUpRight, History, Loader2, DollarSign } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { fetchWalletBalance, fetchWithdrawals, requestWithdrawal } from "@/lib/api/wallet"
import { format } from "date-fns"
import { toast } from "sonner" // Assuming sonner is set up, or generic alert

export default function OrganizerWalletPage() {
    const { user, isLoading: authLoading } = useAuth({ requireAuth: true, requiredRole: 'organizer' })
    const [isWithdrawing, setIsWithdrawing] = useState(false)
    const [withdrawAmount, setWithdrawAmount] = useState('')
    const [bankName, setBankName] = useState('')
    const [accountNumber, setAccountNumber] = useState('')
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // Fetch Balance
    const { data: profile, mutate: mutateProfile } = useSWR(
        user ? `wallet-balance-${user.id}` : null,
        () => fetchWalletBalance(user!.id)
    )

    // Fetch Withdrawals
    const { data: withdrawals, mutate: mutateWithdrawals } = useSWR(
        user ? `withdrawals-${user.id}` : null,
        () => fetchWithdrawals(user!.id)
    )

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user || !withdrawAmount) return

        const amount = parseFloat(withdrawAmount)
        if (amount > (profile?.wallet_balance || 0)) {
            alert("Insufficient funds")
            return
        }

        setIsWithdrawing(true)
        try {
            await requestWithdrawal(user.id, amount, {
                bank_name: bankName,
                account_number: accountNumber,
                account_holder: user.full_name
            })

            // Success
            mutateProfile()
            mutateWithdrawals()
            setIsDialogOpen(false)
            setWithdrawAmount('')
            alert("Withdrawal requested successfully!")
        } catch (error: any) {
            console.error(error)
            alert(error.message || "Failed to request withdrawal")
        } finally {
            setIsWithdrawing(false)
        }
    }

    if (authLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>

    const currentBalance = Number(profile?.wallet_balance || 0)

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Funds</h1>
                    <p className="text-muted-foreground mt-1">Manage your event earnings and withdrawals safely.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="lg" className="shadow-lg shadow-primary/20">
                            <ArrowUpRight className="mr-2 h-4 w-4" />
                            Withdraw Funds
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Request Withdrawal</DialogTitle>
                            <DialogDescription>
                                Funds will be transferred to your bank account within 1-2 business days.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleWithdraw} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Amount to Withdraw</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        className="pl-9"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        max={currentBalance}
                                        required
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground text-right">
                                    Available: Rp {currentBalance.toLocaleString('id-ID')}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label>Bank Name</Label>
                                <Input
                                    placeholder="e.g. BCA, Mandiri"
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Account Number</Label>
                                <Input
                                    placeholder="1234567890"
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    required
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isWithdrawing || currentBalance <= 0}>
                                    {isWithdrawing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Confirm Withdrawal
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1 bg-primary text-primary-foreground">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-primary-foreground/80">Active Balance</CardDescription>
                        <CardTitle className="text-4xl font-bold">
                            Rp {currentBalance.toLocaleString('id-ID')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-primary-foreground/80 flex items-center gap-1">
                            <Wallet className="h-4 w-4" />
                            <span>Safety Funds Account</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <History className="h-5 w-5 text-primary" />
                            <CardTitle>Withdrawal History</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {!withdrawals || withdrawals.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No withdrawal history yet.
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Bank</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {withdrawals.map((w) => (
                                        <TableRow key={w.id}>
                                            <TableCell>{format(new Date(w.created_at), 'MMM d, yyyy')}</TableCell>
                                            <TableCell className="font-medium">
                                                Rp {w.amount.toLocaleString('id-ID')}
                                            </TableCell>
                                            <TableCell>{w.bank_details.bank_name} - {w.bank_details.account_number}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        w.status === 'approved' ? 'default' :
                                                            w.status === 'rejected' ? 'destructive' : 'secondary'
                                                    }
                                                >
                                                    {w.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
