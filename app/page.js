"use client";
import { useState } from "react";

export default function FactChecker() {
  const [claim, setClaim] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const submitClaim = async () => {
    // Clear previous error message
    setError(null);

    // Check for empty claim
    if (!claim.trim()) {
      setError("Claim cannot be empty.");
      return;
    }

    setLoading(true);
    const res = await fetch(`/api/check-fact?query=${claim}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setResponse(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 min-w-[400px] bg-white rounded shadow-md w-80">
        <h1 className="text-2xl font-bold mb-4 text-center">Fact Checker</h1>
        <div className="relative">
          <input
            type="text"
            className="w-full p-2 pl-10 border rounded"
            placeholder="Enter a claim..."
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
          />
          <svg
            className="w-6 h-6 absolute left-3 top-3 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </div>
        <button
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-500 mt-4"
          onClick={submitClaim}>
          Submit
        </button>
        {error && <p className="mt-2 text-red-500">{error}</p>}
        {loading && <p>Loading...</p>}
        {response && (
          <div className="mt-4">
            <h2 className="font-bold">Response:</h2>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(response.verdict, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
