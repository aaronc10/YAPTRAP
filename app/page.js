"use client";

import "regenerator-runtime/runtime";
import { useState, useEffect } from "react";
import axios from "axios"
import Microphone from "./components/microphone"
import speech, { useSpeechRecognition } from 'react-speech-recognition';
import TextToSpeech from "./components/TextToSpeech";
import React from "react";
import ReactDom from "react-dom";
import AudioStream from "./components/AudioStream";


export default function FactChecker() {
  const [claim, setClaim] = useState("");
  const [defaultState, setDefaultState] = useState(true);
  const [loadingClaims, setLoadingClaims] = useState(false);
  const [loadingVerdict, setLoadingVerdict] = useState(false);
  const [factClaims, setFactClaims] = useState([]);
  const [verdict, setVerdict] = useState(null);
  const {listening, transcript, resetTranscript} = useSpeechRecognition();
  const [error, setError] = useState(null);
  
  const apiKey = process.env.NEXT_PUBLIC_ELEVEN_LABS_API_KEY;
  
  const [locationState, setLocationState] = useState({
    ip: "",
    countryName: "",
    countryCode: "",
    city: "",
    timezone: ""
  });
  
  

  const handleMicHold = (isHolding) => {
    if (isHolding) {
      resetTranscript();
      setClaim("");
      speech.startListening({ continuous: true });
    } else {
      speech.stopListening();
      if (transcript && transcript.trim() !== "") {
        handleSubmitClaim(transcript);
      }
    }
  };

  const handleSubmitClaim = async (transcriptText) => {
    setError(null);
    
    if (!transcriptText.trim()) {
      setError("Claim cannot be empty.");
      return;
    }
    
    setClaim(transcriptText);
    setLoadingClaims(true);
    try {
      const resClaims = await fetch(`/api/fact-claims?query=${transcriptText}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const dataClaims = await resClaims.json();
      setFactClaims(dataClaims.factClaims || []);
      setLoadingClaims(false);
    } catch (error) {
      setError(error.toString());
      setDefaultState(false);
      setLoadingClaims(false);
      return;
    }

    setLoadingVerdict(true);
    const resVerdict = await fetch(`/api/generate-verdict`, {
      method: "POST",
      body: JSON.stringify({ 
        claims: factClaims, 
        query: transcriptText, 
        city: locationState.city, 
        country: locationState.countryName 
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const dataVerdict = await resVerdict.json();
    setVerdict(dataVerdict.verdict);
    setLoadingVerdict(false);
  };

  useEffect(() => {
    if (!listening && transcript && transcript.trim() !== "") {
      setClaim(transcript);
    }
  }, [listening, transcript]);


  const getGeoInfo = () => {
    axios
      .get("https://ipapi.co/json/")
      .then((response) => {
        let data = response.data;
        setLocationState({
          ip: data.ip,
          countryName: data.country_name,
          countryCode: data.country_calling_code,
          city: data.city,
          timezone: data.timezone
        });
        console.log(locationState)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getGeoInfo();
  }, []);


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="p-6 bg-gray-800 rounded-lg min-w-[300px] max-w-[500px] ">
        {/*... same as before */}
        <h1 className="mb-4 text-2xl font-bold text-center text-white">Bullshit Detector</h1>
          <div className="w-full flex flex-col justify-center items-center pb-4 gap-4">
            <Microphone onMicHold={handleMicHold} />
              {listening ? <p className="text-white">Listening...</p> : <p className="text-white">Tap to detect bullsh!t</p>}
              {claim && <p className="text-white">{claim}</p>}
              {error && <p className="mt-2 text-red-500">{error}</p>}
              {loadingClaims && <p className="text-white">Loading Fact Claims...</p>}
          </div>
        {!defaultState && factClaims.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <p className="text-white">No valid fact claims found for the given query.</p>
          </div>
        ) : (
          factClaims.map((claim, index) => (
            <div key={index} className="p-2 my-2 border">
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
                  <p className="pr-4 overflow-hidden whitespace-normal overflow-ellipsis">
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
        {loadingVerdict && <p className="text-white">Loading Verdict...</p>}
        {verdict && (
          <div className="mt-4 text-white flex flex-col items-center justify-center pb-10">
            <AudioStream text={JSON.stringify(verdict)} voiceId="Vpv1YgvVd6CHIzOTiTt8" apiKey={apiKey} />
            <section className="whitespace-pre-line hidden">
              {JSON.stringify(verdict)
                .replace(/\\n/g, "\n")
                .replace(/\\t/g, "\t")
                .replace(/\\r/g, "\r")
                .replace(/\\n/g, " ")}
            </section>
          </div>
        )}
        <div className="flex flex-col items-center justify-center">
          <p className="text-xs uppercase text-gray-300">Country: {locationState.countryName}</p>
          <p className="text-xs uppercase text-gray-300">City: {locationState.city}</p>
        </div>
      </div>
    </div>
  );
}
