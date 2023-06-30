import { Configuration, OpenAIApi } from "openai";
import { NextResponse } from "next/server";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// ... (your helper function preprocessClaim here)
function preprocessClaim(claim) {
  return {
    claimText: claim.text,
    claimant: claim.claimant,
    claimDate: claim.claimDate.slice(0, 10), // Extract only the date part of the ISO string.
    claimReviews: claim.claimReview.map((review) => ({
      publisher: review.publisher.name,
      url: review.url,
      title: review.title,
      rating: review.textualRating,
    })),
  };
}
export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const claims = searchParams.get("query");
  try {
    const factClaims = await fetch_fact_claims(claims);
    return NextResponse.json({ factClaims });
  } catch (error) {
    return NextResponse.json({ error: error.toString() });
  }
}

async function fetch_fact_claims(query) {
  const response = await fetch(
    `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${query}&key=${process.env.KEY}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (response.status !== 200) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  if (data && data.claims && Array.isArray(data.claims)) {
    let preprocessedClaims = data.claims.map(preprocessClaim);
    return preprocessedClaims;
  } else {
    console.error("No valid claims found in the response.");
    return { "verdict": "No valid claims found in the response." };
  }
}
