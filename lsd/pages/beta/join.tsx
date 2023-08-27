import React from "react";
import { UpgradeToProPlansView } from "@/scaffolds/upgrade";
import styled from "@emotion/styled";

export default function CBTCheckoutPage() {
  return (
    <Main>
      <Layout>
        <UpgradeToProPlansView heading={"Select a Plan to get started"} />
      </Layout>
    </Main>
  );
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100vw;
  height: 100vh;
`;

const Layout = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  border: solid 2px rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  box-shadow: 0px 4px 16px 4px rgba(255, 255, 255, 0.04);
  max-width: 860px;

  overflow: hidden;
`;
