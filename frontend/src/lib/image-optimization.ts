// Image optimization for Vercel Image Optimization API

// Image optimization configuration for Vercel
export const imageConfig = {
  // Supported formats
  formats: ['image/webp', 'image/avif', 'image/jpeg', 'image/png', 'image/gif'],

  // Default quality settings
  quality: {
    low: 50,      // For thumbnails
    medium: 75,   // For standard images
    high: 85,     // For featured images
    max: 100      // For original quality
  },

  // Default sizes for responsive images
  sizes: {
    thumbnail: { width: 150, height: 150 },
    small: { width: 300, height: 300 },
    medium: { width: 600, height: 400 },
    large: { width: 1200, height: 800 },
    xLarge: { width: 1920, height: 1080 }
  },

  // Device pixel ratios for high-DPI displays
  devicePixelRatios: [1, 2, 3],

  // Maximum dimensions allowed
  maxDimensions: {
    width: 4096,
    height: 4096
  }
};

// Image optimization utility functions
export class ImageOptimizer {
  /**
   * Generate optimized image URL for Vercel Image Optimization API
   */
  static generateImageUrl(
    src: string,
    width?: number,
    height?: number,
    quality: number = imageConfig.quality.medium,
    format?: 'webp' | 'avif' | 'jpeg' | 'png'
  ): string {
    // If it's already an absolute URL and not from our domain, return as is
    if (src.startsWith('http') && !src.includes(process.env.NEXT_PUBLIC_SITE_URL || '')) {
      return src;
    }

    // Construct the optimization URL
    const params = new URLSearchParams();

    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    if (quality !== imageConfig.quality.medium) params.append('q', quality.toString());
    if (format) params.append('f', format);

    // For Vercel Image Optimization, the URL format is /_next/image?url=...&w=...&q=...
    const encodedSrc = encodeURIComponent(src);
    const paramString = params.toString();

    if (paramString) {
      return `/_next/image?url=${encodedSrc}&${paramString}`;
    } else {
      return src; // Return original if no transformations needed
    }
  }

  /**
   * Generate srcSet for responsive images
   */
  static generateSrcSet(
    src: string,
    widths: number[] = [300, 600, 1200],
    quality: number = imageConfig.quality.medium
  ): string {
    return widths
      .map(width => `${this.generateImageUrl(src, width, undefined, quality)} ${width}w`)
      .join(', ');
  }

  /**
   * Generate sizes attribute for responsive images
   */
  static generateSizes(
    sizeDescriptors: Array<{ media: string; size: string }> = [
      { media: '(max-width: 640px)', size: '100vw' },
      { media: '(max-width: 768px)', size: '50vw' },
      { media: '(min-width: 1200px)', size: '25vw' },
      { media: 'default', size: '33vw' }
    ]
  ): string {
    return sizeDescriptors
      .map(desc => desc.media === 'default' ? desc.size : `${desc.media} ${desc.size}`)
      .join(', ');
  }

  /**
   * Optimize image for different breakpoints
   */
  static optimizeForBreakpoints(
    src: string,
    breakpoints: {
      mobile: number;
      tablet: number;
      desktop: number;
    },
    quality: number = imageConfig.quality.medium
  ): { srcSet: string; sizes: string } {
    const widths = [breakpoints.mobile, breakpoints.tablet, breakpoints.desktop];

    return {
      srcSet: this.generateSrcSet(src, widths, quality),
      sizes: this.generateSizes([
        { media: '(max-width: 640px)', size: '100vw' },
        { media: '(max-width: 768px)', size: '50vw' },
        { media: 'default', size: '33vw' }
      ])
    };
  }

  /**
   * Preload optimized image
   */
  static async preloadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to preload image: ${url}`));
      img.src = url;
    });
  }

  /**
   * Get image dimensions without loading the full image
   */
  static getImageDimensions(src: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => reject(new Error(`Failed to get image dimensions: ${src}`));
      img.src = src;
    });
  }

  /**
   * Calculate aspect ratio
   */
  static calculateAspectRatio(width: number, height: number): string {
    const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
    const divisor = gcd(width, height);
    const aspectWidth = width / divisor;
    const aspectHeight = height / divisor;
    return `${aspectWidth}/${aspectHeight}`;
  }

  /**
   * Generate placeholder while image loads
   */
  static generatePlaceholder(
    width: number,
    height: number,
    bgColor: string = '#f3f4f6',
    textColor: string = '#9ca3af'
  ): string {
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${width}" height="${height}" fill="${bgColor}" />
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
              font-family="Arial, sans-serif" font-size="14" fill="${textColor}">
          ${width}×${height}
        </text>
      </svg>
    `;

    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }
}

// Image optimization hook for React components
export const useImageOptimization = () => {
  const optimizeImage = (
    src: string,
    width?: number,
    height?: number,
    quality?: number,
    format?: 'webp' | 'avif' | 'jpeg' | 'png'
  ) => {
    return ImageOptimizer.generateImageUrl(src, width, height, quality, format);
  };

  const generateSrcSet = (src: string, widths?: number[], quality?: number) => {
    return ImageOptimizer.generateSrcSet(src, widths, quality);
  };

  return {
    optimizeImage,
    generateSrcSet,
    ImageOptimizer
  };
};

// Next.js Image component props generator
export const getNextImageProps = (
  src: string,
  width?: number,
  height?: number,
  alt: string = '',
  quality: number = imageConfig.quality.medium
) => {
  return {
    src,
    width,
    height,
    alt,
    quality,
    // These would be used in a Next.js Image component
    // layout: 'responsive' as const,
    // placeholder: 'blur' as const,
    // blurDataURL: ImageOptimizer.generatePlaceholder(width || 300, height || 200)
  };
};

// Export all image optimization utilities
export default {
  imageConfig,
  ImageOptimizer,
  useImageOptimization,
  getNextImageProps
};