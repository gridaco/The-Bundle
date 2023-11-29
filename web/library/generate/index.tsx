'use client'

import Image from "next/image";
import { use, useState } from "react";


interface DALLE3Image {
  url: string
  width?: number
  height?: number
  revised_prompt: string
}


const generate = ({ prompt }: {
  prompt: string
}) => fetch("/bundle/generate", {
  body: JSON.stringify({
    prompt
  }),
  method: 'POST',
});

export function Generate({
  defaultValue
}: {
  defaultValue: string
}) {

  const [value, setValue] = useState(defaultValue)
  const [results, setResults] = useState<DALLE3Image[]>([])
  const [loading, setLoading] = useState(false)

  const onClick = () => {
    setLoading(true)
    generate({ prompt: value }).then(async (res) => {
      const data = await res.json()
      console.log(data)
      setResults([...data])
    }).finally(() => {
      setLoading(false)
    })
  }

  return <div>
    <input
      value={value}
      onChange={(e) => {
        setValue(e.target.value)
      }}
    />

    <button
      className="p-4 bg-white text-black rounded w-40"
      onClick={onClick}
      disabled={loading}
    >
      Generate
    </button>

    {results.map(({ url, revised_prompt }, i) => {
      return <div key={i}>
        <Image src={url} width={1024} height={1024} alt={revised_prompt} />
        <p>{revised_prompt}</p>
      </div>
    })}
  </div>
}