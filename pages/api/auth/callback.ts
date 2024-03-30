import { exchangeToken } from "@/app/lib/googleAuth";
import { NextApiRequest, NextApiResponse } from "next";
import { setTokens } from "@/app/lib/db";

export default async function callback(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const code = req.query.code as string;
  try {
    //  交换授权码获取访问令牌 和 刷新令牌 存到数据库
    const { access_token, refresh_token } = await exchangeToken(code);

    if (!access_token || !refresh_token) {
      throw new Error("Access token or refresh token not found");
    }

    setTokens(access_token, refresh_token);

    // 授权成功的处理，如重定向到一个表名成功的页面
    res.redirect("/auth/success");
  } catch (error) {
    if (error instanceof Error) {
      // 错误处理
      res.status(500).json({ error: error.message });
    }
  }
}
