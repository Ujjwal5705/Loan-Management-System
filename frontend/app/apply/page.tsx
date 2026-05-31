"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function ApplyPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto p-10">
        <h1 className="text-3xl font-bold">Loan Application</h1>

        <p className="mt-4">Borrower Flow Coming Next</p>
      </div>
    </ProtectedRoute>
  );
}
