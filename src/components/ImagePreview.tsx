import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import useMeasure from 'react-use-measure';

interface ImagePreviewProps {
  originalImage: string;
  referenceImage: string;
  processedImage: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  originalImage,
  referenceImage,
  processedImage,
}) => {
  const [ref, bounds] = useMeasure();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateSliderPosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const position = ((clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(position, 0), 100));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    updateSliderPosition(e.clientX);
  }, [updateSliderPosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    updateSliderPosition(e.clientX);
  }, [isDragging, updateSliderPosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mouseleave', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [isDragging, handleMouseUp]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-800 rounded-xl shadow-xl p-6 mb-8"
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-6">Preview</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h3 className="text-gray-200 font-medium">Reference Style</h3>
          <div className="relative h-64 rounded-lg overflow-hidden bg-dark-900">
            <img
              src={referenceImage}
              alt="Reference"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-gray-200 font-medium">Before / After Comparison</h3>
          <div
            ref={containerRef}
            className="relative h-64 rounded-lg overflow-hidden cursor-col-resize bg-dark-900"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
          >
            {/* Processed Image (After) */}
            <img
              src={processedImage}
              alt="Processed"
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Original Image (Before) with clip mask */}
            <div
              className="absolute inset-0"
              style={{ width: `${sliderPosition}%`, overflow: 'hidden' }}
            >
              <img
                src={originalImage}
                alt="Original"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ width: `${100 / (sliderPosition / 100)}%` }}
              />
            </div>

            {/* Slider */}
            <div
              className="image-compare-slider"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="image-compare-handle top" />
              <div className="image-compare-handle bottom" />
            </div>

            {/* Labels */}
            <div className="absolute top-2 left-2 bg-black/75 text-white text-sm px-2 py-1 rounded">
              Before
            </div>
            <div className="absolute top-2 right-2 bg-black/75 text-white text-sm px-2 py-1 rounded">
              After
            </div>
          </div>
          <p className="text-sm text-gray-400 text-center">
            Drag slider to compare original and processed images
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ImagePreview;