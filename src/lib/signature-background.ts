export type RemovePaperBackgroundOptions = {
  /** Luminance 0–255; pixels above this become transparent. Default 238. */
  threshold?: number;
  /** Soft edge width below threshold (luminance units). Default 12. */
  feather?: number;
  /** Minimum ink alpha for non-background pixels. Default 255. */
  inkAlpha?: number;
};

function luminance(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

export function loadImageToCanvas(file: File): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context unavailable"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(canvas);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("სურათის ჩატვირთვა ვერ მოხერხდა"));
    };
    img.src = url;
  });
}

export function removePaperBackground(
  source: HTMLCanvasElement,
  opts: RemovePaperBackgroundOptions = {},
): HTMLCanvasElement {
  const threshold = opts.threshold ?? 238;
  const feather = opts.feather ?? 12;
  const inkAlpha = opts.inkAlpha ?? 255;

  const canvas = document.createElement("canvas");
  canvas.width = source.width;
  canvas.height = source.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context unavailable");

  ctx.drawImage(source, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data } = imageData;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]!;
    const g = data[i + 1]!;
    const b = data[i + 2]!;
    const lum = luminance(r, g, b);

    if (lum >= threshold) {
      data[i + 3] = 0;
      continue;
    }

    const edgeStart = threshold - feather;
    if (feather > 0 && lum > edgeStart) {
      const t = (threshold - lum) / feather;
      data[i + 3] = Math.round(Math.min(1, Math.max(0, t)) * inkAlpha);
    } else {
      data[i + 3] = inkAlpha;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

export function cropToInkBounds(
  source: HTMLCanvasElement,
  padding = 8,
): HTMLCanvasElement {
  const ctx = source.getContext("2d");
  if (!ctx) throw new Error("Canvas context unavailable");

  const { width, height } = source;
  const imageData = ctx.getImageData(0, 0, width, height);
  const { data } = imageData;

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let found = false;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3]!;
      if (alpha > 8) {
        found = true;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (!found) return source;

  minX = Math.max(0, minX - padding);
  minY = Math.max(0, minY - padding);
  maxX = Math.min(width - 1, maxX + padding);
  maxY = Math.min(height - 1, maxY + padding);

  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;

  const canvas = document.createElement("canvas");
  canvas.width = cropW;
  canvas.height = cropH;
  const out = canvas.getContext("2d");
  if (!out) throw new Error("Canvas context unavailable");
  out.drawImage(source, minX, minY, cropW, cropH, 0, 0, cropW, cropH);
  return canvas;
}

export function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("PNG ექსპორტი ვერ მოხერხდა"));
          return;
        }
        resolve(blob);
      },
      "image/png",
      1,
    );
  });
}

export async function processSignatureImage(
  file: File,
  opts: RemovePaperBackgroundOptions = {},
): Promise<{ canvas: HTMLCanvasElement; blob: Blob }> {
  const loaded = await loadImageToCanvas(file);
  const cleared = removePaperBackground(loaded, opts);
  const cropped = cropToInkBounds(cleared);
  const blob = await canvasToPngBlob(cropped);
  return { canvas: cropped, blob };
}

export function canvasToObjectUrl(canvas: HTMLCanvasElement): Promise<string> {
  return canvasToPngBlob(canvas).then((blob) => URL.createObjectURL(blob));
}
