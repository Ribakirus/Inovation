import { RGBColor, ColorStats, LUTData } from '../types/color';

export function getRGBFromImageData(data: Uint8ClampedArray, index: number): RGBColor {
  return {
    r: data[index],
    g: data[index + 1],
    b: data[index + 2]
  };
}

export function calculateColorStats(imageData: ImageData): ColorStats {
  const pixels = imageData.data;
  let rSum = 0, gSum = 0, bSum = 0;
  let rSqSum = 0, gSqSum = 0, bSqSum = 0;
  const totalPixels = pixels.length / 4;

  for (let i = 0; i < pixels.length; i += 4) {
    rSum += pixels[i];
    gSum += pixels[i + 1];
    bSum += pixels[i + 2];

    rSqSum += pixels[i] * pixels[i];
    gSqSum += pixels[i + 1] * pixels[i + 1];
    bSqSum += pixels[i + 2] * pixels[i + 2];
  }

  return {
    mean: {
      r: rSum / totalPixels,
      g: gSum / totalPixels,
      b: bSum / totalPixels
    },
    std: {
      r: Math.sqrt(rSqSum / totalPixels - (rSum / totalPixels) ** 2),
      g: Math.sqrt(gSqSum / totalPixels - (gSum / totalPixels) ** 2),
      b: Math.sqrt(bSqSum / totalPixels - (bSum / totalPixels) ** 2)
    }
  };
}

export function applyColorTransfer(
  originalImageData: ImageData,
  referenceStats: ColorStats
): ImageData {
  const originalStats = calculateColorStats(originalImageData);
  const result = new ImageData(
    new Uint8ClampedArray(originalImageData.data),
    originalImageData.width,
    originalImageData.height
  );

  for (let i = 0; i < result.data.length; i += 4) {
    const pixel = getRGBFromImageData(originalImageData.data, i);
    
    // Apply color transfer for each channel
    result.data[i] = Math.max(0, Math.min(255, (
      ((pixel.r - originalStats.mean.r) * (referenceStats.std.r / originalStats.std.r)) +
      referenceStats.mean.r
    )));
    result.data[i + 1] = Math.max(0, Math.min(255, (
      ((pixel.g - originalStats.mean.g) * (referenceStats.std.g / originalStats.std.g)) +
      referenceStats.mean.g
    )));
    result.data[i + 2] = Math.max(0, Math.min(255, (
      ((pixel.b - originalStats.mean.b) * (referenceStats.std.b / originalStats.std.b)) +
      referenceStats.mean.b
    )));
    result.data[i + 3] = originalImageData.data[i + 3]; // Keep original alpha
  }

  return result;
}

export function generateLUTData(
  originalStats: ColorStats,
  referenceStats: ColorStats,
  size: number = 32
): LUTData {
  const lut: number[][][] = [];

  for (let b = 0; b < size; b++) {
    lut[b] = [];
    for (let g = 0; g < size; g++) {
      lut[b][g] = [];
      for (let r = 0; r < size; r++) {
        const normalizedR = (r / (size - 1)) * 255;
        const normalizedG = (g / (size - 1)) * 255;
        const normalizedB = (b / (size - 1)) * 255;

        const transformedR = Math.max(0, Math.min(255, (
          ((normalizedR - originalStats.mean.r) * (referenceStats.std.r / originalStats.std.r)) +
          referenceStats.mean.r
        ))) / 255;
        const transformedG = Math.max(0, Math.min(255, (
          ((normalizedG - originalStats.mean.g) * (referenceStats.std.g / originalStats.std.g)) +
          referenceStats.mean.g
        ))) / 255;
        const transformedB = Math.max(0, Math.min(255, (
          ((normalizedB - originalStats.mean.b) * (referenceStats.std.b / originalStats.std.b)) +
          referenceStats.mean.b
        ))) / 255;

        lut[b][g][r] = [transformedR, transformedG, transformedB];
      }
    }
  }

  return { size, data: lut };
}