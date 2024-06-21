
import { getDrive } from "@/app/lib/googleAuth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("query");

  try {
    const drive = await getDrive();

    const queryString = `name contains '-' and fullText contains '${query}' and (mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' or mimeType = 'application/vnd.google-apps.spreadsheet') and trashed = false and starred = false`
    
    const result = await drive.files.list({
      q: queryString,
      fields: "files(id, name, mimeType)",
      spaces: "drive",
    });
    
    // Log the query and response for debugging
    console.log(`Google Drive API Query: ${queryString}`);
    console.log(`Google Drive API Response:`, result.data);

    if (!result.data.files || result.data.files.length === 0) {
      return NextResponse.json({ message: "No files found" });
    }

    let target = result.data.files?.find((file) => {
      return file.mimeType === "application/vnd.google-apps.spreadsheet";
    });

    if (target) {
      return NextResponse.json(target.id);
    }

    target = result.data.files?.find((file) => {
      return (
        file.mimeType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    });

    if (target) {
      const converted = await drive.files.copy({
        fileId: target.id as string,
        requestBody: {
          mimeType: "application/vnd.google-apps.spreadsheet",
        },
      });

      return NextResponse.json(converted.data.id);
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
