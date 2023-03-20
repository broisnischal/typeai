import { useState, useRef, useCallback, useEffect } from "react";
const useCountDownTimer = (seconds: number) => {
  const [timeleft, setTimeleft] = useState(seconds);
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  const startTimer = useCallback(() => {
    console.log("Starting timer");
    intervalRef.current = setInterval(() => {
      setTimeleft((timeleft) => timeleft - 1);
    }, 1000);
  }, [setTimeleft]);

  const resetCount = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setTimeleft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (!timeleft && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [timeleft, intervalRef]);

  return { timeleft, startTimer, resetCount };
};

export default useCountDownTimer;
