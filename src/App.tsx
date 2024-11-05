import React, { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Download, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from './components/ImageUpload';
import ProcessingStatus from './components/ProcessingStatus';
import DownloadOptions from './components/DownloadOptions';
import ImagePreview from './components/ImagePreview';
import Tutorial from './components/Tutorial';
import { useImageProcessing } from './hooks/useImageProcessing';

const MAX_LUTS = 5;

function App() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lutsGenerated, setLutsGenerated] = useState(0);

  const { processImages, downloadLUT } = useImageProcessing();

  useEffect(() => {
    const count = parseInt(localStorage.getItem('lutsGenerated') || '0');
    setLutsGenerated(count);
  }, []);

  const handleProcess = async () => {
    if (!originalImage || !referenceImage) return;
    if (lutsGenerated >= MAX_LUTS) {
      setError('You have reached the maximum limit of 5 LUTs. Please try again tomorrow.');
      return;
    }
    
    setError(null);
    setIsProcessing(true);
    
    try {
      const processed = await processImages(originalImage, referenceImage);
      setProcessedImage(processed);
      const newCount = lutsGenerated + 1;
      setLutsGenerated(newCount);
      localStorage.setItem('lutsGenerated', newCount.toString());
    } catch (err) {
      setError('Failed to process images. Please try again.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen">
      <nav className="bg-black/20 backdrop-blur-sm text-white sticky top-0 z-50 shadow-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold flex items-center gap-2"
          >
            <ImageIcon className="text-primary" />
            LUT Builder
          </motion.h1>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTutorial(true)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <Info size={20} />
            How it works
          </motion.button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <ImageUpload
            title="Original Image"
            image={originalImage}
            onImageSelect={setOriginalImage}
            onImageRemove={() => setOriginalImage(null)}
          />
          <ImageUpload
            title="Reference Image"
            image={referenceImage}
            onImageSelect={setReferenceImage}
            onImageRemove={() => setReferenceImage(null)}
          />
        </div>

        <div className="flex flex-col items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleProcess}
            disabled={!originalImage || !referenceImage || isProcessing}
            className={`
              px-8 py-4 rounded-lg font-semibold text-white
              transition-colors duration-200
              ${!originalImage || !referenceImage || isProcessing
                ? 'bg-gray-600/50 cursor-not-allowed'
                : 'bg-primary hover:bg-primary-dark'}
            `}
          >
            Generate LUT
          </motion.button>
          <p className="text-sm text-gray-400">
            {MAX_LUTS - lutsGenerated} LUTs remaining today
          </p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center justify-center gap-2 text-red-400"
            >
              <AlertCircle size={20} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isProcessing && <ProcessingStatus />}
        </AnimatePresence>

        <AnimatePresence>
          {processedImage && (
            <>
              <ImagePreview
                originalImage={originalImage!}
                referenceImage={referenceImage!}
                processedImage={processedImage}
              />
              <DownloadOptions onDownload={downloadLUT} />
            </>
          )}
        </AnimatePresence>
      </main>

      <footer className="text-center py-6 text-gray-400 border-t border-white/10">
        Powered by Colorgradingnfilms
      </footer>

      <AnimatePresence>
        {showTutorial && (
          <Tutorial onClose={() => setShowTutorial(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;