import React, { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import { LightningBoltIcon, DownloadIcon } from "@radix-ui/react-icons";

export function Snap() {
  return (
    <SnapWrapper>
      <DownloadIcon />
    </SnapWrapper>
  );
}

const SnapWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  aspect-ratio: 1 / 1;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export function Controller({
  onSubmit,
}: {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <ControllerWrapper>
      <div className="slot scene">
        {/* 
        .
         */}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.(e);
        }}
      >
        <input
          id="body"
          type="text"
          placeholder="Type text to render"
          autoFocus
          autoComplete="off"
        />
        <button type="submit">
          <LightningBoltIcon />
        </button>
      </form>
    </ControllerWrapper>
  );
}

const ControllerWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 60px;
  flex-direction: row;
  border-radius: 12px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  gap: 16px;

  .slot {
    display: flex;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    overflow: hidden;
  }

  .slot.scene {
    height: 100%;
    aspect-ratio: 1 /1;
    background-color: white;
  }

  form {
    display: flex;
    width: 100%;
    flex-direction: row;
    gap: 16px;
  }

  input {
    flex: 1;
    width: 100%;
    padding: 8px;
    background: none;
    border: none;
    color: white;
    outline: none;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    background: none;
    border: none;
    color: white;
  }
`;
