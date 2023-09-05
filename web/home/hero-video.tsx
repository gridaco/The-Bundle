"use client";
import React from "react";
import styled from "@emotion/styled";

export function HeroVideo() {
  return (
    <VideoContainer
      style={{
        position: "relative",
        top: 80,
        width: 860,
        height: 860,
      }}
    >
      <video
        muted
        autoPlay
        loop
        // src="/bundle/tmp/seqs.mp4"
        src="https://player.vimeo.com/progressive_redirect/playback/860123788/rendition/1080p/file.mp4?loc=external&log_user=0&signature=ac9c2e0d2e367d8a31af6490edad8c1f7bae87d085c4f3909773a7ca5a129cb6"
      />
    </VideoContainer>
  );
}

const VideoContainer = styled.div`
  user-select: none;
  pointer-events: none;
  /* add gradient on the bottom */
  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 120px;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 1) 100%
    );
  }
`;
