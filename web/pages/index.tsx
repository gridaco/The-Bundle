import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import styled from "@emotion/styled";
import { Client } from "api";
import { LinearProgress } from "@mui/material";
import { LightningBoltIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
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
      <main className={styles.main}>
        {pro && <span>PRO</span>}
        <Canvas busy={busy} src={src} />
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
        <details>
          <summary>
            <b>Help & Feedback</b>
          </summary>
          <br />
          <a href="mailto:han@grida.co">han@grida.co</a>
          <br />
          <a href="mailto:universe@grida.co">universe@grida.co</a>
        </details>
      </main>
    </>
  );
}

function Canvas({ src, busy }: { src?: string; busy?: boolean }) {
  return (
    <div className="canvas">
      <CanvasWrapper>
        {busy && (
          <div className="loading">
            <LinearProgress
              style={{
                width: "50%",
              }}
            />
          </div>
        )}
        <img className="main" src={src} />
      </CanvasWrapper>
    </div>
  );
}

const CanvasWrapper = styled.div`
  position: relative;
  min-width: 500px;
  min-height: 500px;
  aspect-ratio: 1 / 1;
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);

  .loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    backdrop-filter: blur(8px);
  }

  img.main {
    width: 100%;
    height: 100%;
  }
`;

function Controller({
  onSubmit,
}: {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <ControllerWrapper>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.(e);
        }}
      >
        <input
          id="body"
          type="text"
          placeholder="TEXT"
          autoFocus
          autoComplete="off"
        />
        <button type="submit">
          <LightningBoltIcon />
        </button>
      </form>
    </ControllerWrapper>
  );
}

const ControllerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);

  form {
    display: flex;
    flex-direction: row;
    gap: 16px;
  }

  input {
    padding: 8px;
    background: none;
    border: none;
    color: white;
    outline: none;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    background: none;
    border: none;
    color: white;
  }
`;
