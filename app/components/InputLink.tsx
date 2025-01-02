"use client"
import React, { useState } from 'react'

interface InputLinkProps {
  onFetchTitle: (url: string) => void;
}

export const InputLink:React.FC<InputLinkProps> = ({onFetchTitle}) => {
  const [inputText, setInputText] = useState<string>("");

  const activeEnter = (e: any) => {
    if(e.key === "Enter") {
      e.preventDefault();
      onFetchTitle(inputText);
    }
  }
  const handleButtonClick = (e: any) => {
    e.preventDefault();
    onFetchTitle(inputText);
  }

  return (
  <div className="w-72 m-10 items-center content-center justify-center flex">
  <div className="relative w-full min-w-[200px] h-10 flex flex-row">
    <input
      onChange={(e) => setInputText(e.target.value)}
      onKeyDown={(e) => activeEnter(e)}
      className="shadow-md peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-lg border-blue-gray-200 focus:border-sky-300"
      placeholder=" " />
    <label
      className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900 before:border-blue-gray-200 peer-focus:before:!border-sky-300 after:border-blue-gray-200 peer-focus:after:!border-sky-300">URL
    </label>
  </div>
  <button type="button" className="h-10 shadow-md peer items-center py-2.5 px-3 ms-2 text-white bg-[#1ED760] rounded-lg border focus:border-green-950" onClick={handleButtonClick}>
        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
        </svg>
    </button>
</div>  
  )
}
