const DB_NAME = "dnz-insaat-files";
const STORE = "pdfs";
const DB_VERSION = 1;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveFileBlob(key: string, blob: Blob): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(blob, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getFileBlob(key: string): Promise<Blob | null> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(key);
    req.onsuccess = () => resolve((req.result as Blob) || null);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteFileBlob(key: string): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function savePdfBlob(key: string, blob: Blob): Promise<void> {
  return saveFileBlob(key, blob);
}

export async function getPdfBlob(key: string): Promise<Blob | null> {
  return getFileBlob(key);
}

export async function deletePdfBlob(key: string): Promise<void> {
  return deleteFileBlob(key);
}

export async function openPdf(keyOrUrl: string): Promise<void> {
  if (keyOrUrl.startsWith("http") || keyOrUrl.startsWith("/")) {
    window.open(keyOrUrl, "_blank");
    return;
  }
  const blob = await getFileBlob(keyOrUrl);
  if (!blob) {
    alert("PDF bulunamadı.");
    return;
  }
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
}

export const IDB_IMAGE_PREFIX = "idb:";

export function isIdbImageRef(src: string): boolean {
  return src.startsWith(IDB_IMAGE_PREFIX);
}

export function toIdbImageRef(key: string): string {
  return `${IDB_IMAGE_PREFIX}${key}`;
}

export function fromIdbImageRef(src: string): string {
  return src.slice(IDB_IMAGE_PREFIX.length);
}

/** Görseli sıkıştırıp JPEG blob üret (max kenar 1600px) */
export function compressImageFile(
  file: File,
  maxEdge = 1600,
  quality = 0.82
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas desteklenmiyor."));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => {
          if (!blob) reject(new Error("Görsel işlenemedi."));
          else resolve(blob);
        },
        "image/jpeg",
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Görsel okunamadı."));
    };
    img.src = url;
  });
}
