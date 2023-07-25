import React, { useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import { unified } from "unified";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkParse from "remark-parse";
import styles from "styles/github-markdown-dark.module.css";
import { Client } from "api";

export default function StartFromReadme() {
  const client = useMemo(() => new Client(), []);
  const [readmeContent, setReadmeContent] = React.useState<string>("");
  const [logo, setLogo] = React.useState<string>("");

  const onSubmit = async () => {
    const content = await getReadmeContent("gridaco", "lsd");

    setReadmeContent(content);

    const brand = analyzeBrandName({
      repo: "gridaco/lsd",
      readme: content,
    });

    client
      .renderStill("004.1-bg-black", {
        data: {
          text: {
            data: {
              body: brand,
            },
          },
        },
      })
      .then((res) => {
        setLogo(res.still_2x || res.still);
      });
  };

  return (
    <Main>
      <input placeholder="Enter your public Github Repo URL" />
      <button onClick={onSubmit}>Submit</button>
      <div></div>
      <img src="logo" />
      <ReactMarkdown
        className={styles["markdown-body"]}
        rehypePlugins={[rehypeRaw]}
      >
        {readmeContent}
      </ReactMarkdown>
    </Main>
  );
}

const Main = styled.main`
  margin: auto;
  display: flex;
  flex-direction: column;
  max-width: 800px;
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
