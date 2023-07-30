import { ContinueWithGoogleButton } from "@/components/continue-with-google-button";
import {
  UpgradeModalLayout,
  ColumnImages,
} from "@/layouts/upgrade-modal-layout";
import { TemplateDropdown } from "@/scaffold/home";
import React from "react";

export default function Home() {
  return (
    <main>
      <TemplateDropdown />
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
          <ContinueWithGoogleButton />
        </>
      </UpgradeModalLayout>
    </main>
  );
}
