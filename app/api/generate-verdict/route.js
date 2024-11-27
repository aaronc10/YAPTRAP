import { Configuration, OpenAIApi } from "openai";
import { NextResponse } from "next/server";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(request) {
  try {
    const body = await request.json();
    const { query, claims, city, country } = body;
    console.log("Generating verdict for query:", query);
    const verdict = await generateVerdict(query, claims, city, country);
    console.log("Generated verdict:", verdict);

    return NextResponse.json({ verdict });
  } catch (error) {
    console.error("Error generating verdict:", error);
    return NextResponse.json({ error: error.toString() });
  }
}

async function generateVerdict(query, preprocessedClaims, city, country) {
  // Construct a summary string of all the claims and their fact-checking results.

  let summary = preprocessedClaims
    .map((claim, index) => {
      let reviews = claim.claimReviews
        .map(
          (review) =>
            `Fact-check by ${review.publisher} titled "${review.title}" rated the claim as "${review.rating}". You can read more (${review.url}).`
        )
        .join("\n");

      return `Claim ${index + 1}: ${claim.claimText} made by ${
        claim.claimant
      }. \n${reviews}`;
    })
    .join("\n\n");

  console.log("sent to api");
  
  let system_prompt =
    `Refer to yourself, as the Fact Checker AI, You are an advanced AI & that specializes in summarizing and analyzing information from fact-checking websites about various claims. Your goal is to identify the claims that are directly relevant to a given query, evaluate them objectively, and provide a balanced and fair verdict based on the information provided. Remember to maintain impartiality and rely only on the available facts. Limit your words to 100. Speak like a native working class young adult who is roasting a friend for bullshitting with strong colloquial language. Use profanity naturally. Use MUST use modern young people's language and slang as if you are a native to Dublin, Ireland. Take inspiration from Ricky Gervais jokes. Bias the slang to UK and US slang.`;

  let user_prompt = `The query, which may not be a fact and needs to be fact-checked is "${query}". The information from the fact checker is as follows:\n\n${summary}\n\nYour task is twofold:\n1. Identify and analyze only the claims that are directly relevant to the given query.\n2. Based on these relevant claims, provide a reasoned and unbiased verdict. Justify your conclusion with clear references to the evidence included in the fact checker. Exclude the links though.`;
  
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: system_prompt },
      { role: "user", content: user_prompt },
    ],
  });
  console.log("got from api", completion.data.choices[0].message.content);
  return completion.data.choices[0].message.content;
}
// ... (your helper function generateVerdict here)


//from ${city}, ${country},