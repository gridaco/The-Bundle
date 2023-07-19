import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import styled from "@emotion/styled";
import { Client } from "api";
import { useRouter } from "next/router";
import { HomeHeader } from "components/header-home";
import { Canvas, Controller, Snap } from "scaffold/home";

const DEFAULT_CREDIT_COUNT = 10;
const DEFAULT_SRC = "/lsd/preview/baked-001/TEXT-b.gif";

export default function Home() {
  const router = useRouter();
  const [message, setMessage] = useState<string>("");
  const [credit, setCredit] = useState<number>(DEFAULT_CREDIT_COUNT);
  const [pro, setPro] = useState<boolean>(false);
  const [busy, setBusy] = useState<boolean>(false);
  const [src, setSrc] = useState<string>(DEFAULT_SRC);
  const [showSnap, setShowSnap] = useState<boolean>(false);
  const client = useMemo(() => new Client(), []);

  useEffect(() => {
    const tmp_pro = router.query.pro;
    if (tmp_pro) {
      setPro(true);
    }
  }, [router.query]);

  // mock credit message
  useEffect(() => {
    // e.g.  9 of 10 credits remaining
    if (credit < DEFAULT_CREDIT_COUNT) {
      setMessage(`${credit} of 10 credits remaining`);
    }
  }, [credit]);

  // enable snap function if src is ready
  useEffect(() => {
    if (src === DEFAULT_SRC) {
      return;
    }
    setShowSnap(true);
  }, [src]);

  return (
    <>
      <Head>
        <title>LSD</title>
        <meta name="description" content="3D Text Generator" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HomeHeader />
      <Main>
        {pro && <span>PRO</span>}
        <div className="editor">
          <div className="frame">
            <Canvas busy={busy} src={src} />
          </div>
          <div className="controller-position">
            <Controller
              onSubmit={(e) => {
                e.preventDefault();
                setBusy(true);
                setShowSnap(false);
                const elements = e.target["elements"];
                const body = elements["body"].value;
                client
                  .renderStill("003-3d-glass-dispersion-text", {
                    data: {
                      text: {
                        data: {
                          body,
                        },
                      },
                    },
                  })
                  .then(({ still }) => {
                    setSrc(still);
                  })
                  .finally(() => {
                    setBusy(false);
                    // mock credit use
                    setCredit((credit) => credit - 1);
                  });
              }}
            />
            {showSnap && <Snap />}
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
    </>
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
