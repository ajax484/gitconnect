"use client";
import { useState, useMemo } from "react";

type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

interface UseSearchProps<T> {
  data: T[];
  accessorKey: StringKeys<T>[];
}

const useSearch = <T>({ data, accessorKey }: UseSearchProps<T>) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const searchedData = useMemo(() => {
    return data.filter((item) =>
      accessorKey.some((key) => {
        if (!searchTerm) return true;

        const value = item[key];
        if (!value) return false;

        if (typeof value === "string") {
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (Array.isArray(value)) {
          return value.some((innerValue) =>
            typeof innerValue === "string"
              ? innerValue.toLowerCase().includes(searchTerm.toLowerCase())
              : false
          );
        }
        return false;
      })
    );
  }, [data, accessorKey, searchTerm]);

  return { searchedData, searchTerm, setSearchTerm };
};

export default useSearch;
