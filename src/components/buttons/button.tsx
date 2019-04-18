import React from "react";

interface IProps {
  color: string;
}

const Button: React.FunctionComponent<IProps> = ({ color }) => {
  return <button style={{ color }}>Click Me</button>;
};

export default Button;
