"use client";

import { useState } from "react";

export default function SeedAdmin() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSeed() {
    try {
      setLoading(true);
      setStatus("Seeding administrator account...");

      const res = await fetch("/api/seed-admin", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(data.message || "Failed to seed admin.");
        return;
      }

      setStatus(data.message);
    } catch (error) {
      console.error(error);
      setStatus("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">

        <h1 className="text-3xl font-bold text-center">
          TitanPOS
        </h1>

        <p className="mt-2 text-center text-gray-500">
          Seed Administrator Account
        </p>

        <button
          onClick={handleSeed}
          disabled={loading}
          className="mt-8 w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Seeding..." : "Seed Admin"}
        </button>

        {status && (
          <div className="mt-6 rounded-lg border bg-slate-50 p-4 text-sm text-slate-700">
            {status}
          </div>
        )}
      </div>
    </main>
  );
}