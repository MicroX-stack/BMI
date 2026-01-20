"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      router.push("/dashboard")
    } else {
      const data = await res.json()
      setError(data.error || "Login failed")
    }
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="webtest@gmail.com"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <div className="flex justify-start">
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>

        <div className="mt-6 p-4 bg-slate-100 rounded-lg text-sm border border-slate-200">
          <p className="font-semibold mb-2 text-slate-700">
            Testing Account:
          </p>
          <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 items-center">
            <span className="text-slate-500">Username:</span>
            <div className="flex items-center gap-2">
              <code className="font-mono text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                anucha@gmail.com
              </code>
              <button
                onClick={() => copyToClipboard("anucha@gmail.com", "username")}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-2 py-1 rounded border border-blue-100 transition-colors"
                title="Copy username"
              >
                {copiedField === "username" ? "Copied!" : "Copy"}
              </button>
            </div>
            <span className="text-slate-500">Password:</span>
            <div className="flex items-center gap-2">
              <code className="font-mono text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                oooooo
              </code>
              <button
                onClick={() => copyToClipboard("oooooo", "password")}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-2 py-1 rounded border border-blue-100 transition-colors"
                title="Copy password"
              >
                {copiedField === "password" ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
