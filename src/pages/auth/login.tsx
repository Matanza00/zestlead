'use client';
import { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    if (res?.ok) router.push("/");
    else alert("Login failed");
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 shadow rounded border">
      <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>

      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="bg-red-500 text-white w-full py-2 mb-4 rounded hover:bg-red-600"
      >
        Continue with Google
      </button>

      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-2 text-gray-500 text-sm">or</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <form onSubmit={handleSubmit}>
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
          Login with Email
        </button>
      </form>
    </div>
  );
}
