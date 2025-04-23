'use client';
import { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) router.push("/auth/login");
    else alert("Signup failed");
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 shadow rounded border">
      <h2 className="text-2xl font-semibold mb-4 text-center">Create Your Account</h2>

      {/* Google Signup */}
      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="bg-red-500 text-white w-full py-2 mb-4 rounded hover:bg-red-600"
      >
        Sign up with Google
      </button>

      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-2 text-gray-500 text-sm">or</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      {/* Email/Password Signup */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          required
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          required
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          required
          className="w-full mb-4 p-2 border rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700">
          Sign up with Email
        </button>
      </form>
    </div>
  );
}
