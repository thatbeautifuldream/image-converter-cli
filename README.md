# Image Converter CLI

A command-line tool for converting images to optimized formats with WebP priority.

## Features

- Convert images to WebP, JPEG, JPG, or PNG formats
- Batch processing with wildcard support
- Configurable quality settings
- Automatic output directory creation
- Verbose logging option
- Built with Sharp for high-performance image processing

## Installation

### Prerequisites

- Node.js (v16 or higher)
- pnpm (recommended) or npm

### Local Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Build the project:
   ```bash
   pnpm run build
   ```

### Install in Your Machine (Global CLI)

To install this CLI tool globally on your machine:

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Build the project:

   ```bash
   pnpm run build
   ```

3. Install globally:
   ```bash
   npm install -g .
   ```

Now you can use `image-convert` command anywhere:

```bash
# Test the installation
image-convert --help

# Example usage
image-convert photo.jpg -f webp -q 90
image-convert "*.jpg" -o converted-images -v
```

## Usage

### Basic Usage

```bash
# Convert a single image to WebP (default format)
image-convert image.jpg

# Convert with specific format and quality
image-convert image.jpg -f jpeg -q 90

# Convert multiple images
image-convert photo1.jpg photo2.png photo3.gif
```

### Batch Processing

```bash
# Convert all JPG files in current directory
image-convert "*.jpg"

# Convert all images in a directory
image-convert "photos/*.{jpg,png,gif}"
```

### With Output Directory

```bash
# Convert and save to specific directory
image-convert "*.jpg" -o converted-images

# Convert with verbose logging
image-convert "*.png" -o output -v
```

### Global Command (if installed globally)

```bash
# Use the global command instead of image-convert
image-convert "*.jpg" -f webp -q 85 -o optimized
```

## Command Options

| Option      | Alias | Description                          | Default       |
| ----------- | ----- | ------------------------------------ | ------------- |
| `--format`  | `-f`  | Output format (webp, jpeg, jpg, png) | `webp`        |
| `--quality` | `-q`  | Quality for lossy formats (1-100)    | `85`          |
| `--output`  | `-o`  | Output directory                     | Same as input |
| `--verbose` | `-v`  | Enable verbose logging               | `false`       |
| `--help`    | `-h`  | Show help information                | -             |
| `--version` | `-V`  | Show version number                  | -             |

## Examples

### Convert to WebP with high quality

```bash
image-convert vacation-photos/*.jpg -f webp -q 95 -o webp-exports
```

### Convert PNG files to JPEG with medium quality

```bash
image-convert screenshots/*.png -f jpeg -q 75 -o jpeg-versions
```

### Batch convert with verbose output

```bash
image-convert "images/**/*.{jpg,png}" -v -o converted
```

## Development

### Available Scripts

- `pnpm run build` - Compile TypeScript to JavaScript
- `pnpm run start` - Run the compiled CLI tool
- `pnpm run dev` - Run in development mode with ts-node

### Project Structure

```
src/
├── index.ts      # CLI entry point and command setup
├── converter.ts  # Core image conversion logic
└── types.ts      # TypeScript type definitions
```

## Dependencies

- **Sharp** - High-performance image processing
- **Commander** - CLI argument parsing
- **Chalk** - Terminal string styling
- **Glob** - File pattern matching

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Build and test locally
5. Submit a pull request
