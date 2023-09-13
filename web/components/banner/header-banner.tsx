import React from "react";
import { Cross1Icon } from "@radix-ui/react-icons";

export function HeaderBanner({}: React.PropsWithChildren<{}>) {
  return (
    <div className="w-screen fixed top-0 z-50">
      <div className="w-auto flex flex-row items-center justify-center border-b border-opacity-10 border-white min-h-[40px] bg-black bg-opacity-5 backdrop-blur-xl p-4">
        <p className="text-center">
          <b>Picking a new packs?</b> | The reviews say it all. Start now from
          $9 through Sept 14.
          <br />
          <b>1 day left!</b>
        </p>
      </div>
      <div className="absolute top-0 bottom-0 right-4 flex items-center justify-center">
        <button className="p-3 bg-black rounded-full hover:invert">
          <Cross1Icon />
        </button>
      </div>
    </div>
  );
}
