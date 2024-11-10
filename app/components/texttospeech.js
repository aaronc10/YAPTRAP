"use client";

export default function TextToSpeech({text}) {  
    const speak = async () => {
        try {
            const response = await fetch('/api/eleven-labs', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({text}),
            });
            
            if (!response.ok) throw new Error("Failed to fetch audio");
            
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play();
        } catch (error) {
            console.error("Error speaking text:", error);
        }
    };

    return (
        <button 
            onClick={speak}
            className="bg-gray-200 text-white p-2 rounded-full w-20 h-20 flex justify-center items-center hover:bg-gray-700">
            <img src="/microphone.svg" alt="microphone" className="w-6 h-6" />
        </button>
    );
}