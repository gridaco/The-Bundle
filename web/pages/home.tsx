import React from "react";
import {
  UpgradeToProSplashView,
  ColumnImages,
  UpgradeToProPlansView,
  UpgradeToProBadge,
} from "@/scaffold/upgrade";
import { TemplateDropdown } from "@/scaffold/home";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";

export default function Home() {
  return (
    <main>
      <TemplateDropdown />
      <UpgradeToProBadge />
      <UpgradeToProDialog />
    </main>
  );
}

function UpgradeToProDialog() {
  const [view, setView] = React.useState<"splash" | "plans">("splash");

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="Button violet">Upgrade</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          {view === "plans" ? (
            <>
              <UpgradeToProPlansView />
            </>
          ) : (
            <>
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
                    You’ve reached daily quota limit for Free tier limit.
                    Upgrade to Pro and get access to exclusive templates and
                    xxx.
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
            </>
          )}

          <Dialog.Close asChild>
            <button className="IconButton" aria-label="Close">
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
