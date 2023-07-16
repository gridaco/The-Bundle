import Head from "next/head";
import React from "react";
import styled from "@emotion/styled";
import Image from "next/image";
import Axios from "axios";

export default function T1() {
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
            <input id="text" type="text" placeholder="Enter your text" />
            <select name="font" id="font">
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
            </select>
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
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
`;
