import React from 'react';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';

interface DownloadOptionsProps {
  onDownload: () => void;
}

const DownloadOptions: React.FC<DownloadOptionsProps> = ({ onDownload }) => {
  const formats = [
    {
      name: '.cube',
      description: 'Industry standard, works with most editing software',
      popular: true,
    },
    {
      name: '.3dl',
      description: 'Compatible with high-end color grading systems',
      popular: false,
    },
    {
      name: '.look',
      description: 'Advanced format with metadata support',
      popular: false,
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-800 rounded-xl shadow-xl p-6"
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-6">
        Download Options
      </h2>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid md:grid-cols-3 gap-6"
      >
        {formats.map((format) => (
          <motion.div
            key={format.name}
            variants={item}
            className={`
              relative overflow-hidden rounded-lg border-2 p-4
              transition-colors duration-200 bg-dark-900
              ${format.popular
                ? 'border-primary'
                : 'border-dark-700 hover:border-primary'
              }
            `}
          >
            {format.popular && (
              <div className="absolute top-0 right-0 bg-primary text-white text-xs px-2 py-1 rounded-bl">
                Popular
              </div>
            )}
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-100">
                {format.name}
              </h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onDownload}
                className="text-primary hover:text-primary-light transition-colors"
              >
                <Download size={20} />
              </motion.button>
            </div>
            <p className="text-sm text-gray-400">{format.description}</p>
          </motion.div>
        ))}
      </motion.div>
      <p className="text-sm text-gray-400 text-center mt-6">
        All formats will be included in a single ZIP file
      </p>
    </motion.div>
  );
};

export default DownloadOptions;