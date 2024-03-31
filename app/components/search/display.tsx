export default function Page({ text }: { text: string }) {
  // 提取11位数字
  const match = text.match(/\d{11}/);
  const id = match ? match[0] : null;

  // 使用id来分割字符串
  const splitText = text.split(id || "");

  // 前半部分
  const preText = splitText[0];
  // 后半部分
  const postText = splitText[1];

  // 根据id查找pdf文件并生成下载链接
  const downloadLink = id ? `/api/pdf?name=${id}` : "";

  return (
    <div>
      <span>{preText}</span>
      <a
        href={downloadLink}
        style={{
          color: "blue",
          textDecoration: "underline",
          cursor: "pointer",
        }}
      >
        {id}
      </a>
      <span>{postText}</span>
    </div>
  );
}
