"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import {
  Users,
  TrendingUp,
  Mail,
  Calendar,
  UserCheck,
  SearchX,
  Loader2,
  Clock,
} from "lucide-react";

export default function SalesDashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/sales/leads")
      .then(({ data }) => {
        setLeads(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to fetch leads roster.");
        setLoading(false);
      });
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between border-b border-slate-200 pb-6 mb-8">
            <div className="flex items-center gap-3 mb-3 sm:mb-0">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Sales Pipeline
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Track cold leads who have registered but not yet applied
                </p>
              </div>
            </div>
            {!loading && (
              <span className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                <Users className="w-3.5 h-3.5" />
                {leads.length} Lead{leads.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800 text-white text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-4 font-medium">Lead Full Name</th>
                    <th className="p-4 font-medium">Email Address</th>
                    <th className="p-4 font-medium">Profile Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[1, 2, 3, 4].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="p-4">
                        <div className="h-4 bg-slate-200 rounded w-32"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-4 bg-slate-200 rounded w-44"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-4 bg-slate-200 rounded w-24"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty State */}
          {!loading && leads.length === 0 && (
            <div className="text-center py-16 px-4 border border-dashed border-slate-200 rounded-2xl bg-white/50">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 mb-4">
                <SearchX className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-800 mb-1">
                No Leads Found
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Currently there are no registered users who haven't applied for
                a loan. New leads will appear here once they sign up.
              </p>
            </div>
          )}

          {/* Leads Table */}
          {!loading && leads.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-800 text-white text-xs uppercase tracking-wider">
                    <tr>
                      <th className="p-4 font-medium">Lead Full Name</th>
                      <th className="p-4 font-medium">Email Address</th>
                      <th className="p-4 font-medium">Profile Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leads.map((lead: any) => (
                      <tr
                        key={lead._id}
                        className="hover:bg-indigo-50/30 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
                              <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                            </div>
                            <span className="font-medium text-slate-800">
                              {lead.fullName}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-mono text-xs">
                              {lead.email}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-slate-500">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>
                              {new Date(lead.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          </div>
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
