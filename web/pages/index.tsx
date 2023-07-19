import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
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
        <p className="message">{message}</p>
      </main>
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
