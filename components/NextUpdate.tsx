import React, { useState, useEffect } from 'react';

interface NextUpdateProps {
  timeUntilUpdateInSeconds: number;
}

const NextUpdate: React.FC<NextUpdateProps> = ({ timeUntilUpdateInSeconds }) => {
  const [countdown, setCountdown] = useState(timeUntilUpdateInSeconds);

  useEffect(() => {
    setCountdown(timeUntilUpdateInSeconds);
    
    if (timeUntilUpdateInSeconds <= 0) return;

    const timer = setInterval(() => {
      setCountdown(prevCountdown => (prevCountdown > 0 ? prevCountdown - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeUntilUpdateInSeconds]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full h-full flex flex-col justify-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Next Update</h2>
      <div className="text-center">
        <p className="text-gray-600">The next update will happen in:</p>
        <p className="text-xl font-mono text-gray-800 mt-2">
          {countdown > 0 ? formatTime(countdown) : "Updating now..."}
        </p>
      </div>
    </div>
  );
};

export default NextUpdate;