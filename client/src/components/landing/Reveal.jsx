import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function Reveal({ children, className = "", delay = 0 }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      transition={{ duration: 0.55, delay, ease: [0.2, 0.7, 0.2, 1] }}
      viewport={{ once: true, amount: 0.3 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}
