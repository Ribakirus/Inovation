import React from 'react';
import { X } from 'lucide-react';

interface TutorialProps {
  onClose: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onClose }) => {
  const steps = [
    {
      title: 'Upload Original Image',
      description: 'Start by uploading the image you want to color grade.',
    },
    {
      title: 'Add Reference Image',
      description: 'Upload an image with the color grading style you want to match.',
    },
    {
      title: 'Generate LUT',
      description: 'Click "Generate LUT" to analyze and create your custom color grading.',
    },
    {
      title: 'Preview Results',
      description: 'Review the processed image and make adjustments if needed.',
    },
    {
      title: 'Download',
      description: 'Choose your preferred LUT format and download the file.',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-[#323233]">
            How to Use LUT Generator Pro
          </h2>
          <button
            onClick={onClose}
            className="text-[#979A9C] hover:text-[#323233] transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#B89272] text-white rounded-full flex items-center justify-center font-semibold">
                {index + 1}
              </div>
              <div>
                <h3 className="font-medium text-[#323233] mb-1">
                  {step.title}
                </h3>
                <p className="text-[#979A9C]">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-8 w-full bg-[#B89272] text-white py-3 rounded-lg font-semibold hover:bg-[#a17b5d] transition-colors"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};

export default Tutorial;