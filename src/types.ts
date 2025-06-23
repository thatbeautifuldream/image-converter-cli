export interface ConvertOptions {
  format: 'webp' | 'jpeg' | 'png';
  quality: number;
  outputDir?: string;
  verbose: boolean;
}

export interface ConvertResult {
  inputPath: string;
  outputPath: string;
  success: boolean;
  error?: string;
}

export type SupportedInputFormat = '.jpg' | '.jpeg' | '.png' | '.bmp' | '.tiff' | '.tif' | '.webp' | '.gif';
export type SupportedOutputFormat = 'webp' | 'jpeg' | 'png';