import {
  UpgradeModalLayout,
  ColumnImages,
} from "@/layouts/upgrade-modal-layout";
import React from "react";

export default function Playground() {
  return (
    <main>
      <UpgradeModalLayout
        hero={
          <ColumnImages
            src={[
              "/lsd/pro/hero-columns/01.png",
              "/lsd/pro/hero-columns/02.png",
              "/lsd/pro/hero-columns/03.png",
              "/lsd/pro/hero-columns/04.png",
              "/lsd/pro/hero-columns/05.png",
              "/lsd/pro/hero-columns/06.png",
            ]}
          />
        }
      >
        <>
          <h1>LSD Closed Beta</h1>
          <p>
            Welcome to LSD Closed Beta. Please sign in with Google to continue.
          </p>
          <button>Continue with Google</button>
        </>
      </UpgradeModalLayout>
    </main>
  );
}
