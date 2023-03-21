import React from "react";
import "./App.css";
import { ReactElement, useEffect, useState, useRef } from "react";
import RestartButton from "./components/Restart";
import Results from "./components/Results";
import UserTypings from "./components/UserTyping";
import Caret from "./components/Caret";
import useEngine from "./hooks/useEngine";
import { countAccuracyPercentage } from "./utils/helpers";
import { AiFillSetting } from "react-icons/ai";
import cb from "classnames";
import { easeInOut, motion, useForceUpdate } from "framer-motion";
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
    SECOND,
    resetCount,
    totalTyped,
    NUMBER_OF_WORDS,
    typed,
    errors,
    mainState,
    setMainState,
  } = useEngine();

  const [autoRestart, setAutoRestart] = useState<boolean>(mainState.restart);
  const [modelOpen, setModelOpen] = useState<boolean>(false);
  const typeRef = useRef<HTMLDivElement>(null);

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

  const [font, setFont] = useState(mainState.font);

  useEffect(() => {
    if (state === "finish" && autoRestart) {
      restart();
    }
    if (state === "finish") {
      setModelOpen(false);
    }
  }, [autoRestart, state, restart]);

  return (
    <>
      {(state === "finish" || state === "start") && (
        <div
          ref={typeRef}
          className="setting z-40 backdrop-blur-sm  fixed top-10 right-10 flex w-25 flex-col  items-end"
        >
          <AiFillSetting
            onClick={() => {
              setModelOpen((prev) => !prev);
              // typeRef.current?.blur;
            }}
            className="cursor-pointer text-2xl t-10 l-10 text-white "
          />
          {modelOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: easeInOut }}
                className="modal mt-2 bg-white/5 p-5 rounded  "
              >
                <div className="mb-2">
                  <Button
                    current={SECOND}
                    time={30}
                    onClick={() => {
                      setSecond(30);
                      setMainState({ ...mainState, second: 30 });
                    }}
                  />
                  <Button
                    current={SECOND}
                    time={60}
                    onClick={() => {
                      setSecond(60);
                      setMainState({ ...mainState, second: 60 });
                    }}
                  />
                  <Button
                    current={SECOND}
                    time={90}
                    onClick={() => {
                      setSecond(90);
                      setMainState({ ...mainState, second: 90 });
                    }}
                  />
                  <Button
                    current={SECOND}
                    time={120}
                    onClick={() => {
                      setSecond(120);
                      setMainState({ ...mainState, second: 120 });
                    }}
                  />
                </div>
                <hr className="text-white/20 mb-3" />
                <form>
                  <label className="text-white flex-2 mr-5 mb-5" htmlFor="">
                    Words length
                  </label>
                  <input
                    className="focus:outline-none flex-1 text-white/80 py-1 focus:text-white  bg-white/5 rounded  px-5"
                    type="number"
                    min={10}
                    value={NUMBER_OF_WORDS}
                    onChange={(e) => {
                      // e.stopPropagation();
                      if (Number(e.target.value) <= 0) {
                        setMainState({ ...mainState, words: 10 });
                        setNumberWords(10);
                        return;
                      }
                      setMainState({ ...mainState, words: Number(e.target.value) });
                      setNumberWords(Number(e.target.value));
                    }}
                  />
                  <div className="my-2">
                    <span className="text-white mr-2">Auto restart : </span>
                    <input
                      className="cursor-pointer shadow checked:shadow-xl"
                      type="checkbox"
                      checked={mainState.restart}
                      onChange={(e) => {
                        setMainState({ ...mainState, restart: !mainState.restart });
                      }}
                    />
                  </div>
                  <div className="my-2">
                    <span className="text-white mr-2">Word Break : </span>
                    <input
                      className="cursor-pointer shadow checked:shadow-xl"
                      type="checkbox"
                      disabled
                      checked={!mainState.break}
                      onChange={(e) => {
                        setMainState({ ...mainState, break: !mainState.break });
                      }}
                    />
                  </div>
                  <label htmlFor="fonts" className="text-white text-xl mr-3">
                    Choose font
                  </label>
                  <select
                    about="Font"
                    title="Select font"
                    onChange={(e) => setMainState({ ...mainState, font: e.target.value })}
                    name="fonts"
                    id="fonts"
                  >
                    <option disabled value={mainState.font} selected>
                      {mainState.font}
                    </option>
                    {fonts.map((item, index) => (
                      <option value={item} key={index}>
                        {item}
                      </option>
                    ))}
                  </select>
                </form>
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={(e) => setMainState({ ...mainState, wide: true })}
                    className={`px-5 py-2 mt-1  mr-5 text-sm rounded bg-white/10 hover:bg-white/20 text-white ${
                      mainState.wide === true && "outline md:outline-1"
                    } `}
                  >
                    Wide
                  </button>
                  <button
                    type="button"
                    onClick={(e) => setMainState({ ...mainState, wide: false })}
                    className={`px-5 py-2 mt-1 text-sm rounded bg-white/10 hover:bg-white/20 text-white ${
                      mainState.wide === false && "outline md:outline-1"
                    } `}
                  >
                    Thin
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </div>
      )}
      <CountDownTimer timeLeft={timeleft}></CountDownTimer>
      <WordContainer wide={mainState.wide} wordBreak={mainState.break} font={mainState.font}>
        <GeneratedWords wordBreak={mainState.break} words={words}></GeneratedWords>
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

const WordContainer = ({
  children,
  font,
  wordBreak,
  wide,
}: {
  children: React.ReactNode;
  font: string;
  wordBreak: boolean;
  wide: boolean;
}) => {
  return (
    <div
      style={{ fontFamily: `${font}` }}
      className={`font-${font} relative text-2xl leading-relaxed ${
        wordBreak ? "break-all" : "text-justify"
      } ${wide ? "max-w-6xl" : "max-w-xl"}`}
    >
      {children}
    </div>
  );
};

const GeneratedWords = ({
  words,
  wordBreak,
}: {
  words: string;
  wordBreak: boolean;
}): ReactElement => {
  return (
    <div className={`mt-10  text-slate-500 ${wordBreak ? "break-all" : ""}  z-0`}>{words}</div>
  );
};

const CountDownTimer = ({ timeLeft }: { timeLeft: number }) => {
  return <h2 className="text-yellow-400 text-base">Timeleft : {timeLeft}</h2>;
};

export default App;
