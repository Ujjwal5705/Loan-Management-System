"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import {
  Banknote,
  CreditCard,
  Hash,
  IndianRupee,
  CalendarDays,
  ArrowRight,
  Loader2,
  CheckCircle,
  RefreshCw,
} from "lucide-react";

export default function CollectionDashboard() {
  const [loanId, setLoanId] = useState("");
  const [utr, setUtr] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);

    try {
      const payload = {
        loanId,
        utr,
        amount: Number(amount),
        paymentDate: new Date(paymentDate).toISOString(),
      };

      await api.post("/collection/repayment", payload);
      toast.success("Payment recorded! Ledger balance updated cleanly.");

      // Show temporary success state and clear form
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setUtr("");
      setAmount("");
      setPaymentDate("");
      // Keep loanId as it is often reused for multiple payments – uncomment below if you want to clear it too
      // setLoanId("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Payment compilation error.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClear = () => {
    setLoanId("");
    setUtr("");
    setAmount("");
    setPaymentDate("");
    setSuccess(false);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-amber-50/30 p-6 md:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center gap-3 border-b border-slate-200 pb-6 mb-8">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Banknote className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Collections Clearing Desk
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Record repayment transactions and reconcile ledger entries
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="p-6 md:p-8">
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500 uppercase tracking-wider">
                  <RefreshCw className="w-4 h-4" />
                  Record Clearing Receipt
                </div>

                {/* Loan ID */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Target Loan Reference ID
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      required
                      type="text"
                      placeholder="Enter loan reference ID"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                      value={loanId}
                      onChange={(e) => setLoanId(e.target.value)}
                    />
                  </div>
                </div>

                {/* UTR */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Unique Bank Transaction UTR
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      required
                      type="text"
                      placeholder="AXISN23948239482"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                      value={utr}
                      onChange={(e) => setUtr(e.target.value)}
                    />
                  </div>
                </div>

                {/* Amount & Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Amount Settled (INR)
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        required
                        type="number"
                        placeholder="5000"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Settlement Date
                    </label>
                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        required
                        type="date"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                        value={paymentDate}
                        onChange={(e) => setPaymentDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-2 bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Posting Transaction...
                      </>
                    ) : success ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Payment Recorded
                      </>
                    ) : (
                      <>
                        Post Repayment
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
