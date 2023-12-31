import React from "react";
import Image from "next/image";
import styled from "@emotion/styled";
import Link from "next/link";
import { motion } from "framer-motion";

const logo_motion = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  transition: {
    delay: 1.2,
  },
};

const side_motion = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  transition: {
    delay: 1.4,
  },
};

export function HomeHeader({
  left,
  right,
}: {
  left?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <HeaderWrapper>
      <motion.div
        style={{
          // temporal display none
          display: "none",
        }}
        {...logo_motion}
      >
        <Link href="/">
          <Image
            src="/lsd/lsd.png"
            alt="Logo"
            className="logo home"
            width={55}
            height={24}
            priority
          />
        </Link>
      </motion.div>
      <motion.div className="left" {...side_motion}>
        {left}
      </motion.div>
      <motion.div className="right" {...side_motion}>
        {right}
      </motion.div>
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
  /* background: rgba(0, 0, 0, 0.01); */
  /* backdrop-filter: blur(24px); */

  .home {
    cursor: pointer;
  }

  .left {
    position: absolute;
    top: 24px;
    left: 24px;
  }

  .right {
    position: absolute;
    top: 24px;
    right: 24px;
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
