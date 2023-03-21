import { useEffect, useRef, useState, useCallback } from "react";

const isKeyCodeAllowed = (event: KeyboardEvent) => {
  if (navigator.userAgent.indexOf("Firefox") != -1) {
    //some specific code for Mozilla

    if (event.ctrlKey) {
      if (event.key === "r") {
        window.location.reload();
      }

      if (event.key === "f") {
      }

      return false;
    }
  }

  const code = event.code;
  return (
    code.startsWith("Key") ||
    code.startsWith("Digit") ||
    code === "Backspace" ||
    code === "Space" ||
    code === "Slash" ||
    code === "Period" ||
    code === "Quote" ||
    code === "Semicolon" ||
    code === "Comma" ||
    code === "Backslash" ||
    code === "#" ||
    code === "%" ||
    code === "^" ||
    code === ")" ||
    code === "(" ||
    code === "BracketLeft" ||
    code === "BracketRight" ||
    code === "<" ||
    code === ">"
  );
};

const useTypings = (enabled: boolean) => {
  const [cursor, setCursor] = useState(0);

  const [typed, setTyped] = useState<string>("");

  const totalTyped = useRef(0);

  const keyboardHandler = useCallback(
    (event: KeyboardEvent) => {
      if (navigator.userAgent.indexOf("Firefox") != -1) {
        //some specific code for Mozilla
        event.preventDefault();
      }
      event.stopPropagation();
      const { key, code } = event;
      if (!enabled || !isKeyCodeAllowed(event)) return;

      switch (key) {
        case "Backspace":
          setTyped((prev) => prev.slice(0, -1));
          setCursor(cursor - 1);
          totalTyped.current === 0 ? null : (totalTyped.current -= 1);
          break;
        default:
          setTyped((prev) => prev.concat(key));
          setCursor(cursor + 1);
          totalTyped.current += 1;
      }
    },
    [enabled, cursor]
  );

  const clearTyped = useCallback(() => {
    setTyped("");
    setCursor(0);
  }, []);

  const resetTotalTyped = useCallback(() => {
    totalTyped.current = 0;
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", keyboardHandler);

    return () => {
      window.removeEventListener("keydown", keyboardHandler);
    };
  }, [keyboardHandler]);

  return {
    typed,
    cursor,
    clearTyped,
    resetTotalTyped,
    totalTyped: totalTyped.current,
  };
};

export default useTypings;
