"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardHub() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const cachedRole = localStorage.getItem("role");
    setRole(cachedRole);

    if (cachedRole === "SALES") router.push("/dashboard/sales");
    if (cachedRole === "SANCTION") router.push("/dashboard/sanction");
    if (cachedRole === "DISBURSEMENT") router.push("/dashboard/disbursement");
    if (cachedRole === "COLLECTION") router.push("/dashboard/collection");
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (!role)
    return <p className="p-8 font-mono text-sm">Parsing identity context...</p>;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* 🛡️ THE GLOBAL BACKOFFICE NAVIGATION BAR HEADER */}
        <header className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center space-x-3">
            <span className="text-lg font-black tracking-tight text-white">
              LMS Operations Console
            </span>
            <span className="font-mono bg-gray-800 border border-gray-700 text-amber-400 px-2.5 py-0.5 text-xs rounded-full uppercase font-bold">
              {role} Workspace
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
          >
            Sign Out Terminal ⎋
          </button>
        </header>

        {/* MAIN REPOSITORY VIEWPORT HUB AREA */}
        <main className="flex-1 p-8 max-w-4xl mx-auto w-full">
          {role === "ADMIN" ? (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-gray-400">
                Functional Modules
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => router.push("/dashboard/sales")}
                  className="p-5 border text-left rounded-xl bg-white hover:border-black hover:shadow-sm transition"
                >
                  <h4 className="font-bold text-gray-900">
                    Sales Pipeline [cite: 48, 56]
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Monitor cold registration leads and user pipelines[cite:
                    57].
                  </p>
                </button>
                <button
                  onClick={() => router.push("/dashboard/sanction")}
                  className="p-5 border text-left rounded-xl bg-white hover:border-black hover:shadow-sm transition"
                >
                  <h4 className="font-bold text-gray-900">
                    Credit Risk & Sanctions [cite: 50, 58]
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Review active applications and issue loan decisions[cite:
                    59].
                  </p>
                </button>
                <button
                  onClick={() => router.push("/dashboard/disbursement")}
                  className="p-5 border text-left rounded-xl bg-white hover:border-black hover:shadow-sm transition"
                >
                  <h4 className="font-bold text-gray-900">
                    Capital Deployment Desk [cite: 51, 61]
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Authorize funding instructions and verify loan states[cite:
                    62].
                  </p>
                </button>
                <button
                  onClick={() => router.push("/dashboard/collection")}
                  className="p-5 border text-left rounded-xl bg-white hover:border-black hover:shadow-sm transition"
                >
                  <h4 className="font-bold text-gray-900">
                    Clearing & Collections Portal [cite: 53, 65]
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Record repayment UTR sequences and adjust accounts[cite: 66,
                    67].
                  </p>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border">
              <p className="text-sm text-gray-500 font-mono">
                Redirecting to dedicated primary workspace queue view...
              </p>
              <button
                onClick={handleLogout}
                className="mt-4 text-xs font-semibold text-gray-500 hover:text-black underline block mx-auto"
              >
                Click here if automatic redirection hangs
              </button>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
