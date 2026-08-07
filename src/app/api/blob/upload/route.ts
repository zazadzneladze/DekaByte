import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_DOC_BYTES = 20 * 1024 * 1024;

const IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

const DOC_TYPES = ["application/pdf", ...IMAGE_TYPES] as const;

const payloadSchema = z.discriminatedUnion("purpose", [
  z.object({
    purpose: z.literal("portfolio"),
    projectId: z.string().uuid(),
  }),
  z.object({
    purpose: z.literal("client-asset"),
    projectId: z.string().uuid(),
  }),
  z.object({
    purpose: z.literal("client-invoice"),
    projectId: z.string().uuid(),
  }),
  z.object({
    purpose: z.literal("client-avatar"),
  }),
  z.object({
    purpose: z.literal("site-logo"),
  }),
  z.object({
    purpose: z.literal("invoice-supplier-signature"),
  }),
  z.object({
    purpose: z.literal("client-signature"),
    clientUserId: z.string().uuid(),
  }),
]);

function normalizePayload(raw: unknown): unknown {
  if (!raw || typeof raw !== "object") return raw;
  if (!("purpose" in raw) && "projectId" in raw) {
    return { purpose: "portfolio", ...(raw as object) };
  }
  return raw;
}

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
        let raw: unknown = null;
        try {
          raw = clientPayload ? JSON.parse(clientPayload) : null;
        } catch {
          throw new Error("არასწორი clientPayload");
        }

        const parsed = payloadSchema.safeParse(normalizePayload(raw));
        if (!parsed.success) {
          throw new Error("არასწორი clientPayload");
        }

        const role = session.user.role;
        const isAdmin = role === "admin" || session.user.isAdmin === true;
        const data = parsed.data;

        if (data.purpose === "portfolio") {
          if (!isAdmin) throw new Error("უფლება არ გაქვთ");
          if (!pathname.startsWith(`projects/${data.projectId}/`)) {
            throw new Error("არასწორი pathname");
          }
          return {
            allowedContentTypes: [...IMAGE_TYPES],
            maximumSizeInBytes: MAX_IMAGE_BYTES,
            addRandomSuffix: false,
            tokenPayload: JSON.stringify(data),
          };
        }

        if (data.purpose === "client-asset") {
          if (!isAdmin) throw new Error("უფლება არ გაქვთ");
          if (!pathname.startsWith(`client-projects/${data.projectId}/`)) {
            throw new Error("არასწორი pathname");
          }
          return {
            allowedContentTypes: [...DOC_TYPES],
            maximumSizeInBytes: MAX_DOC_BYTES,
            addRandomSuffix: true,
            tokenPayload: JSON.stringify(data),
          };
        }

        if (data.purpose === "client-invoice") {
          if (!isAdmin) throw new Error("უფლება არ გაქვთ");
          if (!pathname.startsWith(`client-invoices/${data.projectId}/`)) {
            throw new Error("არასწორი pathname");
          }
          const isSignature = pathname.includes("/signatures/");
          return {
            allowedContentTypes: isSignature
              ? [...IMAGE_TYPES]
              : ["application/pdf"],
            maximumSizeInBytes: isSignature ? MAX_IMAGE_BYTES : MAX_DOC_BYTES,
            addRandomSuffix: isSignature,
            tokenPayload: JSON.stringify(data),
          };
        }

        if (data.purpose === "site-logo") {
          if (!isAdmin) throw new Error("უფლება არ გაქვთ");
          if (!pathname.startsWith("brand/logo")) {
            throw new Error("არასწორი pathname");
          }
          return {
            allowedContentTypes: [...IMAGE_TYPES],
            maximumSizeInBytes: MAX_IMAGE_BYTES,
            addRandomSuffix: true,
            tokenPayload: JSON.stringify(data),
          };
        }

        if (data.purpose === "invoice-supplier-signature") {
          if (!isAdmin) throw new Error("უფლება არ გაქვთ");
          if (!pathname.startsWith("brand/invoice-supplier-signature")) {
            throw new Error("არასწორი pathname");
          }
          return {
            allowedContentTypes: [...IMAGE_TYPES],
            maximumSizeInBytes: MAX_IMAGE_BYTES,
            addRandomSuffix: false,
            tokenPayload: JSON.stringify(data),
          };
        }

        if (data.purpose === "client-signature") {
          const isOwnClientSignature =
            role === "client" && data.clientUserId === session.user.id;
          if (!isAdmin && !isOwnClientSignature) {
            throw new Error("უფლება არ გაქვთ");
          }
          if (
            !pathname.startsWith(`client-signatures/${data.clientUserId}/`)
          ) {
            throw new Error("არასწორი pathname");
          }
          return {
            allowedContentTypes: [...IMAGE_TYPES],
            maximumSizeInBytes: MAX_IMAGE_BYTES,
            addRandomSuffix: false,
            allowOverwrite: true,
            tokenPayload: JSON.stringify(data),
          };
        }

        // client-avatar
        if (role !== "client") throw new Error("უფლება არ გაქვთ");
        if (!pathname.startsWith(`client-avatars/${session.user.id}/`)) {
          throw new Error("არასწორი pathname");
        }
        return {
          allowedContentTypes: [...IMAGE_TYPES],
          maximumSizeInBytes: MAX_IMAGE_BYTES,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            purpose: "client-avatar",
            userId: session.user.id,
          }),
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
