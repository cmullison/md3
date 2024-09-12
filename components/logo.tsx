"use client";

import "./styles.css";
import { motion } from "framer-motion";

export default function Logo() {
  return (
    <>
      <motion.div
        className="box"
        animate={{
          scale: [0.25, 2.1, 1.3, 2, 0.5],
          rotate: [0, 0, 180, 180, 0],
          borderRadius: ["20%", "10%", "50%", "30%", "80%"],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          times: [0, 0.2, 0.5, 0.8, 1],
          repeat: Infinity,
          repeatDelay: 0.5,
        }}
      />
    </>
  );
}
