"use client";

import SearchBar from "@/app/components/search/searchBar";
import Display from "@/app/components/search/display";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SearchPage() {
  const [searchResult, setSearchResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFound, setIsFound] = useState(true);

  const handleSearch = async (searchTerm: string) => {
    setIsFound(true);
    setIsLoading(true);
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
        setIsFound(false);
        setIsLoading(false);
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
    setIsLoading(false);
  };

  return (
    <div>
      <SearchBar
        placeholder="Enter the PO/FBA number..."
        onSearch={handleSearch}
        isLoading={isLoading}
      />
      <div className="mx-auto mt-4 max-w-md p-4 border border-gray-300 shadow-lg rounded-lg bg-white">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-[328px]" />
            <Skeleton className="h-4 w-[328px]" />
            <Skeleton className="h-4 w-[290px]" />
          </div>
        ) : (
          <Display text={searchResult} isFound={isFound} />
        )}
      </div>
    </div>
  );
}
