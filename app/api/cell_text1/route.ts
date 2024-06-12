import { getSheet } from "@/app/lib/googleAuth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const fieldId = searchParams.get("fieldId");

    try {
        const sheet = await getSheet();
        const result = await sheet.spreadsheets.values.get({
            spreadsheetId: fieldId as string,
            range: "F10",
        });

        return Response.json(result.data.values);
    } catch (error) {
        if (error instanceof Error) {
            return Response.json({ error: error.message }, { status: 500 });
        }
    }
}