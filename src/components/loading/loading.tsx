import React from "react";

import styled, { keyframes } from "styled-components";

import { SizeMe } from "react-sizeme";

export default function Loading() {
  return (
    <SizeMe monitorWidth={true} monitorHeight={true}>
      {({ size }) => {
        if (
          size &&
          size.width &&
          size.width >= 40 &&
          size.height &&
          size.height >= 40
        ) {
          const spinerSize = Math.round(Math.min(size.width, size.height) / 2);
          return (
            <Container>
              <Spinner width={spinerSize} height={spinerSize} />
            </Container>
          );
        }
        return <div />;
      }}
    </SizeMe>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface I2D {
  width: number;
  height: number;
}

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
  `;

const Spinner = styled.div<I2D>`
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #3498db; /* Blue */
  border-radius: 50%;
  width: ${p => p.width}px;
  height: ${p => p.height}px;
  position: relative;
  animation: ${spin} 2s linear infinite;
` as React.FunctionComponent<I2D>;
