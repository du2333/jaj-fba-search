import type { NextApiRequest, NextApiResponse } from "next";

import { getDrive } from "@/app/lib/googleAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // 提取搜索词
    const { query } = req.body;

    try {
      const drive = await getDrive();
      // 调用谷歌驱动搜索文件
      const result = await drive.files.list({
        q: `name contains '${query}'`,
      });

      // 发送响应
      res.status(200).json(result.data);
    } catch (error) {
      if (error instanceof Error) {
        // 处理错误
        res.status(500).json({ error: error.message });
      }
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

