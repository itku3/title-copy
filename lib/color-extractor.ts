export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface ExtractedColors {
  hsl: HSL;
  rgb: RGB;
}

function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function getColorBucket(r: number, g: number, b: number): string {
  const rBucket = Math.floor(r / 32);
  const gBucket = Math.floor(g / 32);
  const bBucket = Math.floor(b / 32);
  return `${rBucket}-${gBucket}-${bBucket}`;
}

function isSaturatedEnough(r: number, g: number, b: number): boolean {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2 / 255;
  const s = max === min ? 0 : (max - min) / (l > 0.5 ? 510 - max - min : max + min);

  return s > 0.15 && l > 0.1 && l < 0.9;
}

export function adjustColorForTheme(hsl: HSL, isDark: boolean): HSL {
  let { h, s, l } = hsl;

  s = Math.min(s + 10, 80);

  if (isDark) {
    l = Math.max(55, Math.min(l + 15, 70));
  } else {
    l = Math.max(35, Math.min(l - 10, 50));
  }

  return { h, s, l };
}

export async function extractColorsFromImage(
  imageUrl: string
): Promise<ExtractedColors | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve(null);
          return;
        }

        const sampleSize = 50;
        canvas.width = sampleSize;
        canvas.height = sampleSize;

        ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
        const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize);
        const data = imageData.data;

        const colorBuckets: Map<string, { r: number; g: number; b: number; count: number }> = new Map();

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          if (!isSaturatedEnough(r, g, b)) continue;

          const bucket = getColorBucket(r, g, b);
          const existing = colorBuckets.get(bucket);

          if (existing) {
            existing.r += r;
            existing.g += g;
            existing.b += b;
            existing.count++;
          } else {
            colorBuckets.set(bucket, { r, g, b, count: 1 });
          }
        }

        if (colorBuckets.size === 0) {
          resolve(null);
          return;
        }

        let dominantBucket = { r: 0, g: 0, b: 0, count: 0 };
        colorBuckets.forEach((bucket) => {
          if (bucket.count > dominantBucket.count) {
            dominantBucket = bucket;
          }
        });

        const avgR = Math.round(dominantBucket.r / dominantBucket.count);
        const avgG = Math.round(dominantBucket.g / dominantBucket.count);
        const avgB = Math.round(dominantBucket.b / dominantBucket.count);

        const hsl = rgbToHsl(avgR, avgG, avgB);

        resolve({
          hsl,
          rgb: { r: avgR, g: avgG, b: avgB },
        });
      } catch {
        resolve(null);
      }
    };

    img.onerror = () => {
      resolve(null);
    };

    img.src = imageUrl;
  });
}
