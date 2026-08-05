import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

const payloadSchema = z.object({
  projectId: z.string().uuid(),
});

export async function POST(request: Request): Promise<NextResponse> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "BLOB_READ_WRITE_TOKEN არ არის კონფიგურირებული" },
      { status: 500 },
    );
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "ავტორიზაცია საჭიროა" }, { status: 401 });
  }

  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "არასწორი მოთხოვნა" }, { status: 400 });
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        let projectId: string | undefined;
        try {
          const parsed = payloadSchema.safeParse(
            clientPayload ? JSON.parse(clientPayload) : null,
          );
          if (!parsed.success) {
            throw new Error("projectId აუცილებელია");
          }
          projectId = parsed.data.projectId;
        } catch {
          throw new Error("არასწორი clientPayload");
        }

        const expectedPrefix = `projects/${projectId}/`;
        if (!pathname.startsWith(expectedPrefix)) {
          throw new Error("არასწორი pathname");
        }

        return {
          allowedContentTypes: [...ALLOWED_TYPES],
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: false,
          tokenPayload: JSON.stringify({ projectId }),
        };
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "ატვირთვა ვერ მოხერხდა";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
