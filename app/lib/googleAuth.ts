import { google } from "googleapis";
import { getTokens } from "@/app/lib/kv";

// 初始化OAuth2客户端
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID, // 客户端ID
  process.env.GOOGLE_CLIENT_SECRET, // 客户端密钥
  "http://localhost:3000/api/auth/callback" // 重定向URI
);

// 生成一个授权URL
const url = oauth2Client.generateAuthUrl({
  access_type: "offline", // 'offline'获取refresh token
  // prompt: "consent",
  scope: [
    "https://www.googleapis.com/auth/drive.metadata.readonly",
    "https://www.googleapis.com/auth/drive.readonly",
  ], // 需要查询Google Drive的scope
});

// 稍后用于交换授权码的方法
const exchangeToken = async (code: string) => {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

async function getDrive() {
  const { access_token, refresh_token } = await getTokens();

  if (!access_token || !refresh_token) {
    throw new Error("Access token or refresh token not found");
  }

  oauth2Client.setCredentials({
    access_token: access_token,
    refresh_token: refresh_token,
  });

  const drive = google.drive({ version: "v3", auth: oauth2Client });

  return drive;
}

export { getDrive, url, exchangeToken };
