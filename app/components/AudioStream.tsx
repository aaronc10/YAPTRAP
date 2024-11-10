
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
}

const AudioStream: React.FC<AudioStreamProps> = ({
  voiceId,
  text,
  apiKey,
  voiceSettings,
  
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);


  const startStreaming = async () => {
    setLoading(true);
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

    try {
      const response = await axios.post(`${baseUrl}/${voiceId}`, requestBody, {
        headers,
        responseType: "blob",
      });

      if (response.status === 200) {
        const audio = new Audio(URL.createObjectURL(response.data));
        audio.play();
        
        // Event Listeners
        audio.addEventListener("ended", () => { setIsStreaming(false);});
        audio.addEventListener("play", () => { setIsStreaming(true);});

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
    if (text) {
      startStreaming();
    }
  }, [text]);

  return (
    <div>
      <button onClick={startStreaming} disabled={loading} className="bg-blue-600 text-white rounded-sm p-2 w-auto h-10 flex justify-center items-center hover:bg-gray-700 transition-colors duration-300">
        {loading ? "Checking your bullshit..." : "Hear the Truth"}
      </button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default AudioStream;
