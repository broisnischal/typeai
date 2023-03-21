import React from "react";
import "./App.css";
import { ReactElement, useEffect, useState } from "react";
import RestartButton from "./components/Restart";
import Results from "./components/Results";
import UserTypings from "./components/UserTyping";
import Caret from "./components/Caret";
import useEngine from "./hooks/useEngine";
import { countAccuracyPercentage } from "./utils/helpers";
import { AiFillSetting } from "react-icons/ai";
import cb from "classnames";
import { easeInOut, motion } from "framer-motion";
import Button from "./components/TimeButton";

export type fonts = [
  "monospace",
  "sans",
  "inter",
  "Poppins",
  "Roboto",
  "Nunito",
  "Open Sans",
  "Fira code",
  "Fira mono"
];

function App() {
  const {
    state,
    restart,
    setSecond,
    setNumberWords,
    words,
    timeleft,
    resetCount,
    totalTyped,
    NUMBER_OF_WORDS,
    typed,
    errors,
  } = useEngine();

  // function keyDownListener(e: Event) {
  //   console.log(e);
  // }

  // useEffect(() => {
  //   window.addEventListener("keydown", keyDownListener, true);

  //   return window.removeEventListener("keydown", keyDownListener, true);
  // }, [keyDownListener]);

  const [autoRestart, setAutoRestart] = useState<boolean>(false);
  const [modelOpen, setModelOpen] = useState<boolean>(false);
  const [wide, setWide] = useState();

  const [fonts, setFonts] = useState<fonts>([
    "monospace",
    "sans",
    "inter",
    "Poppins",
    "Roboto",
    "Nunito",
    "Open Sans",
    "Fira code",
    "Fira mono",
  ]);

  const [font, setFont] = useState("monospace");

  useEffect(() => {
    if (state === "finish" && autoRestart) {
      restart();
      setModelOpen(false);
    }
  }, [autoRestart, state, restart]);
  return (
    <>
      {state === "finish" ||
        (state === "start" && (
          <div className="setting fixed top-10 right-10 flex flex-col items-end">
            <AiFillSetting
              onClick={() => setModelOpen((prev) => !prev)}
              className="cursor-pointer t-10 l-10 text-white "
            />
            {modelOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, ease: easeInOut }}
                  className="modal mt-5 bg-black/20 p-5 rounded"
                >
                  <Button time={30} onClick={() => setSecond(30)} />
                  <Button time={60} onClick={() => setSecond(60)} />
                  <Button time={90} onClick={() => setSecond(90)} />
                  <Button time={120} onClick={() => setSecond(120)} />
                  <hr className="text-white/40 mb-3" />
                  <form>
                    <label className="text-white mr-5 mb-5" htmlFor="">
                      Words length
                    </label>
                    <input
                      className="focus:outline-none text-white focus:text-cyan-500 bg-transparent w-fit rounded-none px-5"
                      type="number"
                      placeholder="12"
                      value={NUMBER_OF_WORDS}
                      onChange={(e) => setNumberWords(Number(e.target.value))}
                    />
                    <br />
                    <span className="text-white">Auto restart : </span>
                    <input
                      type="checkbox"
                      placeholder="Auto restart"
                      onChange={(e) => setAutoRestart((prev) => !prev)}
                    />
                    <br />
                    <label htmlFor="fonts" className="text-white mr-5">
                      Choose font
                    </label>
                    <select
                      about="Font"
                      title="Select font"
                      onChange={(e) => setFont(e.target.value)}
                      name="fonts"
                      id="fonts"
                    >
                      {fonts.map((item, index) => (
                        <option value={item} key={index}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </form>
                </motion.div>
              </>
            )}
          </div>
        ))}

      <CountDownTimer timeLeft={timeleft}></CountDownTimer>
      <WordContainer font={font}>
        <GeneratedWords words={words}></GeneratedWords>
        <UserTypings userInput={typed} className={`absolute inset-0`} words={words} />
      </WordContainer>

      {state === "finish" && (
        <>
          <RestartButton
            onRestart={() => {
              restart();
            }}
            className="mx-auto mt-10"
          />
          <Results
            error={errors}
            accuracy={countAccuracyPercentage(errors, totalTyped)}
            total={totalTyped}
            className="text-center"
          />
        </>
      )}
      <footer className="text-white/10 text-xs text-center mt-10">
        <h6>
          powered by &copy;{" "}
          <a rel="noopener" target="_blank" href="https://nischal-dahal.com.np">
            neeswebservices
          </a>{" "}
        </h6>
      </footer>
    </>
  );
}

const WordContainer = ({ children, font }: { children: React.ReactNode; font: string }) => {
  return (
    <div
      style={{ fontFamily: `${font}` }}
      className={`font-${font} relative text-2xl leading-relaxed break-all max-w-xl mt-3`}
    >
      {children}
    </div>
  );
};

const GeneratedWords = ({ words }: { words: string }): ReactElement => {
  return <div className="mt-10  text-slate-500 ">{words}</div>;
};

const CountDownTimer = ({ timeLeft }: { timeLeft: number }) => {
  return <h2 className="text-primary-400  font-medium">Timeleft : {timeLeft}</h2>;
};

export default App;
