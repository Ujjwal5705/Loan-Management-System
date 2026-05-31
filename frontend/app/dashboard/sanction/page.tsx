"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import {
  ShieldCheck,
  FileSearch,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  IndianRupee,
  Calendar,
  Receipt,
  Loader2,
  ArrowRightLeft,
  Ban,
} from "lucide-react";

export default function SanctionDashboard() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectingLoan, setRejectingLoan] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null); // track which loan is being processed

  const fetchAppliedLoans = () => {
    setLoading(true);
    api
      .get("/sanction/pending")
      .then(({ data }) => {
        setLoans(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load underwriting stream.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAppliedLoans();
  }, []);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    let payload = {};
    if (action === "reject") {
      // If reason is still empty (shouldn't happen because we validate), fallback
      if (!rejectReason.trim()) {
        toast.error("Please provide a reason for rejection.");
        return;
      }
      payload = { reason: rejectReason };
    }

    setActionLoading(id);
    try {
      await api.patch(`/sanction/${id}/${action}`, payload);
      toast.success(`Loan file successfully marked as ${action}d.`);
      // Reset rejection state
      setRejectingLoan(null);
      setRejectReason("");
      fetchAppliedLoans();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Execution exception.");
    } finally {
      setActionLoading(null);
    }
  };

  const startRejection = (loanId: string) => {
    setRejectingLoan(loanId);
    setRejectReason("");
  };

  const cancelRejection = () => {
    setRejectingLoan(null);
    setRejectReason("");
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <Clock className="w-3 h-3" />
            Pending Review
          </span>
        );
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-indigo-50/30 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between border-b border-slate-200 pb-6 mb-8">
            <div className="flex items-center gap-3 mb-3 sm:mb-0">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <FileSearch className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Credit Risk & Sanctions
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Review eligibility and manage application status
                </p>
              </div>
            </div>
            <button
              onClick={fetchAppliedLoans}
              className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition"
            >
              <ArrowRightLeft className="w-4 h-4" />
              Refresh pipeline
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm animate-pulse"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 w-full">
                      <div className="h-3 bg-slate-200 rounded w-24"></div>
                      <div className="h-4 bg-slate-200 rounded w-48"></div>
                    </div>
                    <div className="h-5 bg-slate-200 rounded-full w-20"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4 bg-slate-50 p-3 rounded-lg">
                    <div className="h-3 bg-slate-200 rounded"></div>
                    <div className="h-3 bg-slate-200 rounded"></div>
                    <div className="col-span-2 h-3 bg-slate-200 rounded w-3/4"></div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <div className="flex-1 h-9 bg-slate-200 rounded-lg"></div>
                    <div className="flex-1 h-9 bg-slate-200 rounded-lg"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && loans.length === 0 && (
            <div className="text-center py-16 px-4 border border-dashed border-slate-200 rounded-2xl bg-white/50">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 mb-4">
                <ShieldCheck className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-800 mb-1">
                All Clear
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                No credit files are currently pending underwriting verification.
                New applications will appear here.
              </p>
            </div>
          )}

          {/* Loan Cards */}
          {!loading && loans.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loans.map((loan: any) => (
                <div
                  key={loan._id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition p-5 flex flex-col"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Application Ref
                      </p>
                      <p className="text-sm font-mono font-semibold text-slate-700 truncate max-w-50">
                        {loan._id}
                      </p>
                    </div>
                    {getStatusBadge(loan.status)}
                  </div>

                  {/* Loan Details */}
                  <div className="bg-slate-50 rounded-lg p-3 mb-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <IndianRupee className="w-3.5 h-3.5" />
                        Principal
                      </div>
                      <span className="font-semibold text-slate-800">
                        ₹{loan.amount?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Calendar className="w-3.5 h-3.5" />
                        Tenure
                      </div>
                      <span className="font-semibold text-slate-800">
                        {loan.tenureDays} Days
                      </span>
                    </div>
                    <div className="flex justify-between text-sm pt-1 border-t border-slate-200">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Receipt className="w-3.5 h-3.5" />
                        Total Obligation
                      </div>
                      <span className="font-semibold text-emerald-700">
                        ₹{loan.totalRepayment?.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {rejectingLoan === loan._id ? (
                    <div className="mt-auto space-y-2">
                      <div className="flex gap-2 items-start">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Rejection Reason
                          </label>
                          <input
                            autoFocus
                            type="text"
                            placeholder="Enter reason..."
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(loan._id, "reject")}
                          disabled={
                            !rejectReason.trim() || actionLoading === loan._id
                          }
                          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-red-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-60"
                        >
                          {actionLoading === loan._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Ban className="w-4 h-4" />
                          )}
                          Confirm Rejection
                        </button>
                        <button
                          onClick={cancelRejection}
                          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-auto flex gap-2">
                      <button
                        onClick={() => handleAction(loan._id, "approve")}
                        disabled={actionLoading === loan._id}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-indigo-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition disabled:opacity-60"
                      >
                        {actionLoading === loan._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => startRejection(loan._id)}
                        disabled={actionLoading === loan._id}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 border border-red-200 text-red-600 text-sm font-medium py-2.5 rounded-lg hover:bg-red-50 transition disabled:opacity-60"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
