import React from "react";

import styled from "styled-components";

interface IProps {
  error: {
    message: string;
  };
}

const Error: React.FunctionComponent<IProps> = ({ error }) => (
  <Background>
    <ErrorBox>
      <h2> something has gone wrong...</h2>
      <h3> sorry for the inconvinience </h3>
      <LightButton>
        <a href="/"> return to sign in</a>
      </LightButton>
    </ErrorBox>
  </Background>
);

export const LightButton = styled.button`
  background-color: #6d9cf9;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size: 12px;
  padding: 8px;
  height: 32px;
  line-height: 1;
  transition: all 0.3s ease-in-out;
  :hover {
    background-color: #3a76eb;
  }
`;

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ErrorBox = styled.div`
  width: 90vw;
  max-width: 600px;
  max-height: 300px;
  border: 2px solid #cedfff;
  border-radius: 2px;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  * {
    padding-bottom: 20px;
    line-height: 1;
  }
  a {
    color: white;
    font-size: 15px;
    padding: 10px 5px;
  }
`;

export default Error;
