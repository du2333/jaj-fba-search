import { url } from "@/app/lib/googleAuth";
import { Button } from "@/components/ui/button";

const LoginPage = () => {
  // Google 登录授权 URL 的状态
  return (
    <div>
      {url && (
        <div className="flex w-full h-screen justify-center items-center m-auto">
          <Button size="lg">
            <a href={url}>Login with Google</a>
          </Button>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
