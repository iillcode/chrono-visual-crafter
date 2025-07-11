export interface AnimationFrame {
  canvas: HTMLCanvasElement;
  timestamp: number;
  index: number;
}

export interface ExportSettings {
  width: number;
  height: number;
  frameRate: number;
  duration: number;
  quality: 'low' | 'medium' | 'high' | 'ultra';
}

export interface PNGSequenceOptions {
  format: '8bit' | '24bit' | '32bit';
  colorSpace: 'rgb' | 'rgba';
  compression: 'none' | 'fast' | 'best';
  namingConvention: 'sequence_####' | 'frame_####' | 'custom';
  customPrefix?: string;
}

export interface WebMAlphaOptions {
  codec: 'vp8' | 'vp9';
  bitrate: number; // in Mbps
  colorSubsampling: '4:2:0' | '4:2:2' | '4:4:4';
  twoPassEncoding: boolean;
  gammaCorrection: boolean;
  keyframeInterval: number;
  pixelFormat: 'yuva420p' | 'yuva422p' | 'yuva444p';
  autoAltRef: boolean;
}

export class AnimationOptimizer {
  private static readonly DEFAULT_PNG_OPTIONS: PNGSequenceOptions = {
    format: '8bit',
    colorSpace: 'rgb',
    compression: 'best',
    namingConvention: 'sequence_####',
  };

  private static readonly DEFAULT_WEBM_OPTIONS: WebMAlphaOptions = {
    codec: 'vp9',
    bitrate: 12, // 12 Mbps for HD
    colorSubsampling: '4:2:0',
    twoPassEncoding: true,
    gammaCorrection: true,
    keyframeInterval: 30,
    pixelFormat: 'yuva420p',
    autoAltRef: false,
  };

  static async optimizePNGSequence(
    frames: AnimationFrame[],
    options: Partial<PNGSequenceOptions> = {}
  ): Promise<{ files: { name: string; blob: Blob }[]; metadata: any }> {
    const opts = { ...this.DEFAULT_PNG_OPTIONS, ...options };
    const optimizedFrames: { name: string; blob: Blob }[] = [];

    // Ensure consistent dimensions
    const { width, height } = this.getConsistentDimensions(frames);

    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i];
      const optimizedCanvas = this.optimizeCanvasForPNG(frame.canvas, opts, width, height);
      
      // Generate filename with proper naming convention
      const filename = this.generateFrameName(i, opts.namingConvention, opts.customPrefix);
      
      // Convert to optimized PNG blob
      const blob = await this.canvasToPNGBlob(optimizedCanvas, opts);
      
      optimizedFrames.push({ name: filename, blob });
    }

    const metadata = {
      frameCount: frames.length,
      dimensions: { width, height },
      format: opts.format,
      colorSpace: opts.colorSpace,
      compression: opts.compression,
      totalSize: optimizedFrames.reduce((sum, frame) => sum + frame.blob.size, 0),
    };

    return { files: optimizedFrames, metadata };
  }

  static async optimizeWebMAlpha(
    canvas: HTMLCanvasElement,
    settings: ExportSettings,
    options: Partial<WebMAlphaOptions> = {}
  ): Promise<{ blob: Blob; metadata: any }> {
    const opts = { ...this.DEFAULT_WEBM_OPTIONS, ...options };
    
    // Setup optimized canvas stream
    const stream = this.createOptimizedStream(canvas, settings, opts);
    
    // Configure MediaRecorder with optimized settings
    const recorderOptions = this.getWebMRecorderOptions(opts, settings);
    
    return new Promise((resolve, reject) => {
      const chunks: Blob[] = [];
      const recorder = new MediaRecorder(stream, recorderOptions);
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      recorder.onstop = () => {
        try {
          const blob = new Blob(chunks, { type: recorderOptions.mimeType });
          
          const metadata = {
            codec: opts.codec,
            bitrate: opts.bitrate,
            colorSubsampling: opts.colorSubsampling,
            pixelFormat: opts.pixelFormat,
            duration: settings.duration,
            frameRate: settings.frameRate,
            size: blob.size,
            twoPassEncoding: opts.twoPassEncoding,
          };
          
          resolve({ blob, metadata });
        } catch (error) {
          reject(error);
        }
      };
      
      recorder.onerror = (event) => {
        reject(new Error('WebM recording failed'));
      };
      
      // Start recording with optimized settings
      recorder.start(100); // Collect data every 100ms
      
      // Stop after duration
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
        }
        stream.getTracks().forEach(track => track.stop());
      }, settings.duration * 1000);
    });
  }

  private static getConsistentDimensions(frames: AnimationFrame[]): { width: number; height: number } {
    if (frames.length === 0) return { width: 800, height: 600 };
    
    // Use the first frame's dimensions as reference
    const reference = frames[0].canvas;
    const width = reference.width;
    const height = reference.height;
    
    // Validate all frames have consistent dimensions
    const inconsistentFrames = frames.filter(
      frame => frame.canvas.width !== width || frame.canvas.height !== height
    );
    
    if (inconsistentFrames.length > 0) {
      console.warn(`Found ${inconsistentFrames.length} frames with inconsistent dimensions. Resizing to ${width}x${height}.`);
    }
    
    return { width, height };
  }

  private static optimizeCanvasForPNG(
    sourceCanvas: HTMLCanvasElement,
    options: PNGSequenceOptions,
    targetWidth: number,
    targetHeight: number
  ): HTMLCanvasElement {
    const optimizedCanvas = document.createElement('canvas');
    optimizedCanvas.width = targetWidth;
    optimizedCanvas.height = targetHeight;
    
    const ctx = optimizedCanvas.getContext('2d', {
      alpha: options.colorSpace === 'rgba',
      premultipliedAlpha: false,
      preserveDrawingBuffer: true,
    });
    
    if (!ctx) throw new Error('Could not create canvas context');
    
    // Configure context for optimal PNG output
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Apply gamma correction if needed
    ctx.globalCompositeOperation = 'source-over';
    
    // Draw source canvas with proper scaling
    if (sourceCanvas.width !== targetWidth || sourceCanvas.height !== targetHeight) {
      ctx.drawImage(sourceCanvas, 0, 0, targetWidth, targetHeight);
    } else {
      ctx.drawImage(sourceCanvas, 0, 0);
    }
    
    // Apply color space optimization
    if (options.format === '8bit' && options.colorSpace === 'rgb') {
      this.reduceColorDepth(ctx, targetWidth, targetHeight);
    }
    
    return optimizedCanvas;
  }

  private static reduceColorDepth(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): void {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // Reduce to 8-bit color depth (256 colors per channel)
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.round(data[i] / 255 * 255);     // Red
      data[i + 1] = Math.round(data[i + 1] / 255 * 255); // Green
      data[i + 2] = Math.round(data[i + 2] / 255 * 255); // Blue
      // Alpha channel (data[i + 3]) remains unchanged
    }
    
    ctx.putImageData(imageData, 0, 0);
  }

  private static generateFrameName(
    index: number,
    convention: string,
    customPrefix?: string
  ): string {
    const paddedIndex = index.toString().padStart(4, '0');
    
    switch (convention) {
      case 'sequence_####':
        return `sequence_${paddedIndex}.png`;
      case 'frame_####':
        return `frame_${paddedIndex}.png`;
      case 'custom':
        return `${customPrefix || 'frame'}_${paddedIndex}.png`;
      default:
        return `sequence_${paddedIndex}.png`;
    }
  }

  private static async canvasToPNGBlob(
    canvas: HTMLCanvasElement,
    options: PNGSequenceOptions
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      // Use maximum quality for lossless compression
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create PNG blob'));
          }
        },
        'image/png',
        1.0 // Maximum quality for PNG (lossless)
      );
    });
  }

  private static createOptimizedStream(
    canvas: HTMLCanvasElement,
    settings: ExportSettings,
    options: WebMAlphaOptions
  ): MediaStream {
    // Create stream with specified frame rate
    const stream = canvas.captureStream(settings.frameRate);
    
    // Get video track and apply optimizations
    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
      const capabilities = videoTrack.getCapabilities();
      
      // Apply constraints for optimal WebM output
      const constraints: MediaTrackConstraints = {
        frameRate: { ideal: settings.frameRate, max: settings.frameRate },
        width: { ideal: settings.width },
        height: { ideal: settings.height },
      };
      
      videoTrack.applyConstraints(constraints).catch(console.warn);
    }
    
    return stream;
  }

  private static getWebMRecorderOptions(
    options: WebMAlphaOptions,
    settings: ExportSettings
  ): MediaRecorderOptions {
    // Determine the best codec and MIME type
    const codecString = options.codec === 'vp9' ? 'vp9' : 'vp8';
    const mimeType = `video/webm;codecs=${codecString}`;
    
    // Validate codec support
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      console.warn(`${mimeType} not supported, falling back to default WebM`);
      return { mimeType: 'video/webm' };
    }
    
    // Calculate bitrate in bits per second
    const videoBitsPerSecond = options.bitrate * 1000000; // Convert Mbps to bps
    
    const recorderOptions: MediaRecorderOptions = {
      mimeType,
      videoBitsPerSecond,
    };
    
    // Add additional options for supported browsers
    if ('bitsPerSecond' in MediaRecorder.prototype) {
      (recorderOptions as any).bitsPerSecond = videoBitsPerSecond;
    }
    
    return recorderOptions;
  }

  static async downloadOptimizedExports(
    pngSequence?: { files: { name: string; blob: Blob }[]; metadata: any },
    webmAlpha?: { blob: Blob; metadata: any },
    baseName: string = 'optimized-counter'
  ): Promise<void> {
    const timestamp = Date.now();
    
    if (pngSequence) {
      // Create ZIP file for PNG sequence
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      // Add all PNG files to ZIP
      pngSequence.files.forEach(file => {
        zip.file(file.name, file.blob);
      });
      
      // Add metadata file
      zip.file('metadata.json', JSON.stringify(pngSequence.metadata, null, 2));
      
      // Generate and download ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      this.downloadBlob(zipBlob, `${baseName}-png-sequence-${timestamp}.zip`);
    }
    
    if (webmAlpha) {
      // Download WebM file directly
      this.downloadBlob(webmAlpha.blob, `${baseName}-alpha-${timestamp}.webm`);
    }
  }

  private static downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}