'use client'

import SearchBar from "@/app/ui/searchBar";

export default function SearchPage() {
  // 处理搜索逻辑
  const handleSearch = async (searchTerm: string) => {
    // 发送搜索请求到/api/search
    const response = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: searchTerm }),
    });

    if (!response.ok) {
      // 错误处理
      console.error("Search failed", response);
    } else {
      const data = await response.json();
      // 处理搜索结果，如显示搜索结果
      console.log(data);
    }
  };

  return <SearchBar placeholder="Seach here..." onSearch={handleSearch}/>;
}
