
"use client";

function Microphone({onMicHold, submitClaim}) {

  const handleTouchStart = () => {
    console.log("touch start");
      onMicHold(true);
  }

  const handleTouchEnd = () => {
    console.log("touch end");
      onMicHold(false);
      submitClaim();
  }

  return <button 
  //onTouchStart={handleTouchStart} 
  //onTouchEnd={handleTouchEnd} 
  onMouseDown={handleTouchStart}
  onMouseUp={handleTouchEnd}
  className="bg-red-800 text-white p-2 rounded-full hover:bg-gray-800">
      <img src="/microphone.svg" alt="microphone" className="w-6 h-6" />
  </button>;
}

export default Microphone;