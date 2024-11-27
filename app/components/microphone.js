"use client";

function Microphone({onMicHold}) {
  const handleTouchStart = () => {
    console.log("touch start");
    onMicHold(true);
  }

  const handleTouchEnd = () => {
    console.log("touch end");
    onMicHold(false);
  }

  return (
    <div className="relative">
      {/* Pulse animation ring */}
      <div className="absolute -inset-1 bg-gray-600 rounded-full animate-pulse opacity-75"></div>
      
      {/* Main button */}
      <button 
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        className="relative bg-white text-white p-2 rounded-full w-[150px] h-[150px] flex justify-center items-center 
                 hover:bg-gray-700 transition-all duration-300
                 active:scale-90 
                 before:content-[''] before:absolute before:inset-0 before:rounded-full before:bg-white before:animate-ping before:opacity-20
                 after:content-[''] after:absolute after:inset-0 after:rounded-full after:bg-white after:animate-pulse after:opacity-40"
      >
        <img src="/yapicon.svg" alt="microphone" className="w-[80px] h-[80px] relative z-10" />
      </button>
    </div>
  );
}

export default Microphone;