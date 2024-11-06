"use client";

import "regenerator-runtime/runtime";
import { useState, useEffect } from "react";
import axios from "axios"
import Microphone from "./components/microphone"
import speech, { useSpeechRecognition } from 'react-speech-recognition';


export default function FactChecker() {
  const [claim, setClaim] = useState("");
  const [defaultState, setDefaultState] = useState(true);
  const [loadingClaims, setLoadingClaims] = useState(false);
  const [loadingVerdict, setLoadingVerdict] = useState(false);
  const [factClaims, setFactClaims] = useState([]);
  const [verdict, setVerdict] = useState(null);
  const {listening, transcript} = useSpeechRecognition();
  const [transcriptState, setTranscriptState] = useState("");


  
  

  const handleMicHold = (isHolding) => {
    if (isHolding) {
      setTranscriptState("");
      setClaim("");
      console.log("mic hold");
      speech.startListening({ continuous: true });

    } else {
      speech.stopListening();
    }
  };


  // store transcript in state
  speech.onResult = async (event) => {
    const transcript = event.results[0][0].transcript;
    console.log('transcript', transcript);
    setTranscriptState(transcript);
  }


  // handle speech recognition & send to claim
  // const handleSpeechRecognition = (transcript) => {
  //   setClaim(transcript);
  
  // }
  

  const [error, setError] = useState(null);

  const [locationState, setLocationState] = useState({
    ip: "",
    countryName: "",
    countryCode: "",
    city: "",
    timezone: ""
  });

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
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getGeoInfo();
  }, []);

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
    }

    setLoadingVerdict(true);
    const resVerdict = await fetch(`/api/generate-verdict`, {
      method: "POST",
      body: JSON.stringify({ claims: factClaims, query: claim, city: locationState.city, country: locationState.countryName }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log('got from api',resVerdict)
    const dataVerdict = await resVerdict.json();
    setVerdict(dataVerdict.verdict);
    setLoadingVerdict(false);
  };

  useEffect(() => {
    if (!listening && transcript) {
      setClaim(transcript);
    }
  }, [listening, transcript]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md min-w-[300px] max-w-[500px] ">
        {/*... same as before */}
        <h1 className="mb-4 text-2xl font-bold text-center">Bullshit Detector</h1>
        <div className="w-full flex flex-col justify-center items-center pb-4 gap-4">
          <Microphone onMicHold={handleMicHold} submitClaim={submitClaim} />
          {listening ? <p>Listening...</p> : <p>Tap to detect bullsh!t</p>}
          {claim && <p>{claim}</p>}
        </div>
        {/* <div className="relative">
          <input
            type="text"
            className="w-full p-2 pl-10 border rounded"
            placeholder="Enter a claim..."
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
          />
        </div>
        <button
          className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-500"
          onClick={submitClaim}>
          Submit
        </button> */}
        {error && <p className="mt-2 text-red-500">{error}</p>}
        {loadingClaims && <p>Loading Fact Claims...</p>}

        {!defaultState && factClaims.length === 0 ? (
          <p>No valid fact claims found for the given query.</p>
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
        <div className="flex flex-col items-center justify-center">
          <p className="text-xs uppercase text-gray-300">Country: {locationState.countryName}</p>
          <p className="text-xs uppercase text-gray-300">City: {locationState.city}</p>
        </div>
      </div>
    </div>
  );
}
