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

const Badge = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 20px;

  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
`;
