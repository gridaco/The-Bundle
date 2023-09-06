import Image from "next/image";

export function Gallery() {
  const items = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];
  return (
    <div className="grid grid-cols-2 place-items-center gap-4">
      {/* Updated this line */}
      {items.map((it, i) => (
        <div key={i}>
          <Image
            // className="w-fit"
            src={`/bundle/gallery/${it}.png`}
            width={340}
            height={340}
            alt={it}
          />
        </div>
      ))}
    </div>
  );
}
