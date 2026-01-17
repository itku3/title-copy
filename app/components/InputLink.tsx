"use client"
import React, { useState, useRef } from 'react'
import { Search, Link } from 'lucide-react'

interface InputLinkProps {
  onFetchTitle: (url: string) => void;
}

export const InputLink: React.FC<InputLinkProps> = ({ onFetchTitle }) => {
  const [inputText, setInputText] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!inputText.trim()) return;
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onFetchTitle(inputText);
    setInputText("");
  }

  const activeEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  }

  return (
    <div className={`
      w-full max-w-md m-8 flex gap-2 p-1.5 rounded-2xl transition-all duration-300
      ${isFocused ? 'glass glow-spotify-sm' : 'glass'}
    `}>
      <div className="flex-1 flex items-center gap-3 px-4">
        <Link className={`w-5 h-5 transition-colors duration-200 ${isFocused ? 'text-spotify' : 'text-muted-foreground'}`} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Spotify URL을 입력하세요"
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={activeEnter}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-muted-foreground py-3"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="px-5 py-3 rounded-xl bg-spotify hover:bg-spotify-dark text-black font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] glow-spotify-sm flex items-center gap-2"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">검색</span>
      </button>
    </div>
  )
}
