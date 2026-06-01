"use client";

import { useState, useEffect } from "react";
import { CreditCard, CheckCircle2, Clock, AlertCircle, Download, Loader2, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ChildSelector } from "@/components/ChildSelector";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";

interface FeeRecord {
  id: string;
  month: number;
  year: number;
  amount: number;
  dueDate: string;
  status: string;
  payment: { transactionId: string; paidAt: string; gateway: string } | null;
}

interface FeesData {
  childName: string;
  summary: { totalPending: string; totalPaid: string; pendingCount: number };
  fees: FeeRecord[];
}

const MONTH_NAMES = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function FeesPage() {
  const [data, setData] = useState<FeesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  const loadFees = async () => {
    try {
      setLoading(true);
      const query = selectedChildId ? `?childId=${selectedChildId}` : "";
      const result = await fetchApi(`/parents/fees${query}`);
      setData(result);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadFees(); }, [selectedChildId]);

  const handlePayFee = async (feeId: string) => {
    setPayingId(feeId);
    try {
      const result = await fetchApi(`/parents/fees/${feeId}/pay`, { method: "POST" });
      toast.success(`Payment successful! Transaction: ${result.transactionId}`);
      await loadFees();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setPayingId(null);
    }
  };

  const handleDownloadReceipt = (fee: FeeRecord) => {
    if (!fee.payment || !data) return;

    const receiptHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Fee Receipt - ${MONTH_NAMES[fee.month]} ${fee.year}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; color: #1e1e1e; }
    .header { text-align: center; border-bottom: 2px solid #5B4DFF; padding-bottom: 20px; margin-bottom: 24px; }
    .logo { font-size: 24px; font-weight: bold; color: #5B4DFF; }
    .title { font-size: 18px; margin: 8px 0 0; color: #6B7280; }
    .badge { display: inline-block; background: #dcfce7; color: #16a34a; padding: 4px 12px; border-radius: 999px; font-size: 13px; font-weight: bold; margin-top: 8px; }
    .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #F3F4F6; }
    .label { color: #6B7280; font-size: 14px; }
    .value { font-weight: 600; font-size: 14px; }
    .amount-row { font-size: 20px; font-weight: bold; color: #5B4DFF; padding: 16px 0; }
    .footer { text-align: center; margin-top: 32px; color: #9CA3AF; font-size: 12px; }
    @media print { button { display: none !important; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">🎓 Aura Tuition</div>
    <div class="title">Fee Payment Receipt</div>
    <span class="badge">✓ PAID</span>
  </div>

  <div class="row"><span class="label">Student Name</span><span class="value">${data.childName}</span></div>
  <div class="row"><span class="label">Fee Period</span><span class="value">${MONTH_NAMES[fee.month]} ${fee.year}</span></div>
  <div class="row"><span class="label">Due Date</span><span class="value">${new Date(fee.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span></div>
  <div class="row amount-row"><span class="label">Amount Paid</span><span class="value">₹${fee.amount.toLocaleString("en-IN")}</span></div>
  <div class="row"><span class="label">Payment Date</span><span class="value">${new Date(fee.payment.paidAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" } as any)}</span></div>
  <div class="row"><span class="label">Payment Gateway</span><span class="value">${fee.payment.gateway}</span></div>
  <div class="row"><span class="label">Transaction ID</span><span class="value">${fee.payment.transactionId}</span></div>

  <div class="footer">
    <p>This is a computer-generated receipt. No signature required.</p>
    <p>For queries, contact support@auratution.com</p>
  </div>

  <script>window.onload = () => window.print();</script>
</body>
</html>`;

    const win = window.open("", "_blank");
    if (win) {
      win.document.write(receiptHtml);
      win.document.close();
    } else {
      toast.error("Popup blocked. Please allow popups to download receipt.");
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 pb-20 lg:pb-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-9 w-36 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1,2,3].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Failed to load fees</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  const pendingFees = data.fees.filter(f => f.status === "PENDING");
  const paidFees = data.fees.filter(f => f.status === "PAID");

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading">Fees &amp; Payments</h1>
          <p className="text-muted-foreground mt-1">Manage fee payments for {data.childName}.</p>
        </div>
        <ChildSelector selectedChildId={selectedChildId} onSelect={setSelectedChildId} />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl border shadow-sm border-amber-100 bg-amber-50/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-sm font-semibold text-muted-foreground">Outstanding</span>
            </div>
            <div className="text-2xl font-bold font-heading text-amber-700">{data.summary.totalPending}</div>
            <p className="text-xs text-muted-foreground mt-1">{data.summary.pendingCount} pending {data.summary.pendingCount === 1 ? "fee" : "fees"}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border shadow-sm border-green-100 bg-green-50/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm font-semibold text-muted-foreground">Total Paid</span>
            </div>
            <div className="text-2xl font-bold font-heading text-green-700">{data.summary.totalPaid}</div>
            <p className="text-xs text-muted-foreground mt-1">{paidFees.length} payments completed</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-semibold text-muted-foreground">Total Records</span>
            </div>
            <div className="text-2xl font-bold font-heading">{data.fees.length}</div>
            <p className="text-xs text-muted-foreground mt-1">fee entries on record</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Fees */}
      {pendingFees.length > 0 && (
        <div className="bg-white rounded-3xl border shadow-sm p-6">
          <h3 className="font-bold font-heading mb-4 flex items-center gap-2 text-amber-700">
            <Clock className="w-5 h-5" /> Pending Payments
          </h3>
          <div className="space-y-3">
            {pendingFees.map((fee) => (
              <div key={fee.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-amber-100 rounded-2xl bg-amber-50/30">
                <div>
                  <h4 className="font-bold text-sm">{MONTH_NAMES[fee.month]} {fee.year}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Due: {new Date(fee.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold font-heading">₹{fee.amount.toLocaleString("en-IN")}</span>
                  <Button
                    size="sm"
                    className="rounded-xl font-semibold shadow-sm"
                    disabled={payingId === fee.id}
                    onClick={() => handlePayFee(fee.id)}
                  >
                    {payingId === fee.id ? <><Loader2 className="w-4 h-4 animate-spin mr-1" />Paying...</> : "Pay Now"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment History */}
      <div className="bg-white rounded-3xl border shadow-sm p-6">
        <h3 className="font-bold font-heading mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" /> Payment History
        </h3>
        {paidFees.length > 0 ? (
          <div className="space-y-3">
            {paidFees.map((fee) => (
              <div key={fee.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{MONTH_NAMES[fee.month]} {fee.year}</h4>
                    <p className="text-xs text-muted-foreground">
                      {fee.payment && `Paid on ${new Date(fee.payment.paidAt).toLocaleDateString("en-IN")} via ${fee.payment.gateway}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold">₹{fee.amount.toLocaleString("en-IN")}</span>
                  <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50 text-xs">Paid</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-xl text-muted-foreground hover:text-primary gap-1"
                    onClick={() => handleDownloadReceipt(fee)}
                    title="Download Receipt"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs">Receipt</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">No payment history yet.</p>
        )}
      </div>
    </div>
  );
}
