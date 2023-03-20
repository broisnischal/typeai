import { faker } from "@faker-js/faker";
import { useState, useCallback } from "react";

const generatedWords = (count: number) => {
  return faker.random.words(count).toLowerCase();
};

const useWords = (count: number) => {
  const [words, setWords] = useState<string>(generatedWords(count));

  const updateWords = useCallback(() => {
    setWords(generatedWords(count));
  }, [count]);

  return { words, updateWords };
};

export default useWords;
