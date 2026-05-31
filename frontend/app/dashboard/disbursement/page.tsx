"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import {
  DollarSign,
  ArrowUpCircle,
  CheckCircle,
  Clock,
  SearchX,
  Loader2,
  IndianRupee,
  Receipt,
  ShieldCheck,
} from "lucide-react";

export default function DisbursementDashboard() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disbursingLoan, setDisbursingLoan] = useState<string | null>(null);

  const fetchSanctionedLoans = () => {
    setLoading(true);
    api
      .get("/disbursement/pending")
      .then(({ data }) => {
        setLoans(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to query sanctioned liquidity queue.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSanctionedLoans();
  }, []);

  const handleDisburse = async (id: string) => {
    setDisbursingLoan(id);
    try {
      await api.patch(`/disbursement/${id}/disburse`);
      toast.success("Capital allocation marked disbursed successfully.");
      fetchSanctionedLoans();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Disbursement failed.");
    } finally {
      setDisbursingLoan(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between border-b border-slate-200 pb-6 mb-8">
            <div className="flex items-center gap-3 mb-3 sm:mb-0">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <ArrowUpCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Capital Deployment
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Authorize fund disbursement for approved applications
                </p>
              </div>
            </div>
            {!loading && (
              <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                {loans.length} Pending Disbursement
                {loans.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800 text-white text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-4 font-medium">Loan Reference</th>
                    <th className="p-4 font-medium">Principal</th>
                    <th className="p-4 font-medium">Total Repayment</th>
                    <th className="p-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[1, 2, 3].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="p-4">
                        <div className="h-4 bg-slate-200 rounded w-32"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-4 bg-slate-200 rounded w-24"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-4 bg-slate-200 rounded w-24"></div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="h-8 bg-slate-200 rounded w-36 ml-auto"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty State */}
          {!loading && loans.length === 0 && (
            <div className="text-center py-16 px-4 border border-dashed border-slate-200 rounded-2xl bg-white/50">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 mb-4">
                <SearchX className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-800 mb-1">
                No Pending Disbursements
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                No sanctioned loans are currently awaiting fund release. New
                approved applications will appear here.
              </p>
            </div>
          )}

          {/* Loans Table */}
          {!loading && loans.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-800 text-white text-xs uppercase tracking-wider">
                    <tr>
                      <th className="p-4 font-medium">Loan Reference</th>
                      <th className="p-4 font-medium">Principal</th>
                      <th className="p-4 font-medium">Total Repayment</th>
                      <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loans.map((loan: any) => (
                      <tr
                        key={loan._id}
                        className="hover:bg-emerald-50/30 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                            <span className="font-mono font-bold text-slate-800">
                              {loan._id}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-slate-700">
                            <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-mono">
                              {loan.amount.toLocaleString()}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-emerald-700 font-bold">
                            <Receipt className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="font-mono">
                              ₹{loan.totalRepayment.toLocaleString()}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDisburse(loan._id)}
                            disabled={disbursingLoan === loan._id}
                            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed font-sans"
                          >
                            {disbursingLoan === loan._id ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-3.5 h-3.5" />
                                Release Funds
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
