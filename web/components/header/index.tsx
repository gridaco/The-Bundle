import { Logo } from "@/components/logo";
import Link from "next/link";
import { Search } from "./search";
import { Actions } from "./actions";
import { SlashIcon } from "@radix-ui/react-icons"

export default function Header() {
  return <header className="sticky top-0 flex flex-row items-center px-5 py-2 md:px-10 md:py-5 border-b border-white/10 bg-black z-40 gap-4 sm:gap-8 md:gap-10">
    <div>
      {/* <span>Grida</span> */}
      {/* <SlashIcon /> */}
      <Link href="/">
        <Logo className="fill-white w-16 sm:w-32 md:w-40" />
      </Link>
    </div>
    <div className="hidden lg:flex gap-4">
      <Link href="/">
        Library
      </Link>
      <Link href="/gallery">
        Explore
      </Link>
    </div>
    <div className="flex-1 max-w-screen-sm min-w-[240px]">
      <Search />
    </div>
    {/* spacer */}
    {/* <div className="hidden md:flex " /> */}
    <div className="hidden md:flex flex-1 gap-4 items-center justify-end">
      <Actions />
    </div>
  </header>
}