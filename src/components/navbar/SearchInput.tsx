"use client";
import { Input } from "@heroui/input";
import React from "react";
import { SearchIcon } from "@/components/icons";

interface SearchInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    autoFocus?: boolean;
}

export function SearchInput({ value, onChange, autoFocus }: SearchInputProps) {
    return (
        <Input
            aria-label="Buscar"
            classNames={{
                inputWrapper: "bg-default-100/70 dark:bg-zinc-800/70 backdrop-blur-sm border border-default-200/50 dark:border-zinc-700/50 hover:bg-default-200/50 dark:hover:bg-zinc-700/50 transition-colors",
                input: "text-sm",
            }}
            labelPlacement="outside"
            placeholder="Buscar..."
            value={value}
            onChange={onChange}
            startContent={
                <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
            }
            type="search"
            autoFocus={autoFocus}
            tabIndex={0}
        />
    );
}

export default SearchInput;