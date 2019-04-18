import React from "react";
import ReactDOM from "react-dom";

import Countries from "../countries";
import { mount, ReactWrapper } from "enzyme";
import { MockedProvider } from "react-apollo/test-utils";
import { GET_COUNTRIES_MOCK } from "../../../../testing/mocks/countries/index";

import {
  render,
  fireEvent,
  wait,
  cleanup,
  getByText,
  RenderResult,
  waitForElement
} from "react-testing-library";

const mocks = [...GET_COUNTRIES_MOCK];

let wrapper: RenderResult;

beforeEach(() => {
  wrapper = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Countries />
    </MockedProvider>
  );
});

afterEach(() => {
  wrapper.unmount();
});

it("displays the loading component on intial render", () => {
  const LoadingLabel = wrapper.getByText(/loading/i);
  expect(LoadingLabel).toBeTruthy();
});

it("has the US as the default country", async done => {
  //need to have Apollo Client Mocked and to wait for it to be rendered
  const { container } = wrapper;

  const Selector = (await waitForElement(
    () => wrapper.getByTestId("CountriesSelector"),
    { container }
  )) as HTMLSelectElement;

  expect(Selector.value).toBe("US");
  done();
});
