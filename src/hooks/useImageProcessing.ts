import { useState, useCallback } from 'react';
import {
  calculateColorStats,
  applyColorTransfer,
  generateLUTData,
} from '../utils/colorGrading';
import { createLUTZipFile } from '../utils/lutExport';
import { ColorStats, LUTData } from '../types/color';

export function useImageProcessing() {
  const [lutData, setLutData] = useState<LUTData | null>(null);
  const [referenceStats, setReferenceStats] = useState<ColorStats | null>(null);

  const processImages = useCallback(async (
    originalImage: string,
    referenceImage: string
  ): Promise<string> => {
    // Load images
    const [originalImg, referenceImg] = await Promise.all([
      loadImage(originalImage),
      loadImage(referenceImage)
    ]);

    // Get image data
    const originalImageData = getImageData(originalImg);
    const referenceImageData = getImageData(referenceImg);

    // Calculate color statistics
    const refStats = calculateColorStats(referenceImageData);
    setReferenceStats(refStats);

    // Generate LUT data
    const origStats = calculateColorStats(originalImageData);
    const lut = generateLUTData(origStats, refStats);
    setLutData(lut);

    // Apply color transfer
    const processedImageData = applyColorTransfer(originalImageData, refStats);
    
    // Convert processed image data back to base64
    return imageDataToBase64(processedImageData);
  }, []);

  const downloadLUT = useCallback(async () => {
    if (!lutData) return;
    
    const zipBlob = await createLUTZipFile(lutData);
    const url = URL.createObjectURL(zipBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'custom-lut.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [lutData]);

  return { processImages, downloadLUT };
}

// Helper functions
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function getImageData(img: HTMLImageElement): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function imageDataToBase64(imageData: ImageData): string {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext('2d')!;
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/jpeg', 0.95);
}