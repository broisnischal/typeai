import { useState, useCallback, useEffect } from "react";
import useWords from "./useWords";
import useCountDownTimer from "./useCountDownTimer";
import useTypings from "./useTypings";
import { countErrors } from "../utils/helpers";
// import { initialState } from "../App";

export type State = "start" | "run" | "finish";

export const initialState = JSON.parse(localStorage.getItem("mainState") as string) ?? {
  second: 30,
  words: 30,
  restart: false,
  break: false,
  font: "monospace",
  wide: true,
};

const useEngine = () => {
  const [mainState, setMainState] = useState({ ...initialState });

  const [SECOND, setSecond] = useState<number>(mainState.second);
  const [NUMBER_OF_WORDS, setNumberWords] = useState<number>(mainState.words);

  const [state, setState] = useState<State>("start");
  const { words, updateWords } = useWords(NUMBER_OF_WORDS);
  const { timeleft, startTimer, resetCount } = useCountDownTimer(SECOND);
  const { typed, cursor, clearTyped, resetTotalTyped, totalTyped } = useTypings(state !== "finish");

  const [errors, setErrors] = useState(0);
  const isStarting = state === "start" && cursor > 0;
  const wordFinished = cursor === words.length;

  useEffect(() => {
    localStorage.setItem("mainState", JSON.stringify(mainState));
  }, [mainState]);

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
  }, [timeleft, sumErrors, setState]);

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
    SECOND,
    mainState,
    setMainState,
  };
};

export default useEngine;
