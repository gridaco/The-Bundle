import React, { useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import { unified } from "unified";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkParse from "remark-parse";
import readmeContentStyles from "styles/github-markdown-dark.module.css";
import { LinearProgress } from "@mui/material";
import { Client } from "api";

export default function StartFromReadme() {
  const [url, setUrl] = React.useState<string>("");
  const client = useMemo(() => new Client(), []);
  const [readmeContent, setReadmeContent] = React.useState<string>("");
  const [logo, setLogo] = React.useState<string>("");
  const [busy, setBusy] = React.useState<boolean>(false);

  const onSubmit = async () => {
    const { owner, repo } = parseRepo(url);

    setBusy(true);

    const content = await getReadmeContent(owner, repo);

    const brand = analyzeBrandName({
      repo: `${owner}/${repo}`,
      readme: content,
    });

    const imgres = await client.renderStill("004", {
      data: {
        text: {
          data: {
            body: brand,
          },
        },
      },
    });

    setReadmeContent(content);
    setLogo(imgres.still_2x || imgres.still);

    setBusy(false);
  };

  return (
    <Main>
      <style jsx global>{`
        body {
          background: #0d1117;
        }
      `}</style>
      <div className="content">
        <Input url={url} onChange={setUrl} onSubmit={onSubmit} />

        {busy && <LinearProgress />}
        <div className="readme">
          <img className="logo" src={logo} />
          <ReactMarkdown
            className={readmeContentStyles["markdown-body"]}
            rehypePlugins={[rehypeRaw]}
          >
            {readmeContent}
          </ReactMarkdown>
        </div>
      </div>
    </Main>
  );
}

function Input({
  url,
  onChange,
  onSubmit,
}: {
  url: string;
  onChange: (url: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div>
      <input
        placeholder="Enter your public Github Repo URL"
        value={url}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSubmit();
          }
        }}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
      <button onClick={onSubmit}>Submit</button>
    </div>
  );
}

const Main = styled.main`
  width: 100vw;
  height: 100vh;

  .content {
    margin: auto;
    display: flex;
    flex-direction: column;
    max-width: 800px;
  }

  .logo {
    width: 100%;
    height: 100%;
  }

  .readme {
    padding: 24px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
`;

async function getReadmeContent(owner: string, repo: string): Promise<string> {
  const url = `https://api.github.com/repos/${owner}/${repo}/readme`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const jsonData = await response.json();
  const readmeContent = atob(jsonData.content);

  return readmeContent;
}

function parseRepo(url: string) {
  const u = new URL(url);
  const path = u.pathname;
  const parts = path.split("/");
  const owner = parts[1];
  const repo = parts[2];

  return { owner, repo };
}

/**
 * infers brand name from...
 * - repository name
 * - readme content
 */
function analyzeBrandName({ repo, readme }: { repo: string; readme: string }) {
  const repoName = repo.split("/")[1];

  // use remark to parse markdown (support for html as well)
  // get the first h1, h2, h3, ...
  const tree = unified().use(remarkParse).parse(readme);
  const firstHeading = tree.children.find(
    (node) => node.type === "heading"
  ) as any;
  const firstHeadingText = firstHeading?.children?.[0]?.value;

  // if first heading is not found, use repo name
  const brandName = firstHeadingText || repoName;

  return brandName;
}
