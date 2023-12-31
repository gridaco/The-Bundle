import { DiamondIcon } from "@/icons/diamond";
import styled from "@emotion/styled";
import React from "react";

export const UpgradeToProBadge = React.forwardRef(function UpgradeToProBadge(
  props: React.ComponentProps<"button">,
  ref: React.Ref<HTMLButtonElement>
) {
  return (
    <Badge ref={ref} {...props}>
      <DiamondIcon color="white" width={24} height={24} />
      Upgrade
    </Badge>
  );
});

export const ProBadge = React.forwardRef(function ProBadge(
  props: React.ComponentProps<"button">,
  ref: React.Ref<HTMLButtonElement>
) {
  return (
    <Badge ref={ref} {...props}>
      <DiamondIcon color="white" width={24} height={24} />
      Pro
    </Badge>
  );
});

const Badge = styled.button`
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 20px;

  background: rgba(255, 255, 255, 0);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 8px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;
