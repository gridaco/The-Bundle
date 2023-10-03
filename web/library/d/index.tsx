"use client";
import Link from "next/link";
import { Tabs } from "@radix-ui/themes";
import Image from "next/image";

export function Content() {
  return (
    <Tabs.Root className="mt-12">
      <Tabs.List className="justify-start">
        <Tabs.Trigger value="download">Download</Tabs.Trigger>
        <Tabs.Trigger value="purchase">Purchases</Tabs.Trigger>
      </Tabs.List>
      <div className="pt-12">
        <Tabs.Content value="download">
          <div>
            {[1, 2, 3].map((item, i) => (
              <Link key={i} href={"/library/"}>
                <ListItem />
              </Link>
            ))}
          </div>
        </Tabs.Content>
        <Tabs.Content value="purchase">
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((item, i) => (
              <Link key={i} href={"/library/"}>
                <ListItem />
              </Link>
            ))}
          </div>
        </Tabs.Content>
      </div>
    </Tabs.Root>
  );
}

function ListItem() {
  return (
    <div className="flex flex-row p-4 border border-white border-opacity-10">
      <Image
        src={"/bundle/thumbnails/cmp.aluminium-foil/99.png"}
        alt="."
        width={160}
        height={160}
      />
      <div className="p-4">
        <h4 className="text-md hover:underline">Item</h4>
        <p className="opacity-80 text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
        </p>
      </div>
    </div>
  );
}
