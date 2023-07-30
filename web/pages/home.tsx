import React, { useEffect } from "react";
import {
  UpgradeToProSplashView,
  ColumnImages,
  UpgradeToProPlansView,
  UpgradeToProBadge,
} from "@/scaffold/upgrade";
import { TemplateDropdown } from "@/scaffold/home";
import { Dialog } from "@/components/dialog";
import { useRouter } from "next/router";

/**
 * Modal that shows when with a successful pro activation with stripe checkout callback.
 * To mock this view, add `?return-reason=pro-activated` to the url.
 */
function ProActivatedPortal() {
  const [activated, setActivated] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  useEffect(() => {
    if (router.query["return-reason"] === "pro-activated") {
      setActivated(true);
    }
  }, [router.query]);

  useEffect(() => {
    if (activated) {
      setOpen(true);
    }
  }, [activated]);

  return (
    <Dialog open={open}>
      Pro activated
      <button
        onClick={() => {
          setOpen(false);
        }}
      >
        close
      </button>
    </Dialog>
  );
}

export default function Home() {
  return (
    <main>
      <ProActivatedPortal />
      <TemplateDropdown />
      <UpgradeToProDialog />
    </main>
  );
}

function UpgradeToProDialog() {
  const router = useRouter();
  const [view, setView] = React.useState<"splash" | "plans">("splash");

  return (
    <Dialog trigger={<UpgradeToProBadge />}>
      {view === "plans" ? (
        <UpgradeToProPlansView
          onUpgradeClick={(price) => {
            // POST
            router.push(`/api/checkout/sessions?price=${price}`);
          }}
        />
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
