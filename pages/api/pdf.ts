import type { NextApiRequest, NextApiResponse } from "next";

import { getDrive } from "@/app/lib/googleAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { name } = req.query;

    try {
      const drive = await getDrive();
      const result = await drive.files.list({
        q: `name contains '${name}' and mimeType = 'application/pdf' and trashed = false`,
        fields: "files(id, name, mimeType)",
        spaces: "drive",
      });

      if (!result.data.files || result.data.files.length === 0) {
        res.status(200).json({ message: "No files found" });
        return;
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

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );

      res.status(200).send(file.data);
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
