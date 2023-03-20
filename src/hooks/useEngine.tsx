import { useState, useCallback, useEffect } from "react";
import useWords from "./useWords";
import useCountDownTimer from "./useCountDownTimer";
import useTypings from "./useTypings";
import { countErrors } from "../utils/helpers";

export type State = "start" | "run" | "finish";

const useEngine = () => {
  const [SECOND, setSecond] = useState<number>(30);
  const [NUMBER_OF_WORDS, setNumberWords] = useState<number>(12);

  const [state, setState] = useState<State>("start");
  const { words, updateWords } = useWords(NUMBER_OF_WORDS);
  const { timeleft, startTimer, resetCount } = useCountDownTimer(SECOND);
  const { typed, cursor, clearTyped, resetTotalTyped, totalTyped } = useTypings(state !== "finish");

  const [errors, setErrors] = useState(0);
  const isStarting = state === "start" && cursor > 0;
  const wordFinished = cursor === words.length;

  useEffect(() => {
    restart();
  }, [SECOND, NUMBER_OF_WORDS]);

  const sumErrors = useCallback(() => {
    const wordReached = words.substring(0, cursor);
    setErrors((prevErrors) => (prevErrors += countErrors(typed, wordReached)));
  }, [typed, words, cursor]);

  useEffect(() => {
    if (isStarting) {
      setState("run");
      startTimer();
    }
  }, [isStarting, setState, startTimer]);

  useEffect(() => {
    if (!timeleft) {
      setState("finish");
      sumErrors();
    }
  }, [timeleft, sumErrors]);

  useEffect(() => {
    if (wordFinished) {
      sumErrors();
      updateWords();
      clearTyped();
    }
  }, [cursor, words, clearTyped, typed, wordFinished, updateWords, sumErrors]);

  const restart = useCallback(() => {
    clearTyped();
    resetCount();
    resetTotalTyped();
    setErrors(0);
    setState("start");
    updateWords();
  }, [clearTyped, updateWords, resetCount, resetTotalTyped]);

  return {
    state,
    totalTyped,
    restart,
    setNumberWords,
    setSecond,
    errors,
    words,
    timeleft,
    startTimer,
    resetCount,
    typed,
    NUMBER_OF_WORDS,
  };
};

export default useEngine;
