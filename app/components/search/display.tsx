import { Button } from "@/components/ui/button";

export default function Page({
  text,
  isFound,
}: {
  text: string;
  isFound: boolean;
}) {
  let components = <div></div>;
  if (isFound) {
    // 提取6到15位数字
    const match = text.match(/\d{6,15}/);
    const id = match ? match[0] : null;

    // 根据id查找pdf文件并生成下载链接
    const downloadLink = id ? `/api/pdf?name=${id}` : "";

    const handleClick = () => {
      window.open(downloadLink);
    };

    components = (
      <div className="flex flex-col m-4">
        {text}
        <br />
        {text && (
          <Button
            variant="link"
            onClick={handleClick}
          >
            Download POD
          </Button>
        )}
      </div>
    );
  } else {
    components = <div className="m-3 text-center">亲~ 未查询到BOL，请稍后查询</div>;
  }

  return <div className="m-4 font-medium">{components}</div>;
}
