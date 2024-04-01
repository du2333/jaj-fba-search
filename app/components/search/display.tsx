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
    components = (
      <div>
        {text}
      </div>
    );
  } else {
    components = <div>亲~ 未查询到BOL，请稍后查询</div>;
  }

  return (
    <div className="text-lg m-4">{components}</div>
  );
}
