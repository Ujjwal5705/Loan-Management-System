import Link from "next/link";
import {
  ShieldCheck,
  FileCheck,
  TrendingUp,
  ArrowRight,
  Users,
  ClipboardCheck,
  BarChart3,
  Banknote,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-600 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-800">LendFlow</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-600 hover:text-indigo-700 transition"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            Enterprise Loan Management
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
            Streamline your entire
            <br />
            <span className="text-indigo-600">lending lifecycle</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
            From application and underwriting to disbursement and collections,
            LendFlow gives your team a unified platform to manage loans with
            precision and speed.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-lg font-medium hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
            >
              Create Free Account
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-slate-200 text-slate-700 px-8 py-3.5 rounded-lg font-medium hover:bg-slate-50 transition"
            >
              Sign In to Portal
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: FileCheck,
              title: "Smart Applications",
              desc: "Borrowers apply in minutes with automated BRE eligibility checks and document uploads.",
            },
            {
              icon: TrendingUp,
              title: "Sales Pipeline",
              desc: "Track cold leads and convert registrations into active loan applications.",
            },
            {
              icon: ClipboardCheck,
              title: "Credit Sanctions",
              desc: "Underwriters approve or reject applications with reason tracking and audit trails.",
            },
            {
              icon: Banknote,
              title: "Disbursement & Collection",
              desc: "Authorize fund releases and record repayments with full ledger reconciliation.",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="p-2 bg-indigo-50 rounded-lg w-fit mb-4">
                <feature.icon className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-500">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Trust / Stats */}
        <div className="mt-24 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-12">
            Built for modern lending teams
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { stat: "5x", label: "Faster Loan Processing" },
              { stat: "99.9%", label: "Uptime SLA" },
              { stat: "100%", label: "Audit Compliance" },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="text-3xl font-bold text-indigo-600">
                  {item.stat}
                </div>
                <div className="text-sm text-slate-500 mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 bg-indigo-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to modernize your loan operations?
          </h2>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of financial teams that rely on LendFlow to manage
            their lending workflow from end to end.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-3.5 rounded-lg font-semibold hover:bg-indigo-50 transition"
          >
            Start Free Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-200 mt-16">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 sm:mb-0">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-slate-600">LendFlow</span>
          </div>
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} LendFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}