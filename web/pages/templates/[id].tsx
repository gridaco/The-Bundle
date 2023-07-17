import Head from "next/head";
import React from "react";
import styled from "@emotion/styled";
import Image from "next/image";
import Axios from "axios";

interface DMTRequest<T = any> {
  data: T;
  config?: DMTConfig;
}

interface DMTConfig {
  resolution_x: number;
  resolution_y: number;
  samples: number;
  engine: "CYCLES" | "BLENDER_EEVEE";
}

export default function T1({ id }: { id: string }) {
  const [busy, setBusy] = React.useState<boolean>(false);
  const [preview, setPreview] = React.useState<string>(
    "/preview/baked-001/TEXT-b.gif"
  );

  const renderStill = async (request: DMTRequest) => {
    setBusy(true);
    const { data } = await Axios.post(
      `http://localhost:3001/templates/${id}/render-still`,
      request
    );

    setBusy(false);
    return data;
  };

  return (
    <>
      <Head>
        <title>3D Glass Dispersion Text</title>
      </Head>
      <Main>
        <div className="side left">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const elements = e.target["elements"];
              const text = elements["text"].value;
              const resolution = parseInt(elements["resolution"].value);
              const engine = elements["engine"].value;
              const samples = parseInt(elements["samples"].value);

              renderStill({
                data: {
                  text: {
                    data: {
                      body: text,
                    },
                  },
                },
                config: {
                  engine,
                  resolution_x: resolution,
                  resolution_y: resolution,
                  samples,
                },
              }).then((data) => {
                setPreview(data.still);
              });
            }}
          >
            <section>
              <label htmlFor="font">Font</label>
              <select name="font" id="font">
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
              </select>
            </section>
            {/* Paragraph */}
            <section>
              <label htmlFor="character_spacing">Character Spacing</label>
              <input
                id="character_spacing"
                name="character_spacing"
                type="number"
                placeholder="Character Spacing"
              />
            </section>

            <section>
              <label htmlFor="word_spacing">Word Spacing</label>
              <input
                id="word_spacing"
                name="word_spacing"
                type="number"
                placeholder="Word Spacing"
              />
            </section>

            <section>
              <label htmlFor="line_spacing">Line Spacing</label>
              <input
                id="line_spacing"
                name="line_spacing"
                type="number"
                placeholder="Line Spacing"
              />
            </section>

            <section>
              <label htmlFor="align_x">Text Align</label>
              <select name="align_x" id="align_x" defaultValue="CENTER">
                <option value="LEFT">Left</option>
                <option value="CENTER">Center</option>
                <option value="RIGHT">Right</option>
              </select>
            </section>

            {/* Quality */}

            <section>
              <label htmlFor="resolution">Resolution</label>
              <select name="resolution" id="resolution" defaultValue="500">
                <option value="500">500 x 500</option>
                <option value="1000">1000 x 1000</option>
                <option value="4000">4K</option>
              </select>
            </section>

            <section>
              <label htmlFor="samples">Samples</label>
              <select name="samples" id="samples" defaultValue="64">
                <option value="64">64</option>
                <option value="128">128</option>
                <option value="256">256</option>
                <option value="512">512</option>
                <option value="1024">1024</option>
              </select>
            </section>

            <section>
              <label htmlFor="engine">Engine</label>
              <select name="engine" id="engine" defaultValue="CYCLES">
                <option value="CYCLES">Cycles</option>
                <option value="BLENDER_EEVEE">Eevee</option>
              </select>
            </section>

            <textarea
              id="text"
              placeholder="Enter your text"
              onKeyDown={(e) => {
                // keyCode 13 is Enter
                if (e.keyCode === 13 && !e.shiftKey) {
                  e.preventDefault();
                }
              }}
            />
            <button type="submit">Submit</button>
          </form>
        </div>
        <div className="side">
          {busy && <span>IDLE...</span>}

          <Image
            width={500}
            height={500}
            className="preview"
            src={preview}
            alt="preview"
          />
        </div>
      </Main>
    </>
  );
}

const Main = styled.main`
  display: flex;
  flex-direction: row;

  .side {
    width: 50%;
    height: 100vh;
  }

  .side.left {
    padding: 16px;
  }

  img.preview {
    width: 100%;
    height: 100%;
  }

  form {
    font-family: monospace;
    max-width: 240px;
    display: flex;
    flex-direction: column;
    gap: 21px;

    section {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
  }
`;

export async function getServerSideProps(context) {
  return {
    props: {
      id: context.params.id,
    },
  };
}
