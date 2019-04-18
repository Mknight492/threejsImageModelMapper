import React from "react";

import styled from "styled-components";
import device from "../../styles/mediaQueries";

const Wrapper = styled.div`
  padding-left: 18px;
  padding-right: 18px;
  max-width: 1236px;
  margin-left: auto;
  margin-right: auto;

  @media ${device.tablet} {
    padding-left: 100px;
    padding-right: 100px;
  }
`;

const WrapperComponent: React.FunctionComponent = () => <Wrapper />;

export default WrapperComponent;
