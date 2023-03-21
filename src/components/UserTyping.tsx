import React, { useEffect, useMemo } from "react";
import Caret from "./Caret";
import cn from "classnames";
import useEngine from "../hooks/useEngine";
import { useCallback } from "react";

const UserTypings = ({
  userInput,
  className,
  words,
}: {
  userInput: string;
  className?: string;
  words: string;
}) => {
  const TypedCharacters: string[] = userInput.split("");

  return (
    <div className={className}>
      {TypedCharacters.map((char, index) => (
        <Character key={index + "_" + char} actual={char} expected={words[index]} />
      ))}
      <Caret />
    </div>
  );
};

const Character = ({ actual, expected }: { actual: string; expected: string }) => {
  const isCorrect = actual === expected;
  const isWhiteSpace = expected === " ";

  return (
    <span
      className={cn({
        "text-red-500": !isCorrect && !isWhiteSpace,
        "text-primary-400": isCorrect && !isWhiteSpace,
        "bg-red-500/50": !isCorrect && isWhiteSpace,
        "border-b-4 border-white/5": isCorrect && isWhiteSpace,
      })}
    >
      {expected}
    </span>
  );
};

export default UserTypings;
