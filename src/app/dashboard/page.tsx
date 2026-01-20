"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { interpretBMI } from "@/lib/bmi"

interface BMIRecord {
  id: number
  weight: number
  height: number
  bmi: number
  recorded_at: string
  note?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [records, setRecords] = useState<BMIRecord[]>([])
  const [formData, setFormData] = useState({ weight: "", height: "", note: "" })
  const [loading, setLoading] = useState(true)

  const fetchRecords = async () => {
    try {
      const res = await fetch("/api/records")
      if (res.status === 401) {
        router.push("/login")
        return
      }
      const data = await res.json()
      setRecords(data)
    } catch (error) {
      console.error("Failed to fetch records", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecords()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        note: formData.note,
      }),
    })

    if (res.ok) {
      setFormData({ weight: "", height: "", note: "" })
      fetchRecords()
    }
  }

  const chartData = [...records]
    .sort(
      (a, b) =>
        new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
    )
    .map((r) => ({
      date: new Date(r.recorded_at).toLocaleDateString(),
      bmi: r.bmi,
      weight: r.weight,
    }))

  const latestRecord = records[0]

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">BMI Dashboard</h1>
          <button
            onClick={async () => {
              // Simple logout by clearing cookie (client-side only for demo)
              document.cookie = "token=; Max-Age=0; path=/;"
              router.push("/login")
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Latest Stat */}
        {latestRecord && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Latest Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded">
                <p className="text-gray-500">BMI</p>
                <p className="text-3xl font-bold text-blue-600">
                  {latestRecord.bmi}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded">
                <p className="text-gray-500">Result</p>
                <p className="text-3xl font-bold text-green-600">
                  {interpretBMI(latestRecord.bmi)}
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded">
                <p className="text-gray-500">Weight</p>
                <p className="text-3xl font-bold text-purple-600">
                  {latestRecord.weight} kg
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Input Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">New Record</h2>
          <form onSubmit={handleSubmit} className="flex gap-4 items-end flex-wrap">
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                Weight (kg)
              </label>
              <input
                id="weight"
                type="number"
                step="0.1"
                required
                className="mt-1 px-3 py-2 border rounded-md"
                value={formData.weight}
                onChange={(e) =>
                  setFormData({ ...formData, weight: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                Height (cm)
              </label>
              <input
                id="height"
                type="number"
                step="0.1"
                required
                className="mt-1 px-3 py-2 border rounded-md"
                value={formData.height}
                onChange={(e) =>
                  setFormData({ ...formData, height: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                Note
              </label>
              <input
                id="note"
                type="text"
                className="mt-1 px-3 py-2 border rounded-md"
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Record
            </button>
          </form>
        </div>

        {/* Charts */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">BMI Trend (All Time)</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="bmi"
                  stroke="#2563eb"
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="weight"
                  stroke="#82ca9d"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">History</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weight (kg)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Height (cm)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  BMI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interpretation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Note
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(record.recorded_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.weight}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.height}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {record.bmi}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {interpretBMI(record.bmi)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.note || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
