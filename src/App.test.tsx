import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { isSymbol } from "util";

import { mount, shallow, ReactWrapper } from "enzyme";

import Countries from "./components/countries/countries";
import CustomProvider from "./apollo/configureProvider";
import Button from "./components/buttons/button";

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

it("contains an instance of the countries Page", () => {
  expect(wrapper.find(Countries).length).toEqual(1);
});
