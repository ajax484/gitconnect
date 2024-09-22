"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";

interface SearchFieldProps {
  value: string;
  onInput: (value: string) => void;
}

export default function SearchField({ value, onInput }: SearchFieldProps) {
  return (
    <div className="relative">
      <Input
        name="q"
        placeholder="Search"
        className="pe-10"
        value={value}
        onInput={(e) => onInput(e.currentTarget.value)}
      />
      <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
    </div>
  );
}
