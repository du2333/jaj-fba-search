import { getToken } from "@/app/lib/googleAuth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function callback(req: NextApiRequest, res: NextApiResponse) {
  const code = req.query.code as string;
  try {
    // 获取 tokens
    const {access_token, refresh_token } = await getToken(code);

    process.env.ACCESS_TOKEN = access_token || "";
    process.env.REFRESH_TOKEN = refresh_token || "";

    // 授权成功的处理，如重定向到一个表名成功的页面
    res.redirect("/auth/success");
  } catch (error) {
    if (error instanceof Error) {
      // 错误处理
      res.status(500).json({ error: error.message });
    }
  }
}
