import React from "react";
import { storiesOf } from "@storybook/react";

import Button from "../../components/buttons/button";

storiesOf("Button", module)
  .add("red", () => <Button color="red" />)
  .add("blue", () => <Button color="blue" />)
  .add("green", () => <Button color="green" />);
