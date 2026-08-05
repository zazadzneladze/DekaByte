import { del } from "@vercel/blob";

export type DeleteBlobResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Best-effort blob delete. Never throws — callers decide how to surface partial failure.
 */
export async function deleteBlobSafe(
  pathname: string | null | undefined,
): Promise<DeleteBlobResult> {
  if (!pathname?.trim()) {
    return { ok: true };
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return {
      ok: false,
      error: "BLOB_READ_WRITE_TOKEN არ არის კონფიგურირებული",
    };
  }

  try {
    await del(pathname, { token: process.env.BLOB_READ_WRITE_TOKEN });
    return { ok: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Blob-ის წაშლა ვერ მოხერხდა";
    console.error("[blob] delete failed for pathname:", pathname, message);
    return { ok: false, error: message };
  }
}
