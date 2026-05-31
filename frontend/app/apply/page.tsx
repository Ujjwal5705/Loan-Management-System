"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Upload,
  FileText,
  DollarSign,
  Calendar,
  Percent,
  LogOut,
  User,
  CreditCard,
  Briefcase,
  CalendarDays,
  Copy,
  ShieldCheck,
  Loader2,
} from "lucide-react";

export default function ApplyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [profileCreated, setProfileCreated] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Step 1: Profile State
  const [personalDetails, setPersonalDetails] = useState({
    fullName: "",
    pan: "",
    dob: "",
    monthlySalary: "",
    employmentMode: "Salaried",
  });

  // Step 3: Loan Config Slider States
  const [loanRefId, setLoanRefId] = useState("");
  const [amount, setAmount] = useState(50000);
  const [tenureDays, setTenureDays] = useState(30);
  const interestRate = 12; // Fixed 12% p.a.

  // Simple Interest Calculations
  const interestAmount = Math.round(
    (amount * interestRate * tenureDays) / (365 * 100),
  );
  const totalRepayment = amount + interestAmount;

  // Handle Step 1 Submit (BRE Verification)
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...personalDetails,
        monthlySalary: Number(personalDetails.monthlySalary),
      };
      await api.post("/borrower/profile", payload);
      toast.success("Profile eligible! BRE Validation Passed.");
      setProfileCreated(true);
      setStep(2);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Eligibility Check Failed.";
      toast.error(errorMsg, { duration: 5000 });
    }
  };

  // Handle Step 2 File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds maximum 5MB restriction.");
      return;
    }

    const formData = new FormData();
    formData.append("salarySlip", file);

    setUploading(true);
    try {
      await api.post("/borrower/upload-slip", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Salary slip linked successfully!");
      setFileUploaded(true);
      setStep(3);
    } catch (err) {
      toast.error("File upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // Handle Step 3 Final Application Submission
  const handleFinalApply = async () => {
    try {
      const { data } = await api.post("/loan/apply", { amount, tenureDays });
      toast.success("Loan application successfully registered!");
      if (data?.loan?._id || data?._id) {
        setLoanRefId(data?.loan?._id || data?._id);
      }
      setStep(4);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Submission failed.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const steps = [
    { number: 1, label: "Profile & Eligibility" },
    { number: 2, label: "Income Verification" },
    { number: 3, label: "Loan Configuration" },
    { number: 4, label: "Submission" },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-6">
            <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white/20 rounded-lg">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold tracking-tight">
                  Loan Application Portal
                </h1>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                Exit
              </button>
            </div>

            {/* Stepper */}
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                {steps.map((s, idx) => (
                  <div key={s.number} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition ${
                          step > s.number
                            ? "bg-emerald-500 text-white"
                            : step === s.number
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {step > s.number ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          s.number
                        )}
                      </div>
                      <span
                        className={`text-xs mt-1 font-medium hidden sm:block ${
                          step === s.number
                            ? "text-indigo-700"
                            : "text-slate-500"
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                    {idx < steps.length - 1 && (
                      <div className="flex-1 mx-2 h-0.5 bg-slate-200 relative">
                        <div
                          className={`absolute inset-y-0 left-0 bg-indigo-500 transition-all duration-500 ${
                            step > s.number ? "w-full" : "w-0"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
            {/* STEP 1: PERSONAL DETAILS & BRE */}
            {step === 1 && (
              <form onSubmit={handleProfileSubmit} className="space-y-5">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-lg font-semibold text-slate-800">
                    Personal Details & Eligibility Check
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                        type="text"
                        placeholder="John Doe"
                        value={personalDetails.fullName}
                        onChange={(e) =>
                          setPersonalDetails({
                            ...personalDetails,
                            fullName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      PAN Number
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                        type="text"
                        placeholder="ABCDE1234F"
                        value={personalDetails.pan}
                        onChange={(e) =>
                          setPersonalDetails({
                            ...personalDetails,
                            pan: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                        type="date"
                        value={personalDetails.dob}
                        onChange={(e) =>
                          setPersonalDetails({
                            ...personalDetails,
                            dob: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Monthly Net Salary (INR)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                        type="number"
                        placeholder="30000"
                        value={personalDetails.monthlySalary}
                        onChange={(e) =>
                          setPersonalDetails({
                            ...personalDetails,
                            monthlySalary: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Employment Status
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px]"
                        value={personalDetails.employmentMode}
                        onChange={(e) =>
                          setPersonalDetails({
                            ...personalDetails,
                            employmentMode: e.target.value,
                          })
                        }
                      >
                        <option value="Salaried">Salaried</option>
                        <option value="Self-Employed">Self-Employed</option>
                        <option value="Unemployed">Unemployed</option>
                      </select>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
                >
                  Verify Financial Eligibility
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 2: FILE UPLOAD */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-4">
                  <Upload className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-lg font-semibold text-slate-800">
                    Income Substantiation
                  </h2>
                </div>
                <p className="text-sm text-slate-500">
                  Please upload your latest salary slip. Supported formats: PDF,
                  JPG, PNG (max 5MB).
                </p>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition relative">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading}
                  />
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-3 bg-indigo-100 rounded-full">
                      {uploading ? (
                        <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                      ) : (
                        <FileText className="w-6 h-6 text-indigo-600" />
                      )}
                    </div>
                    <p className="text-sm font-medium text-slate-700">
                      {uploading
                        ? "Uploading..."
                        : "Click to select salary slip"}
                    </p>
                    <p className="text-xs text-slate-400">
                      PDF, PNG, or JPG up to 5MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 text-sm text-slate-600 hover:text-indigo-700 font-medium transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Personal Details
                </button>
              </div>
            )}

            {/* STEP 3: LOAN CONFIGURATION */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-lg font-semibold text-slate-800">
                    Loan Configuration
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Controls */}
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                        <span>Requested Capital</span>
                        <span className="text-indigo-700 font-bold">
                          ₹{amount.toLocaleString()}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="50000"
                        max="500000"
                        step="5000"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                      <div className="flex justify-between text-xs text-slate-400 mt-1">
                        <span>₹50,000</span>
                        <span>₹5,00,000</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                        <span>Repayment Tenure</span>
                        <span className="text-indigo-700 font-bold">
                          {tenureDays} Days
                        </span>
                      </div>
                      <input
                        type="range"
                        min="30"
                        max="365"
                        step="1"
                        value={tenureDays}
                        onChange={(e) => setTenureDays(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                      <div className="flex justify-between text-xs text-slate-400 mt-1">
                        <span>30 Days</span>
                        <span>365 Days</span>
                      </div>
                    </div>
                  </div>

                  {/* Breakdown Card */}
                  <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl p-5 border border-slate-200 shadow-inner space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                      <Percent className="w-3.5 h-3.5" />
                      Live Breakdown
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Interest Rate</span>
                      <span className="font-medium">{interestRate}% p.a.</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Simple Interest</span>
                      <span className="font-medium text-amber-700">
                        + ₹{interestAmount.toLocaleString()}
                      </span>
                    </div>
                    <hr className="border-slate-200" />
                    <div className="flex justify-between text-base font-bold">
                      <span className="text-slate-800">Total Obligation</span>
                      <span className="text-emerald-700">
                        ₹{totalRepayment.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center gap-1 text-sm text-slate-600 hover:text-indigo-700 font-medium transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Document Upload
                  </button>
                  <button
                    onClick={handleFinalApply}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition"
                  >
                    Submit Loan Request
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: SUCCESS */}
            {step === 4 && (
              <div className="text-center py-6 space-y-5">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Application Submitted!
                </h2>

                {loanRefId && (
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 max-w-sm mx-auto">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">
                      Loan Reference ID
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <p className="text-sm font-mono font-bold text-indigo-700 select-all">
                        {loanRefId}
                      </p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(loanRefId);
                          toast.success("Copied to clipboard!");
                        }}
                        className="p-1 hover:bg-indigo-100 rounded transition"
                      >
                        <Copy className="w-4 h-4 text-indigo-500" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      You can use this ID to track your application status.
                    </p>
                  </div>
                )}

                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Your application is now under review. You will be notified
                  once it's processed.
                </p>
                <button
                  onClick={() => router.push("/login")}
                  className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium px-5 py-2.5 rounded-lg transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
