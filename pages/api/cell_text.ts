import type { NextApiRequest, NextApiResponse } from "next";

import { getSheet } from "@/app/lib/googleAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { fileId } = req.query;

    try {
      const sheet = await getSheet();
      const result = await sheet.spreadsheets.values.get({
        spreadsheetId: fileId as string,
        range: "F10",
      });

      res.status(200).json(result.data.values);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
