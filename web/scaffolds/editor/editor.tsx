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
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import {
  UpgradeToProSplashView,
  ColumnImages,
  UpgradeToProPlansView,
  UpgradeToProBadge,
  ProBadge,
} from "@/scaffolds/upgrade";
import * as Popover from "@radix-ui/react-popover";
import Link from "next/link";
import { default_data_transformer } from "./template-data";

const DEFAULT_CREDIT_COUNT = 10;

const motion_editor = {
  initial: {
    opacity: 0.0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  transition: {
    delay: 0.2,
    duration: 0.2,
  },
} as const;

const motion_canvas = {
  initial: {
    filter: "blur(32px)",
    opacity: 0.8,
    scale: 0.9,
  },
  animate: {
    filter: "blur(0px)",
    scale: 1,
    opacity: 1,
  },
  transition: {
    delay: 0.4,
    duration: 0.2,
  },
} as const;

export function Editor() {
  const [message, setMessage] = useState<string>("");
  const [credit, setCredit] = useState<number>(DEFAULT_CREDIT_COUNT);
  const [busy, setBusy] = useState<boolean>(false);
  const [showDownload, setShowDownload] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const client = useMemo(() => new Client(), []);

  // mock credit message
  useEffect(() => {
    // e.g.  9 of 10 credits remaining
    if (credit < DEFAULT_CREDIT_COUNT) {
      setMessage(`${credit} of 10 credits remaining`);
    }
  }, [credit]);

  const [state, dispatch] = useReducer(editorReducer, initstate());

  // enable snap function if src is ready
  useEffect(() => {
    const src = state.result?.src;
    setShowDownload(!(src === "" || src === undefined || src === null));
  }, [state.result?.src]);

  const handleDispatch = useCallback((action: EditorAction) => {
    dispatch(action);
  }, []);

  return (
    <StateProvider state={state} dispatch={handleDispatch}>
      <HomeHeader left={<TemplateDropdown />} right={<ProPopover />} />
      <Providers>
        <Main>
          <ProActivatedPortal />

          <motion.div className="editor" {...motion_editor}>
            <motion.div className="frame" {...motion_canvas}>
              <Canvas busy={busy} />
            </motion.div>
            <div className="controller-position">
              <Controller
                showDownload={showDownload}
                onDownload={() => {
                  if (state.result?.src) {
                    downloadImage(state.result?.src, `${text}.png`);
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
                  setShowDownload(false);
                  const elements = e.target["elements"];
                  const text: string = elements["body"].value;
                  // .toUpperCase();

                  // if (isNotAscii(body)) {
                  //   alert("Only ASCII characters are allowed.");
                  //   setBusy(false);
                  //   return;
                  // }

                  const template = state.template.key;
                  const data = {
                    ...state.data,
                    ["text"]: text,
                  };
                  const transformer =
                    state.template.custom_data_transformer ??
                    default_data_transformer;
                  client
                    .renderStill(template, {
                      data: transformer(data),
                    })
                    .then(({ still, still_2x }) => {
                      dispatch({
                        type: "set-render-result",
                        src: still_2x ?? still,
                      });
                    })
                    .finally(() => {
                      setBusy(false);
                      // mock credit use
                      // disabled for initial launch
                      // setCredit((credit) => credit - 1);
                      setText(text);
                    });
                }}
              />
            </div>
          </motion.div>
          <p className="message">{message}</p>
        </Main>
        <footer></footer>
      </Providers>
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
    margin-top: 60px;
    max-width: 800px;
    max-height: 800px;
    aspect-ratio: 1 / 1;

    /* media */
    @media (max-width: 640px), (max-height: 700px) {
      width: 400px;
      height: 400px;
    }

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

  // temporary - remove this and use below.
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        toast.success("Pro activated", {
          duration: 6000,
          position: "bottom-right",
        });
      }, 3000);
    }
  }, [open]);

  // return (
  //   <Dialog open={open ?? false}>
  //     <h1>Pro activated</h1>
  //     <button
  //       onClick={() => {
  //         setOpen(false);
  //       }}
  //     >
  //       Continue
  //     </button>
  //   </Dialog>
  // );

  return <></>;
}

function Providers({ children }: React.PropsWithChildren<{}>) {
  return (
    <>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "black",
            color: "white",
            fontSize: 12,
            fontFamily: "Inter, sans-serif",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          },
        }}
      />
      {/* <UpgradeToProToContinue> */}
      {children}
      {/* </UpgradeToProToContinue> */}
    </>
  );
}

function UpgradeToProToContinue({ children }: React.PropsWithChildren<{}>) {
  const [view, setView] = React.useState<"splash" | "plans">("splash");
  const [open, setOpen] = React.useState<boolean>(false);

  useEffect(() => {
    // check if user is pro via supabase
    // if not, open the dialog
    setTimeout(() => {
      setOpen(true);
    }, 1000);
  }, []);

  return (
    <>
      <Dialog open={open}>
        {view === "plans" ? (
          <UpgradeToProPlansView />
        ) : (
          <UpgradeToProSplash
            onNext={() => {
              setView("plans");
            }}
          />
        )}
      </Dialog>
      {children}
    </>
  );
}

const UpgradeToProSplash = ({ onNext }: { onNext: () => void }) => (
  <UpgradeToProSplashView
    hero={<ColumnImages src="/lsd/pro/pro-featured-banner.png" />}
  >
    <>
      <h1>Upgrade to Pro</h1>
      <p>Get access to all resources and full export options.</p>
      <Button onClick={onNext}>View Plans</Button>
    </>
  </UpgradeToProSplashView>
);

function UpgradeToProDialog() {
  const [view, setView] = React.useState<"splash" | "plans">("splash");

  return (
    <Dialog trigger={<UpgradeToProBadge />}>
      {view === "plans" ? (
        <UpgradeToProPlansView />
      ) : (
        <UpgradeToProSplash
          onNext={() => {
            setView("plans");
          }}
        />
      )}
    </Dialog>
  );
}

function ProPopover() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <ProBadge />
      </Popover.Trigger>
      <Popover.Content sideOffset={16} align="end">
        <div
          style={{
            padding: 16,
            minWidth: 200,
            background: "black",
            color: "white",
            borderRadius: 8,
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 12,
            }}
          >
            v0.0.1
            <br />
            <Link
              href={"mailto:han@grida.co"}
              style={{
                opacity: 0.8,
              }}
            >
              Contact Support
            </Link>
            <br />
            <Link
              href={"mailto:han@grida.co"}
              style={{
                opacity: 0.8,
              }}
            >
              Contact Sales
            </Link>
            <br />
            <br />
            <span
              style={{
                opacity: 0.5,
              }}
            >
              Made with 💉 by Team Grida
              <br />-{" "}
              <a
                href="https://www.instagram.com/zizonzzangryu/"
                target="_blank"
              >
                Ryu
              </a>
              ,{" "}
              <a
                href="https://www.instagram.com/jonghan_future/"
                target="_blank"
              >
                Han
              </a>
              ,{" "}
              <a
                href="https://www.instagram.com/helix.the.meow.pow/"
                target="_blank"
              >
                Helix
              </a>{" "}
              and{" "}
              <a href="https://www.instagram.com/univ___erse/" target="_blank">
                Universe
              </a>{" "}
              -
            </span>
            <br />
            <code>
              C<sub>20</sub>H<sub>25</sub>N<sub>3O</sub>
            </code>
          </div>
        </div>
      </Popover.Content>
    </Popover.Root>
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
