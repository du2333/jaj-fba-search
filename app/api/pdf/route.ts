import { getDrive } from "@/app/lib/googleAuth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const name = searchParams.get("name");

  try {
    const drive = await getDrive();
    const result = await drive.files.list({
      q: `name contains '${name}' and mimeType = 'application/pdf' and trashed = false`,
      fields: "files(id, name, mimeType)",
      spaces: "drive",
    });

    if (!result.data.files || result.data.files.length === 0) {
      return Response.json({ message: "亲，还没有您的POD呢~ 请稍等查询" });
    }

    const fileId = result.data.files[0].id;
    const filename = result.data.files[0].name;

    const file = await drive.files.get(
      {
        fileId: fileId as string,
        alt: "media",
      },
      { responseType: "stream" }
    );

    const stream = file.data;

    const headers = new Headers({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(
        filename || "file"
      )}"`,
    });

    const responseStream = new ReadableStream({
      start(controller) {
        stream.on("data", (chunk) => {
          controller.enqueue(chunk);
        });

        stream.on("end", () => {
          controller.close();
        });

        stream.on("error", (err) => {
          controller.error(err);
        });
      },
    });

    return new NextResponse(responseStream, { headers });
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }
}
