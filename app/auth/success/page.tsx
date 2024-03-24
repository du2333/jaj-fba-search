'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Success() {
  const router = useRouter();

  useEffect(() => {
    // 应用登录逻辑，例如设置全局状态，获取用户信息等

    // 之后，根据业务需求重定向用户
    setTimeout(() => {
      router.replace("/search");
    }, 3000);
  }, [router]);
  return (
    <div>
      <h1>Login Successful!</h1>
      <p>Welcome back! Redirecting you to the home page...</p>
    </div>
  );
}
