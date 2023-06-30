"use client";

import { useState } from "react";

export default function FactChecker() {
  const [claim, setClaim] = useState("");
  const [loadingClaims, setLoadingClaims] = useState(false);
  const [loadingVerdict, setLoadingVerdict] = useState(false);
  const [factClaims, setFactClaims] = useState([]);
  const [verdict, setVerdict] = useState(null);

  const [error, setError] = useState(null);

  const submitClaim = async () => {
    // Clear previous error message
    setError(null);

    // Check for empty claim
    if (!claim.trim()) {
      setError("Claim cannot be empty.");
      return;
    }

    setLoadingClaims(true);
    try {
      const resClaims = await fetch(`/api/fact-claims?query=${claim}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const dataClaims = await resClaims.json();
      setFactClaims(dataClaims.factClaims);
      setLoadingClaims(false);
    } catch (error) {
      setError(error.toString());
      setLoadingClaims(false);
    }

    setLoadingVerdict(true);
    const resVerdict = await fetch(`/api/generate-verdict`, {
      method: "POST",
      body: JSON.stringify({ claims: factClaims, query: claim }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const dataVerdict = await resVerdict.json();
    setVerdict(dataVerdict.verdict);
    setLoadingVerdict(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 w-[500px] bg-white rounded shadow-md ">
        {/*... same as before */}
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
        {loadingClaims && <p>Loading Fact Claims...</p>}

        {loadingClaims || factClaims.length === 0 ? (
          <p>No valid fact claims found for the given query.</p>
        ) : (
          factClaims.map((claim, index) => (
            <div key={index} className="border p-2 my-2">
              <h3 className="font-bold">Claim {index + 1}:</h3>
              <p>
                <strong>Text:</strong> {claim.claimText}
              </p>
              <p>
                <strong>Claimant:</strong> {claim.claimant}
              </p>
              <p>
                <strong>Date:</strong> {claim.claimDate}
              </p>
              <p>
                <strong>Reviews:</strong>
              </p>
              {claim.claimReviews.map((review, reviewIndex) => (
                <div key={reviewIndex} className="pl-4">
                  <p>
                    <strong>Publisher:</strong> {review.publisher}
                  </p>
                  <p>
                    <strong>URL:</strong> {review.url}
                  </p>
                  <p>
                    <strong>Title:</strong> {review.title}
                  </p>
                  <p>
                    <strong>Rating:</strong> {review.rating}
                  </p>
                </div>
              ))}
            </div>
          ))
        )}
        {loadingVerdict && <p>Loading Verdict...</p>}
        {verdict && (
          <div className="mt-4">
            <h2 className="font-bold ">Verdict:</h2>
            <section className="whitespace-pre-line">
              {JSON.stringify(verdict)
                .replace(/\\n/g, "\n")
                .replace(/\\t/g, "\t")
                .replace(/\\r/g, "\r")
                .replace(/\\n/g, " ")}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
