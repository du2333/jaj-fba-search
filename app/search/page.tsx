"use client";

import SearchBar from "@/app/components/search/searchBar";
import Display from "@/app/components/search/display";
import { useState } from "react";

export default function SearchPage() {
  const [searchResult, setSearchResult] = useState("");

  const handleSearch = async (searchTerm: string) => {
    // 发送搜索请求到/api/search
    const response = await fetch(
      `/api/search?query=${encodeURIComponent(searchTerm)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      // 错误处理
      console.error("Search failed", await response.json());
      setSearchResult("An error occurred");
    } else {
      const fileId = await response.json();

      if (fileId.message) {
        setSearchResult(fileId.message);
        return;
      }
      // 发送请求到/api/cell_text
      const cellResponse = await fetch(`/api/cell_text?fileId=${fileId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!cellResponse.ok) {
        // 错误处理
        console.error("Cell text failed", await cellResponse.json());
      } else {
        const cellData = await cellResponse.json();
        console.log(cellData);
        // 处理单元格文本
        setSearchResult(JSON.stringify(cellData[0][0]));
      }
    }
  };

  return (
    <div>
      <SearchBar placeholder="Seach here..." onSearch={handleSearch} />
      <Display text={searchResult} />
    </div>
  );
}
