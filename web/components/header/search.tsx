'use client'

import { TextField } from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"

export function SearchBar() {
  return <TextField.Root className="flex items-center gap-4 rounded bg-neutral-800 p-4 border border-neutral-700">
    <TextField.Slot >
      <MagnifyingGlassIcon />
    </TextField.Slot>
    <TextField.Input className="outline-none bg-transparent w-full"
      placeholder="3D Objects, Materials, Packs and Colors..."
    />
  </TextField.Root>
}