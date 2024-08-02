"use client";
import { useState } from "react";
import { Info } from "./components/Info";
import { InputLink } from "./components/InputLink";
import axios from "axios";
import "./globals.css"

export default function Home() {
  const [title, setTitle] = useState<string>("")
  const [artist, setArtist] = useState<string>("")
  const [imgURL, setImgURL] = useState<string>("")

  const fetchTitle = async (url: any) => {
    try {
        const response = await axios.get(`/api/fetch?url=${encodeURIComponent(url)}`);
        setTitle(response.data.title);
        setArtist(response.data.artist);
        setImgURL(response.data.imgURL);
        //console.log(response.data)
    } catch (error) {
        console.error(error);
    }
  };

  return (
    <main>
      <div className="w-screen h-screen flex flex-col content-center items-center justify-center bg-[#F2F2F2]">
    {title && artist && imgURL ? <Info title={title} artist={artist} imgURL={imgURL}/>:<h1 className=" font-extrabold text-transparent text-xl bg-clip-text bg-gradient-to-t from-[#3cba92] to-[#0ba360] text-center">input your Spotify songs URL.</h1>
}
        <InputLink onFetchTitle={fetchTitle} />
      </div>
    </main>
  );
}