import React from "react";

import Countries from "../countries";

import { mount, ReactWrapper } from "enzyme";

import CustomProvider from "../../../apollo/configureProvider";

let wrapper: ReactWrapper;

beforeEach(() => {
  wrapper = mount(
    <CustomProvider>
      <Countries />
    </CustomProvider>
  );
});

afterEach(() => {
  wrapper.unmount();
});

it("has the US as the default country", () => {
  //need to have Apollo Client Mocked and to wait for it to be rendered
  //expect(wrapper.find('United States').length).toBe(1);
});
