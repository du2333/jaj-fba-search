"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";

export default function SearchBar({
  placeholder,
  onSearch,
  isLoading,
}: {
  placeholder: string;
  onSearch: (searchTerm: string) => Promise<void>;
  isLoading: boolean;
}) {
  const [searchValue, setSearchValue] = useState("");
  const handleSearch = async (event: FormEvent) => {
    event.preventDefault();

    // 调用传入的onSearch函数，处理搜索逻辑
    if (searchValue.trim() !== "") {
      await onSearch(searchValue);
      setSearchValue("");
    }
  };

  return (
    <form className="w-full" onSubmit={handleSearch}>
      <div className="flex flex-col gap-y-2 md:flex-row justify-between">
        <Input
          type="search"
          id="default-search"
          placeholder={placeholder}
          required
          onChange={(e) => setSearchValue(e.target.value)}
          value={searchValue}
          className="h-12"
        />
        <Button type="submit" className="ml-1 bg-[#ff5f13] rounded-md h-12" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Please wait" : "Search"}
        </Button>
      </div>
    </form>
  );
}
