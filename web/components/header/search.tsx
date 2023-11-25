'use client'

import { useState } from "react";
import { useWindowSize } from "@uidotdev/usehooks";
import { TextField } from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation";

const placeholders = {
  _: "Search",
  md: "3D Objects, Materials, Packs and Colors...",
} as const


export function Search() {
  const size = useWindowSize();
  const [query, setQuery] = useState("")
  const router = useRouter()

  const placeholder = (size?.width ?? 1280) > 768 ? placeholders.md : placeholders._

  const onEnter = () => {
    router.push(`/s/${query}`)
  }

  return <TextField.Root
    className="flex items-center gap-4 rounded bg-neutral-800 p-2 md:p-3 border border-neutral-700 w-auto">
    <TextField.Slot >
      <MagnifyingGlassIcon />
    </TextField.Slot>
    <TextField.Input className="outline-none bg-transparent w-full h-auto"
      placeholder={placeholder}
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