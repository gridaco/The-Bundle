"use client";
import React from "react";
import styled from "@emotion/styled";

export function HeroVideo() {
  return (
    <VideoContainer>
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
  width: 100%;
  height: 100%;
  /* add gradient on the bottom */
  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40vh;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 1) 100%
    );
  }

  video {
    height: fit-content;
    width: 100%;
    max-width: 800px;
    max-height: 800px;
  }
`;
