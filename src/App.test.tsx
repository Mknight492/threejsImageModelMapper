import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { mount, ReactWrapper } from "enzyme";

import CustomProvider from "./graphql/configureAWSProvider";

let wrapper: ReactWrapper;

beforeEach(() => {
  wrapper = mount(
    <CustomProvider>
      <App />
    </CustomProvider>
  );
});

afterEach(() => {
  wrapper.unmount();
});

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <CustomProvider>
      <App />
    </CustomProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
