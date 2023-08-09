import React, {
  useCallback,
  useReducer,
  useEffect,
  useMemo,
  useState,
} from "react";
import { StateProvider } from "core/states";
import { EditorAction } from "@/core/actions";
import { editorReducer } from "@/core/reducers";
import { useEditor } from "@/core/states/use-editor";
import { initstate } from "./init";
import { TemplateDropdown } from "./template-select";
import { Dialog } from "@/components/dialog";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { Client } from "api";
import { HomeHeader } from "components/header-home";
import { Canvas } from "./canvas";
import { Controller } from "./control";
import { isAscii, isNotAscii } from "utils/ascii";
import { downloadImage } from "utils/download-image";
import {
  UpgradeToProSplashView,
  ColumnImages,
  UpgradeToProPlansView,
  UpgradeToProBadge,
} from "@/scaffolds/upgrade";

const DEFAULT_CREDIT_COUNT = 10;
// const DEFAULT_SRC = "/lsd/preview/baked-001/TEXT-b.gif";
// const DEFAULT_SRC = "/lsd/preview/baked-004/lsd.jpeg";

export function Editor() {
  const [message, setMessage] = useState<string>("");
  const [credit, setCredit] = useState<number>(DEFAULT_CREDIT_COUNT);
  const [busy, setBusy] = useState<boolean>(false);
  const [src, setSrc] = useState<string>();
  const [showSnap, setShowSnap] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const client = useMemo(() => new Client(), []);

  // mock credit message
  useEffect(() => {
    // e.g.  9 of 10 credits remaining
    if (credit < DEFAULT_CREDIT_COUNT) {
      setMessage(`${credit} of 10 credits remaining`);
    }
  }, [credit]);

  // enable snap function if src is ready
  useEffect(() => {
    if (src === "" || src === undefined || src === null) {
      return;
    }
    setShowSnap(true);
  }, [src]);

  const handleDispatch = useCallback((action: EditorAction) => {
    dispatch(action);
  }, []);

  const [state, dispatch] = useReducer(editorReducer, initstate());

  return (
    <StateProvider state={state} dispatch={handleDispatch}>
      <HomeHeader left={<TemplateDropdown />} right={<UpgradeToProDialog />} />
      <Main>
        <ProActivatedPortal />

        <div className="editor">
          <div className="frame">
            <Canvas busy={busy} src={src} />
          </div>
          <div className="controller-position">
            <Controller
              showDownload={showSnap}
              onDownload={() => {
                if (src) {
                  downloadImage(src, `${text}.png`);
                } else {
                  alert("Please render first.");
                }
              }}
              onSubmit={(e) => {
                if (credit <= 0) {
                  alert("You have no credits left. Please upgrade to PRO.");
                  return;
                }

                setBusy(true);
                setShowSnap(false);
                const elements = e.target["elements"];
                const body = elements["body"].value.toUpperCase();

                if (isNotAscii(body)) {
                  alert("Only ASCII characters are allowed.");
                  setBusy(false);
                  return;
                }
                const template = state.template.key;
                client
                  .renderStill(template, {
                    data: {
                      text: {
                        data: {
                          body,
                        },
                      },
                    },
                  })
                  .then(({ still, still_2x }) => {
                    setSrc(still_2x ?? still);
                  })
                  .finally(() => {
                    setBusy(false);
                    // mock credit use
                    setCredit((credit) => credit - 1);
                    setText(body);
                  });
              }}
            />
          </div>
        </div>
        <p className="message">{message}</p>
      </Main>
      <footer>
        {/* <details>
            <summary>
              <b>Help & Feedback</b>
            </summary>
            <br />
            <a href="mailto:han@grida.co">han@grida.co</a>
            <br />
            <a href="mailto:universe@grida.co">universe@grida.co</a>
          </details> */}
        {/* <span
            style={{
              position: "fixed",
              textAlign: "center",
              bottom: 24,
              left: 0,
              right: 0,
            }}
          >
            <code>
              C<sub>20</sub>H<sub>25</sub>N<sub>3O</sub>
            </code>
          </span> */}
      </footer>
    </StateProvider>
  );
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;

  .editor {
    max-width: 800px;
    max-height: 800px;
    aspect-ratio: 1 / 1;

    width: 640px;
    height: 640px;

    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
    border-radius: 42px;

    .frame {
      border-radius: 42px;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
    }

    ::after {
      z-index: -1;
      pointer-events: none;
      content: "";
      display: block;
      top: -10px;
      left: -10px;
      right: -10px;
      bottom: -10px;
      position: absolute;
      border-radius: 52px;
      border: 1px solid white;
    }
  }

  .controller-position {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    gap: 12px;
    padding: 32px;
  }

  .message {
    margin-top: 44px;
    font-size: 14px;
    opacity: 0.5;
    font-family: "Inter", sans-serif;
  }
`;

/**
 * Modal that shows when with a successful pro activation with stripe checkout callback.
 * To mock this view, add `?return-reason=pro-activated` to the url.
 */
function ProActivatedPortal() {
  const [activated, setActivated] = React.useState(false);
  const [open, setOpen] = React.useState<boolean | null>(null);
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

  useEffect(() => {
    if (open === false) {
      // clrear the query
      router.push("/", undefined, { shallow: true });
    }
  }, [open, router]);

  return (
    <Dialog open={open ?? false}>
      <h1>Pro activated</h1>
      <button
        onClick={() => {
          setOpen(false);
        }}
      >
        Continue
      </button>
    </Dialog>
  );
}

function UpgradeToProDialog() {
  const router = useRouter();
  const [view, setView] = React.useState<"splash" | "plans">("splash");

  return (
    <Dialog trigger={<UpgradeToProBadge />}>
      {view === "plans" ? (
        <div
          style={{
            padding: 40,
          }}
        >
          <UpgradeToProPlansView
            onUpgradeClick={(price) => {
              // POST
              router.push(`/api/checkout/sessions?price=${price}`);
            }}
          />
        </div>
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
            <Button
              onClick={() => {
                setView("plans");
              }}
            >
              View Plans
            </Button>
          </>
        </UpgradeToProSplashView>
      )}
    </Dialog>
  );
}

const Button = styled.button`
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  padding: 1rem 2rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;

  &:hover {
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  transition: all 0.1s ease-in-out;
`;
