import React from 'react';
import { motion } from 'framer-motion';

const ProcessingStatus: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center p-8"
    >
      <div className="relative w-16 h-16 mb-4">
        <motion.div
          className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-semibold text-gray-100 mb-2"
      >
        Processing your images
      </motion.h3>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-400 text-center max-w-md"
      >
        Our AI is analyzing colors and generating your custom LUT.
        This usually takes about 15-30 seconds.
      </motion.p>
    </motion.div>
  );
};

export default ProcessingStatus;