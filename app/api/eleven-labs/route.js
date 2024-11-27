import { ElevenLabsClient } from "elevenlabs";
import { NextResponse } from "next/server";

const elevenLabs = new ElevenLabsClient({
  apiKey: process.env.NEXT_PUBLIC_ELEVEN_LABS_API_KEY,
});

export async function POST(request) {
  try {
    const { text } = await request.json();
    const audioStream = await elevenLabs.textToSpeech.convertAsStream("1TE7ou3jyxHsyRehUuMB", {
      optimise_streaming_latency: 0,
      output_format: "mp3_22050_32",
      text: text,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5
      }
    });

    return new NextResponse(audioStream, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error("Eleven Labs API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



//Vpv1YgvVd6CHIzOTiTt8 spanish male