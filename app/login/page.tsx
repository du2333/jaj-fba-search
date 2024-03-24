import { url } from "@/app/lib/googleAuth";

const LoginPage = () => {
  // Google 登录授权 URL 的状态
  return (
    <div>
      {url && (
        <a href={url}>
          Login with Google
        </a>
      )}
    </div>
  );
};

export default LoginPage;
