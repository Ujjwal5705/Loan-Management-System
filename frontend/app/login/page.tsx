"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import api from "@/lib/axios";

import toast from "react-hot-toast";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", data.token);

      localStorage.setItem("role", data.role);

      toast.success("Login Successful");

      if (data.role === "BORROWER") {
        router.push("/apply");
      } else {
        router.push("/dashboard");
      }
    } catch {
      toast.error("Login Failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleLogin} className="space-y-4 border p-8 rounded-lg">
        <h1 className="text-2xl font-bold">Login</h1>

        <input
          className="border p-2 w-full"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-black text-white px-4 py-2 rounded w-full">
          Login
        </button>
      </form>
    </div>
  );
}
