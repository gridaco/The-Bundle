import { Logo } from "@/components/logo";
import Link from "next/link";
import { SearchBar } from "./search";
import { Button } from "@radix-ui/themes";

export default function Header() {
  return <header className="fixed top-0 left-0 right-0 flex flex-row items-center p-10 gap-10">
    <Link href="/">
      <Logo className="fill-white" />
    </Link>
    <div className="flex gap-4">
      <Link href="/library">
        Library
      </Link>
      <Link href="/gallery">
        Explore
      </Link>
    </div>
    <div className="flex-1 max-w-screen-sm">
      <SearchBar />
    </div>
    {/* spacer */}
    <div className="flex-1" />
    <div className="flex gap-4">
      <Button className="bg-white text-black rounded-md p-4 font-medium">
        <Link href="/library">
          Subscribe
        </Link>
      </Button>
      <Button className="bg-black text-white rounded-md p-4 font-medium">
        <Link href="/library">
          Sign In
        </Link>
      </Button>
    </div>
  </header>
}