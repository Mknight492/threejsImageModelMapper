import React from "react";

interface IProps {
  error: {
    message: string;
  };
}

const Error: React.FunctionComponent<IProps> = ({ error }) => (
  <h1> Error: {error.message} </h1>
);

export default Error;
