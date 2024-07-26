import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const breachTimesUTC = ["02:00", "10:00", "19:00"];
  const [nextBreach, setNextBreach] = useState("");
  const [timeRemaining, setTimeRemaining] = useState("");

  const calculateTimeRemaining = (currentTime, breachTime) => {
    const now = new Date(currentTime);
    const breach = new Date(currentTime);
    const [hours, minutes] = breachTime.split(":");
    breach.setUTCHours(hours, minutes, 0, 0);

    if (breach <= now) {
      breach.setUTCDate(breach.getUTCDate() + 1);
    }

    return breach - now;
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      let nextBreachTime = "";
      let shortestTime = Number.MAX_SAFE_INTEGER;

      breachTimesUTC.forEach((breachTime) => {
        const timeRemaining = calculateTimeRemaining(now, breachTime);
        if (timeRemaining < shortestTime) {
          shortestTime = timeRemaining;
          nextBreachTime = breachTime;
        }
      });

      const nextBreachDate = new Date(now);
      const [nextBreachHours, nextBreachMinutes] = nextBreachTime.split(":");
      nextBreachDate.setUTCHours(nextBreachHours, nextBreachMinutes, 0, 0);

      if (nextBreachDate <= now && now - nextBreachDate <= 15 * 60 * 1000) {
        setTimeRemaining("Breach now!");
      } else {
        setTimeRemaining(formatTime(shortestTime));
      }

      setNextBreach(nextBreachTime);
    };

    const intervalId = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="App">
      <h1 style={{fontSize:'32px'}}>When is the next breach?</h1>
      <p>Next breach at: {nextBreach} UTC</p>
      <p>Time remaining: {timeRemaining}</p>
    </div>
  );
}

export default App;
