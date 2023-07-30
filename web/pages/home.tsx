import React from "react";
import {
  UpgradeToProSplashView,
  ColumnImages,
  UpgradeToProPlansView,
  UpgradeToProBadge,
} from "@/scaffold/upgrade";
import { TemplateDropdown } from "@/scaffold/home";
import { Dialog } from "@/components/dialog";

export default function Home() {
  return (
    <main>
      <TemplateDropdown />
      <UpgradeToProDialog />
    </main>
  );
}

function UpgradeToProDialog() {
  const [view, setView] = React.useState<"splash" | "plans">("splash");

  return (
    <Dialog trigger={<UpgradeToProBadge />}>
      {view === "plans" ? (
        <UpgradeToProPlansView />
      ) : (
        <UpgradeToProSplashView
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
            <h1>Upgrade to Pro</h1>
            <p>
              Upgrade to Pro and get access to exclusive templates and xxx.
              {/* TODO: update text */}
            </p>
            <button
              onClick={() => {
                setView("plans");
              }}
            >
              View Plans
            </button>
          </>
        </UpgradeToProSplashView>
      )}
    </Dialog>
  );
}
