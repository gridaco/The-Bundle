import Head from "next/head";
import React from "react";
import styled from "@emotion/styled";
import Image from "next/image";
import Axios from "axios";

export default function T1({ id }: { id: string }) {
  const [preview, setPreview] = React.useState<string>(
    "/preview/baked-001/TEXT-b.gif"
  );

  const renderStill = async (text: string) => {
    const { data } = await Axios.post(
      "http://localhost:3001/dev/render/sample",
      {
        data: {
          text: {
            data: {
              body: text,
            },
          },
        },
      }
    );
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
              const text = e.target["elements"]["text"];
              console.log(text.value);
              renderStill(text.value).then((data) => {
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

            <select name="align_x" id="align_x" defaultValue="CENTER">
              <option value="LEFT">Left</option>
              <option value="CENTER">Center</option>
              <option value="RIGHT">Right</option>
            </select>
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

export async function getStaticProps(context) {
  return {
    props: {
      id: context.params.id,
    },
  };
}
