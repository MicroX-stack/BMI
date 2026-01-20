import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">BMI Web Application</h1>
        <p className="text-xl text-gray-600">
          Track your health journey with our easy-to-use BMI calculator and history tracker.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/login"
            className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 text-blue-600 bg-white border border-blue-600 rounded-lg hover:bg-blue-50"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
