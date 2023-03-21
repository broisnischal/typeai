import { useState, useRef, useCallback, useEffect } from "react";
const useCountDownTimer = (seconds: number) => {
  const [timeleft, setTimeleft] = useState(seconds);
  const intervalRef = useRef<any | null>(null);

  const startTimer = useCallback(() => {
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
