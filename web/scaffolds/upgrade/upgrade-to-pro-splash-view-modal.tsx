import styled from "@emotion/styled";
import React from "react";

export function UpgradeToProSplashView({
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
    <ColumnImagesContainer>
      {src && typeof src === "string" && <img src={src} />}
      {src && Array.isArray(src) && src.map((s, i) => <img key={i} src={s} />)}
    </ColumnImagesContainer>
  );
}

const ColumnImagesContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  user-select: none;
  pointer-events: none;
  width: 100%;

  /* gradient overlay */
  &::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.75) 0%,
      rgba(0, 0, 0, 0.2) 10%,
      rgba(0, 0, 0, 0) 50%,
      rgba(0, 0, 0, 0.2) 75%,
      rgba(0, 0, 0, 0.9) 100%
    );
  }
`;

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
    width: 100%;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 36px;
    padding: 40px;
    max-width: 480px;
    text-align: center;

    h1 {
      font-size: 48px;
      font-weight: 700;
    }

    p {
      font-size: 21px;
      font-weight: 400;
      opacity: 0.8;
    }
  }
`;
