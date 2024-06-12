import { getSheet } from "@/app/lib/googleAuth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const fileId = searchParams.get("fileId");

    try {
        const sheet = await getSheet();
        const result = await sheet.spreadsheets.values.get({
          spreadsheetId: fileId as string,
          range: "F10",
        });

        return Response.json(result.data.values);
    } catch (error) {
        if (error instanceof Error) {
            return Response.json({ error: error.message }, { status: 500 });
        }
    }
}