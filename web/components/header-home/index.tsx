import React from "react";
import Image from "next/image";
import styled from "@emotion/styled";
import Link from "next/link";

export function HomeHeader() {
  return (
    <HeaderWrapper>
      <Link href="/">
        <Image
          src="/lsd/lsd.png"
          alt="Logo"
          className="logo home"
          width={52}
          height={32}
          priority
        />
      </Link>
      {/* <div className="menu">
        <Link href="/crystal">
          <span className="item">CRYSTAL</span>
        </Link>
        <Link href="/acid">
          <span className="item">ACID</span>
        </Link>
        <Link href="/grass">
          <span className="item">GRASS</span>
        </Link>
      </div>
      <Link href="/rehab">
        <span>REHAB</span>
      </Link> */}
    </HeaderWrapper>
  );
}

export function HeaderSpace({ extra = 0 }: { extra?: number }) {
  return <div style={{ height: 68 + extra }} />;
}

const HeaderWrapper = styled.header`
  z-index: 10;
  width: 100%;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  padding-top: 24px;
  background: rgba(0, 0, 0, 0.01);
  backdrop-filter: blur(24px);

  .home {
    cursor: pointer;
  }

  .menu {
    margin-left: 80px;
    display: flex;
    flex-direction: row;
    gap: 16px;
    font-size: 16px;
  }

  .menu .item {
    opacity: 0.8;
    font-family: "Inter", sans-serif;
  }
`;
