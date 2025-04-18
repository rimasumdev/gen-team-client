// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Dashboard from "../components/Dashboard";

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.2,
};

const StatsPage = ({ players }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="py-4"
    >
      <Dashboard players={players} />
    </motion.div>
  );
};

export default StatsPage;
