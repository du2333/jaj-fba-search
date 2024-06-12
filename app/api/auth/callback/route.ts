import { NextRequest, NextResponse } from "next/server";
import { exchangeToken } from "@/app/lib/googleAuth";
import { setTokens } from "@/app/lib/db";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Code query parameter is required" },
      { status: 400 }
    );
  }

  try {
    // 交换授权码获取访问令牌 和 刷新令牌 存到数据库
    const { access_token, refresh_token } = await exchangeToken(code);

    if (!access_token || !refresh_token) {
      throw new Error("Access token or refresh token not found");
    }

    setTokens(access_token, refresh_token);

    // 授权成功的处理，如重定向到一个表名成功的页面
    return NextResponse.redirect("/auth/success");
  } catch (error) {
    if (error instanceof Error) {
      // 错误处理
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
