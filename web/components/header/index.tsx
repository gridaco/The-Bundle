import { Logo } from "@/components/logo";
import Link from "next/link";
import { Search } from "./search";
import { Actions } from "./actions";
import { SlashIcon } from "@radix-ui/react-icons"

export default function Header() {
  return <header className="sticky top-0 flex flex-row items-center px-10 py-5 gap-10 border-b border-white/10 bg-black z-40">
    <div>
      {/* <span>Grida</span> */}
      {/* <SlashIcon /> */}
      <Link href="/">
        <Logo className="fill-white" />
      </Link>
    </div>
    <div className="flex gap-4">
      <Link href="/">
        Library
      </Link>
      <Link href="/gallery">
        Explore
      </Link>
    </div>
    <div className="flex-1 max-w-screen-sm">
      <Search />
    </div>
    {/* spacer */}
    <div className="flex-1" />
    <Actions />
  </header>
}