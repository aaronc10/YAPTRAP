// AudioStream.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

interface VoiceSettings {
  stability: number;
  similarity_boost: number;
}

interface AudioStreamProps {
  voiceId: string;
  text: string;
  apiKey: string;
  voiceSettings: VoiceSettings;
  screen: string;
  handleAudioStream: () => void;
}

const AudioStream: React.FC<AudioStreamProps> = ({
  voiceId,
  text,
  apiKey,
  voiceSettings,
  screen,
  handleAudioStream,

}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);


  const startStreaming = async () => {
    setLoading(true);
    console.log("loading voice:", {voiceId, text, voiceSettings, hasAPIKey: !!apiKey, screen});
    setError("");

    const baseUrl = "https://api.elevenlabs.io/v1/text-to-speech";
    const headers = {
      "Content-Type": "application/json",
      "xi-api-key": apiKey,
    };

    const requestBody = {
      text,
      voice_settings: voiceSettings,
    };

    console.log("Starting streaming:", {voiceId, text, voiceSettings, hasAPIKey: !!apiKey, screen});

    try {
      const response = await axios.post(`${baseUrl}/${voiceId}`, requestBody, {
        headers,
        responseType: "blob",
      });

      if (response.status === 200) {
        const audio = new Audio(URL.createObjectURL(response.data));
        // Event Listeners
        audio.addEventListener("ended", () => { setIsStreaming(false);});
        audio.addEventListener("play", () => { setIsStreaming(true); handleAudioStream();
        console.log("audio playing");

        });
        audio.play();

        console.log("isStreaming", isStreaming);

      } else {
        setError("Error: Unable to stream audio.");
      }
    } catch (error) {
      setError("Error: Unable to stream audio.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (text && screen === "loading") {
      console.log("audio buffering", text);
      startStreaming();
    }
  }, [text, screen]);

  return (
    <div className="flex flex-col items-center justify-center p-8 hidden">
      <button onClick={startStreaming} disabled={loading} className="bg-blue-600 text-gray-100 rounded-sm p-2 w-auto h-10 flex justify-center items-center hover:bg-gray-700 transition-colors duration-300">
        {loading ? "Checking your bullshit..." : "Hear the Truth"}
      </button>
      {error && <p className="text-gray-500">{error}</p>}
    </div>
  );
};

export default AudioStream;
