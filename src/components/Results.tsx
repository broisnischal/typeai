import { motion } from "framer-motion";
import { FormatPercentages } from "../utils/helpers";

const Results = ({
  error,
  accuracy,
  total,
  className,
}: {
  error: number;
  accuracy: number;
  total: number;
  className?: string;
}) => {
  const initial = { opacity: 0 };
  const animate = { opacity: 1 };
  const duration = { duration: 0.3 };

  return (
    <motion.ul className={`flex flex-col items-start text-primary-400 space-y-3 mt-5 ${className}`}>
      <motion.li className="text-xl font-semibold font-sans text-cyan-500  border-b-2 p-2">
        Results :
      </motion.li>
      <motion.li
        initial={initial}
        animate={animate}
        transition={{ ...duration, delay: 0 }}
        className="text-green-300"
      >
        Accuracy : {FormatPercentages(accuracy)}
      </motion.li>
      <motion.li
        initial={initial}
        animate={animate}
        transition={{ ...duration, delay: 0.3 }}
        className="text-red-500"
      >
        Errors : {error}
      </motion.li>
      <motion.li
        initial={initial}
        animate={animate}
        transition={{ ...duration, delay: 0.6 }}
        className="text-pink-400"
      >
        Typed : {total}{" "}
      </motion.li>
    </motion.ul>
  );
};

export default Results;
