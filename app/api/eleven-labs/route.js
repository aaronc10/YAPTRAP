import { ElevenLabsClient } from "elevenlabs";

const elevenLabs = new ElevenLabsClient({
  apiKey: process.env.ELEVEN_LABS_API_KEY,
});

await elevenLabs.textToSpeech.convertAsStream("Vpv1YgvVd6CHIzOTiTt8", {
    optimise_streaming_latency: 0,
    output_format: "mp3_22050_32",
    text: "Hello, world!",
    voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5
    }
});

