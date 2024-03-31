import type { NextApiRequest, NextApiResponse } from "next";

import { getDrive } from "@/app/lib/googleAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    // 提取搜索词
    const { query } = req.query;

    try {
      const drive = await getDrive();
      const result = await drive.files.list({
        q: `name contains '-' and fullText contains '${query}' and (mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' or mimeType = 'application/vnd.google-apps.spreadsheet') and trashed = false`,
        fields: "files(id, name, mimeType)",
        spaces: "drive",
      });

      if (!result.data.files || result.data.files.length === 0) {
        res.status(200).json({ message: "No files found" });
        return;
      }

      // 优先返回Google Sheets文件
      let target = result.data.files?.find((file) => {
        return file.mimeType === "application/vnd.google-apps.spreadsheet";
      });

      if (target) {
        res.status(200).json(target.id);
        return;
      }

      // 如果找不到Google Sheets文件，找Excel文件
      target = result.data.files?.find((file) => {
        return (
          file.mimeType ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
      });

      // 使用google drive api转换成Google Sheets文件
      if (target) {
        const converted = await drive.files.copy({
          fileId: target.id as string,
          requestBody: {
            mimeType: "application/vnd.google-apps.spreadsheet",
          },
        });

        res.status(200).json(converted.data.id);
        return;
      }
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
