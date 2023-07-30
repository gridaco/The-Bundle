import React from "react";
import { GoogleLogoIcon } from "@/icons/google-logo";
import styled from "@emotion/styled";

export const ContinueWithGoogleButton = React.forwardRef(
  function ContinueWithGoogleButton(props, ref?: React.Ref<HTMLButtonElement>) {
    return (
      <ButtonContainer ref={ref}>
        <GoogleLogoIcon color="white" />
        Continue with Google
      </ButtonContainer>
    );
  }
);

const ButtonContainer = styled.button`
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  padding: 1rem 2rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  transition: all 0.1s ease-in-out;
`;
