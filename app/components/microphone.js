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

  return <button 
    onMouseDown={handleTouchStart}
    onMouseUp={handleTouchEnd}
    className="bg-gray-600 text-white p-2 rounded-full w-20 h-20 flex justify-center items-center hover:bg-gray-700 transition-colors duration-300">
    <img src="/microphone.svg" alt="microphone" className="w-6 h-6" />
  </button>;
}

export default Microphone;