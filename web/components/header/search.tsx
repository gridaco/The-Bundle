'use client'

import { TextField } from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Search() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const onEnter = () => {
    router.push(`/s/${query}`)
  }

  return <TextField.Root
    className="flex items-center gap-4 rounded bg-neutral-800 p-4 border border-neutral-700 w-auto min-w-[400px]">
    <TextField.Slot >
      <MagnifyingGlassIcon />
    </TextField.Slot>
    <TextField.Input className="outline-none bg-transparent w-full"
      placeholder="3D Objects, Materials, Packs and Colors..."
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onEnter()
        }
      }}
      onChange={(e) => {
        setQuery(e.target.value)
      }}
    />
  </TextField.Root>
}