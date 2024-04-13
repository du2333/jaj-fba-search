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
    <form className="max-w-md mx-auto mt-8" onSubmit={handleSearch}>
      <div className="flex justify-between w-[400px]">
        <Input
          type="search"
          id="default-search"
          placeholder={placeholder}
          required
          onChange={(e) => setSearchValue(e.target.value)}
          value={searchValue}
        />
        <Button type="submit" className="ml-2 px-4 py-2" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Please wait" : "Search"}
        </Button>
      </div>
    </form>
  );
}
