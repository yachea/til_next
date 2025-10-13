"use client";
import styles from "@/components/SearchBar.module.css";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const onchangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // 동적 라우팅
  const router = useRouter(); // "next/navigation";
  const handleSearch = () => {
    if (!search.trim()) {
      return;
    }
    router.push(`/search?keyword=${search}`);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        value={search}
        onChange={(e) => onchangeSearch(e)}
        onKeyDown={(e) => handleKeyDown(e)}
      />
      <button onClick={handleSearch}>검색</button>
    </div>
  );
};

export default SearchBar;
