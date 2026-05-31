"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import api from "@/lib/axios";

import toast from "react-hot-toast";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", form);

      toast.success("Account Created");

      router.push("/login");
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={submit} className="space-y-4 border p-8 rounded-lg">
        <h1 className="text-2xl font-bold">Register</h1>

        <input
          placeholder="Name"
          className="border p-2 w-full"
          onChange={(e) =>
            setForm({
              ...form,
              fullName: e.target.value,
            })
          }
        />

        <input
          placeholder="Email"
          className="border p-2 w-full"
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full"
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        <button className="bg-black text-white w-full py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}
