"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import bundle from "@/k/bundle.json";
import styled from "@emotion/styled";

const material_keys = Object.keys(bundle.materials);

export function MaterialsNav() {
  return (
    <GradientWrapper>
      <div className="overflow-x-scroll overflow-y-hidden no-scrollbar w-auto">
        <div className="flex flex-row gap-8 w-fit">
          {material_keys.map((m, i) => (
            <Link href={`#${m}`} key={i}>
              <motion.div
                className="select-none w-24 h-24"
                whileHover={{
                  scale: 1.1,
                }}
              >
                <Image
                  src={`/bundle/icons/${m}.png`}
                  width={100}
                  height={100}
                  alt={m}
                />
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </GradientWrapper>
  );
}

const GradientWrapper = styled.div`
  position: relative;

  ::before,
  ::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    width: 40px;
    pointer-events: none; /* So it doesn't interfere with scrolling */
    z-index: 2;
  }

  ::before {
    left: 0;
    background-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 1),
      rgba(0, 0, 0, 0)
    );
  }

  ::after {
    right: 0;
    background-image: linear-gradient(
      to left,
      rgba(0, 0, 0, 1),
      rgba(0, 0, 0, 0)
    );
  }
`;
