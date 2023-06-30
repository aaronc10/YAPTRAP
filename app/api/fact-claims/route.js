import { Configuration, OpenAIApi } from "openai";
import { NextResponse } from "next/server";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// ... (your helper function preprocessClaim here)
function preprocessClaim(claim) {
  return {
    claimText: claim.text ? claim.text : "N/A",
    claimant: claim.claimant ? claim.claimant : "N/A",
    claimDate: claim.claimDate ? claim.claimDate.slice(0, 10) : "N/A",
    claimReviews: claim.claimReview
      ? claim.claimReview.map((review) => ({
          publisher:
            review.publisher && review.publisher.name
              ? review.publisher.name
              : "N/A",
          url: review.url ? review.url : "N/A",
          title: review.title ? review.title : "N/A",
          rating: review.textualRating ? review.textualRating : "N/A",
        }))
      : [],
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
    console.log("Found claims in the response.", data.claims);
    let preprocessedClaims = data.claims.map(preprocessClaim);
    return preprocessedClaims;
  } else {
    console.error("No valid claims found in the response.");
    return []; // returning an empty array when there are no claims
  }
}
