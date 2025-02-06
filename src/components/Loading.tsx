import React from "react";
import { motion, Variants } from "framer-motion";

const Loading: React.FC = () => {
  const dotVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut",
        repeatType: "reverse",
      },
    },
  };

  return (
    <div className="absolute inset-0 z-50 flex justify-center items-center gap-2">
      <div className="flex space-x-2">
        {[0, 1, 2].map((dot) => (
          <motion.div
            key={dot}
            className="w-2 h-2 bg-gray-500 rounded-full"
            variants={dotVariants}
            initial="hidden"
            animate="visible"
            style={{ animationDelay: `${dot * 0.3}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default Loading;
