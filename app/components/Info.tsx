import Image from 'next/image';
import React, { useState } from 'react'
import {CopyToClipboard} from 'react-copy-to-clipboard';

interface InfoProps {
    title: string;
    artist: string;
    imgURL: string;
}

export const Info:React.FC<InfoProps> = ({title, artist, imgURL}) => {
    const info = title+" - "+artist

    return (
        <>
            {title && artist && imgURL && (
                <div className='shadow-xl border p-5 m-5 flex flex-col justify-center items-center'>
                <Image onContextMenu={e=> e.preventDefault()} className='mb-5 shadow-md' src={imgURL} alt="설명" width={300} height={300}/>
                <CopyToClipboard
                    text={info}
                    onCopy={() => alert("copyed. "+info)}
                >
                <p className='font-bold cursor-pointer'>{title} - {artist}</p>
                </CopyToClipboard>
                    <div className='flex pt-5'>
                        <CopyToClipboard
                            text={title}
                            onCopy={() => alert("copied. "+title)}
                        >
                        <button type="button" className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Copy Title</button>
                        </CopyToClipboard>
                        <CopyToClipboard
                            text={artist}
                            onCopy={() => alert("copied. "+artist)}
                        >
                            <button type="button" className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Copy Artist</button>
                        </CopyToClipboard>
                    </div>
                </div>
        )}
        </>
    )
}
