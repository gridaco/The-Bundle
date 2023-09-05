import Link from "next/link";

export default function LibraryPage() {
  return (
    <>
      <Link
        href="/library/download?item=m.copper-a.zip"
        download
        target="_blank"
      >
        <button>Download Copper-A</button>
      </Link>
    </>
  );
}
