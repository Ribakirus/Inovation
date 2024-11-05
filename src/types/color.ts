export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface ColorStats {
  mean: RGBColor;
  std: RGBColor;
}

export interface LUTData {
  size: number;
  data: number[][][];
}