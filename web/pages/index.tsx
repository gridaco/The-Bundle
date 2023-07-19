import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import styled from "@emotion/styled";
import { Client } from "api";
import { useRouter } from "next/router";
import { HomeHeader } from "components/header-home";
import { Canvas, Controller } from "scaffold/home";

export default function Home() {
  const router = useRouter();
  const [message, setMessage] = useState<string>("");
  const [pro, setPro] = useState<boolean>(false);
  const [busy, setBusy] = useState<boolean>(false);
  const [src, setSrc] = useState<string>("/lsd/preview/baked-001/TEXT-b.gif");
  const client = useMemo(() => new Client(), []);

  useEffect(() => {
    const tmp_pro = router.query.pro;
    if (tmp_pro) {
      setPro(true);
    }
  }, [router.query]);

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
          <Canvas busy={busy} src={src} />
          <div className="controller-position">
            <Controller
              onSubmit={(e) => {
                e.preventDefault();
                setBusy(true);
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
    padding: 32px;
  }
`;
