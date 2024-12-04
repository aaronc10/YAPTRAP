"use client";

import "regenerator-runtime/runtime";
import { useState, useEffect, useCallback } from "react";
import axios from "axios"
import Microphone from "./components/microphone"
import speech, { useSpeechRecognition } from 'react-speech-recognition';
import TextToSpeech from "./components/texttospeech";
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
  const [screen, setScreen] = useState("main");

  
  const apiKey = process.env.NEXT_PUBLIC_ELEVEN_LABS_API_KEY;
  
  const [locationState, setLocationState] = useState({
    ip: "",
    countryName: "",
    countryCode: "",
    city: "",
    timezone: ""
  });

  const handleAudioStream = useCallback(() => {
    setScreen("verdict");
  }, []);

  const handleMicHold = (isHolding) => {
    if (isHolding) {
      resetTranscript();
      setClaim("");
      speech.startListening({ continuous: true });
    } else {
      speech.stopListening();
      if (transcript && transcript.trim() !== "") {
        handleSubmitClaim(transcript);
        setScreen("loading");
      }
    }
  };

  const testClaim = () => {
    handleSubmitClaim("Google");
    setScreen("loading");
  } 

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
    if(dataVerdict.verdict) {
      setScreen("loading");
    }
    console.log('audio buffering');
  };

  useEffect(() => {
    if (!listening && transcript && transcript.trim() !== "") {
      setClaim(transcript);
    }
  }, [listening, transcript]);


  const getGeoInfo = useCallback(() => {
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
  }, [locationState]);

  useEffect(() => {
    getGeoInfo();
  }, [getGeoInfo]);


  // Screen Components 

  const Header = () => {
    const handleHeaderClick = () => {
      setVerdict(null);
      setClaim("");
      setScreen("main");
    }

    return (
      <div className="absolute top-10 left-0 w-full h-10 flex flex-row justify-center items-center cursor-pointer" onClick={handleHeaderClick}>
        <h1 className="font-OT2049-black mb-4 text-4xl font-bold text-center text-white">YAPTRAP</h1>
      </div>
    );
  };

  const MainScreen = () => {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary flex-col">
    <div className="p-6 rounded-lg min-w-[300px] max-w-[500px] ">
      {/*... same as before */}
        <div className="w-full flex flex-col justify-center items-center pb-4 gap-20">
            {listening ? <p className="text-2xl font-OT2049-thin text-white">Listening...</p> : <p className="text-2xl font-OT2049-thin text-white">HOLD TO YAP</p>}
          <Microphone onMicHold={handleMicHold} />
          <button onClick={testClaim} className="bg-white text-primary p-2 rounded-lg">Test Claim</button>

        </div>
      </div>
      </div>
    );
  };

  const LoadingScreen = () => {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary flex-col">
            <p className="text-2xl font-OT2049-thin text-white">SCANNING FOR CAP</p>
            {claim && <p className="text-white">{claim}</p>}
            {error && <p className="mt-2 text-red-500">{error}</p>}
            {loadingClaims && <p className="text-white">Loading Fact Claims...</p>}
      </div>
    );
  };

  const FactClaimsScreen = () => {
    return (
      <div className="flex items-center justify-center w-full bg-primary flex-col">
        {!defaultState && factClaims.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <p className="text-white">No valid fact claims found for the given query.</p>
          </div>
        ) : (
          factClaims.slice(0, 5).map((claim, index) => (
            <div key={index} className="font-neueMontreal w-full p-2 my-2 bg-white/5 rounded-lg flex flex-col gap-2">
                <div className="flex flex-row gap-4">
                    <h3 className="text-white font-bold">{index + 1}</h3>
                    <p className="text-white">
                  {claim.claimText}
                  </p>
                </div>
                
                <p className="text-white hidden">
                <strong>Claimant:</strong> {claim.claimant}
              </p>
              <p className="text-white hidden">
                <strong>Date:</strong> {claim.claimDate}
              </p>
              <p className="text-white hidden">
                <strong>Reviews:</strong>
              </p>
              {claim.claimReviews.slice(0, 1).map((review, reviewIndex) => (
                <div key={reviewIndex} className="flex flex-row gap-2 hidden">
                  <p className="text-white">
                    {review.publisher}
                  </p>
                  <p className="overflow-hidden whitespace-normal overflow-ellipsis text-white hidden">
                    <strong>URL:</strong> {review.url}
                  </p>
                  <p className="text-white hidden">
                    <strong>Title:</strong> {review.title}
                  </p>
                  <p className="text-white/50 max-h-[30px] overflow-hidden">
                    {review.rating}
                  </p>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    );
  };

  const VerdictScreen = () => {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary flex-col">
        {verdict && (
          <div className="mt-4 font-OT2049-thin uppercase text-2xl text-white flex flex-col items-center justify-center pb-10">
            <section className="whitespace-pre-line">
              {JSON.stringify(verdict)
                .replace(/\\n/g, "\n")
                .replace(/\\t/g, "\t")
                .replace(/\\r/g, "\r")
                //.replace(/\\n/g, " ")
                }
            </section>
            
            
          </div>
        )}
            <FactClaimsScreen />
      </div>
    );
  };



  return (
    <div className="flex flex-col items-center justify-center pl-10 pr-10 pt-20 pb-10 bg-primary">
      <Header />
      <AudioStream 
        screen={screen} 
        text={verdict} 
        voiceId="1TE7ou3jyxHsyRehUuMB" 
        apiKey={apiKey} 
        handleAudioStream={handleAudioStream} 
        voiceSettings={{
              stability: 0.1,
              similarity_boost: 0.1
            }}/>
      {screen === "main" && <MainScreen />}
      {screen === "loading" && <LoadingScreen />}
      {screen === "verdict" && <VerdictScreen />}
    </div>
  );
}
