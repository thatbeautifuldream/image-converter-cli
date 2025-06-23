#!/usr/bin/env node

import { Command } from 'commander';
import { convertImages } from './converter';
import { ConvertOptions, ConvertResult } from './types';
import chalk from 'chalk';
import { glob } from 'glob';

const program = new Command();

program
  .name('image-convert')
  .description('Convert images to optimized formats with WebP priority')
  .version('1.0.0')
  .argument('<files...>', 'Input image files (supports wildcards)')
  .option('-f, --format <format>', 'Output format', 'webp')
  .option('-q, --quality <number>', 'Quality for lossy formats (1-100)', '85')
  .option('-o, --output <dir>', 'Output directory')
  .option('-v, --verbose', 'Enable verbose logging')
  .action(async (files: string[], options: any) => {
    try {
      const quality = parseInt(options.quality);
      if (isNaN(quality) || quality < 1 || quality > 100) {
        console.error(chalk.red('Error: Quality must be between 1 and 100'));
        process.exit(1);
      }

      const supportedFormats = ['webp', 'jpeg', 'jpg', 'png'];
      if (!supportedFormats.includes(options.format.toLowerCase())) {
        console.error(chalk.red(`Error: Unsupported format '${options.format}'. Supported: ${supportedFormats.join(', ')}`));
        process.exit(1);
      }

      const convertOptions: ConvertOptions = {
        format: options.format.toLowerCase() === 'jpg' ? 'jpeg' : options.format.toLowerCase(),
        quality,
        outputDir: options.output,
        verbose: options.verbose || false
      };

      let allFiles: string[] = [];
      
      for (const filePattern of files) {
        if (filePattern.includes('*') || filePattern.includes('?')) {
          const matchedFiles = await glob(filePattern);
          if (matchedFiles.length === 0) {
            console.warn(chalk.yellow(`Warning: No files found matching pattern: ${filePattern}`));
          } else {
            allFiles.push(...matchedFiles);
          }
        } else {
          allFiles.push(filePattern);
        }
      }

      if (allFiles.length === 0) {
        console.error(chalk.red('Error: No input files found'));
        process.exit(1);
      }

      const results = await convertImages(allFiles, convertOptions);
      
      const successful = results.filter((r: ConvertResult) => r.success).length;
      const total = results.length;
      
      if (successful === total) {
        console.log(chalk.green(`✓ Successfully converted ${successful}/${total} files`));
      } else {
        console.log(chalk.yellow(`⚠ Converted ${successful}/${total} files (${total - successful} failed)`));
        
        if (convertOptions.verbose) {
          results.filter((r: ConvertResult) => !r.success).forEach((r: ConvertResult) => {
            console.log(chalk.red(`✗ ${r.inputPath}: ${r.error}`));
          });
        }
        
        process.exit(1);
      }
    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program.parse();