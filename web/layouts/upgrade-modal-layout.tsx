import styled from "@emotion/styled";
import React from "react";

export function UpgradeModalLayout({
  hero,
  children,
}: {
  hero?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <UpgradeModalLayoutWrapper>
      {hero && <div className="hero">{hero}</div>}
      <div className="content">{children}</div>
    </UpgradeModalLayoutWrapper>
  );
}

export function ColumnImages({ src }: { src?: string | string[] }) {
  return (
    <div
      style={{
        display: "flex",
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      {src && typeof src === "string" && <img src={src} />}
      {src && Array.isArray(src) && src.map((s, i) => <img key={i} src={s} />)}
    </div>
  );
}

const UpgradeModalLayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  font-family: "Inter", sans-serif;

  color: white;

  .hero {
    display: flex;
    flex-direction: column;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;

    h1 {
      font-size: 1.5rem;
    }

    p {
      font-size: 1rem;
    }
  }
`;
