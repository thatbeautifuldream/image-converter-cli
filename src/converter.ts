import sharp from 'sharp';
import { promises as fs } from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { ConvertOptions, ConvertResult, SupportedInputFormat } from './types';

const SUPPORTED_INPUT_FORMATS: SupportedInputFormat[] = [
  '.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif', '.webp', '.gif'
];

export async function convertImages(inputPaths: string[], options: ConvertOptions): Promise<ConvertResult[]> {
  const results: ConvertResult[] = [];
  
  for (const inputPath of inputPaths) {
    const result = await convertSingleImage(inputPath, options);
    results.push(result);
  }
  
  return results;
}

async function convertSingleImage(inputPath: string, options: ConvertOptions): Promise<ConvertResult> {
  try {
    const inputExists = await fs.access(inputPath).then(() => true).catch(() => false);
    if (!inputExists) {
      return {
        inputPath,
        outputPath: '',
        success: false,
        error: 'File does not exist'
      };
    }

    const inputExt = path.extname(inputPath).toLowerCase() as SupportedInputFormat;
    if (!SUPPORTED_INPUT_FORMATS.includes(inputExt)) {
      return {
        inputPath,
        outputPath: '',
        success: false,
        error: `Unsupported input format: ${inputExt}`
      };
    }

    const outputPath = generateOutputPath(inputPath, options.format, options.outputDir);
    
    if (options.outputDir) {
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
    }

    let sharpInstance = sharp(inputPath);

    switch (options.format) {
      case 'webp':
        sharpInstance = sharpInstance.webp({ 
          quality: options.quality,
          effort: 6
        });
        break;
      case 'jpeg':
        sharpInstance = sharpInstance.jpeg({ 
          quality: options.quality,
          progressive: true,
          optimiseScans: true
        });
        break;
      case 'png':
        sharpInstance = sharpInstance.png({ 
          compressionLevel: 9,
          progressive: true
        });
        break;
    }

    await sharpInstance.toFile(outputPath);

    if (options.verbose) {
      const inputStats = await fs.stat(inputPath);
      const outputStats = await fs.stat(outputPath);
      const savedBytes = inputStats.size - outputStats.size;
      const savedPercent = ((savedBytes / inputStats.size) * 100).toFixed(1);
      
      console.log(chalk.green(`✓ ${inputPath} → ${outputPath}`));
      console.log(chalk.gray(`  Size: ${formatBytes(inputStats.size)} → ${formatBytes(outputStats.size)} (${savedPercent}% reduction)`));
    }

    return {
      inputPath,
      outputPath,
      success: true
    };

  } catch (error) {
    return {
      inputPath,
      outputPath: '',
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

function generateOutputPath(inputPath: string, format: string, outputDir?: string): string {
  const parsedPath = path.parse(inputPath);
  const outputFileName = `${parsedPath.name}.${format}`;
  
  if (outputDir) {
    return path.join(outputDir, outputFileName);
  } else {
    return path.join(parsedPath.dir, outputFileName);
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}