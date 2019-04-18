import React from "react";

import styled from "styled-components";

const Wrapper = styled.div`
  padding-left: 18px;
  padding-right: 18px;
  max-width: 1236px;
  margin-left: auto;
  margin-right: auto;
`;

const WrapperComponent: React.FunctionComponent = () => <Wrapper />;

export default WrapperComponent;
