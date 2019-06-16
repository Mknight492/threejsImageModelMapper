import React, { useLayoutEffect, useRef } from "react";

const Test = () => {
  const mount = useRef<any>(null);

  useLayoutEffect(() => {}, []);

  return <div ref={mount} />;
};
export default Test;
