import React, { useState } from "react";

//styles
import styled from "styled-components";

//components
import Test from "./vis";

const initialState: IThreeDPosition = {
  position: {
    x: 0,
    y: 0,
    z: 10
  },
  rotation: {
    x: 0,
    y: 0,
    z: 0
  },
  scale: {
    x: 40,
    y: 40,
    z: 40
  }
};

const ImageToModalMapper = () => {
  const [state, setState] = useState(initialState);
  const [gizmoState, setStateGizmoState] = useState<ITransformControlsType>(
    "translate"
  );

  const handleChange = (
    field: keyof IThreeDPosition,
    position: keyof ICoordinates
  ) => (event: React.ChangeEvent<HTMLInputElement>) => {
    // state[field][position] = parseFloat(event.target.value)
    event.persist();
    setState(state => {
      //   debugger;
      const newState = { ...state };
      const { value } = event.target;
      if (value === "-") newState[field][position] = "-";
      else {
        let finalValue = isNaN((value as unknown) as number)
          ? 0
          : parseFloat(event.target.value);

        newState[field][position] = finalValue;
      }

      return newState;
    });
  };

  return (
    <Wrapper>
      <Box>
        <Title>Image 1</Title>
        <Row>
          <Test
            ThreeDPosition={{ ...state }}
            setState={setState}
            gizmoState={gizmoState}
          />
          <Positions>
            <h3> Position</h3>
            <label htmlFor="positionx">x</label>
            <input
              id="positionx"
              onChange={handleChange("position", "x")}
              value={state.position.x}
              type="number"
            />
            <label htmlFor="positiony">y</label>
            <input
              id="positiony"
              onChange={handleChange("position", "y")}
              value={state.position.y}
              type="number"
            />
            <label htmlFor="positionz">z</label>
            <input
              id="positionz"
              onChange={handleChange("position", "z")}
              value={state.position.z}
              type="number"
            />
            <h3> Rotation</h3>
            <label htmlFor="rotationx">x</label>
            <input
              id="rotationx"
              onChange={handleChange("rotation", "x")}
              value={state.rotation.x}
              type="number"
            />
            <label htmlFor="rotationy">y</label>
            <input
              id="rotationy"
              onChange={handleChange("rotation", "y")}
              value={state.rotation.y}
              type="number"
            />
            <label htmlFor="rotationz">z</label>
            <input
              id="rotationz"
              onChange={handleChange("rotation", "z")}
              value={state.rotation.z}
              type="number"
            />
            <h3> Scale</h3>
            <label htmlFor="scalex">x</label>
            <input
              id="scalex"
              onChange={handleChange("scale", "x")}
              value={state.scale.x}
              type="number"
            />
            <label htmlFor="scaley">y</label>
            <input
              id="scaley"
              onChange={handleChange("scale", "y")}
              value={state.scale.y}
              type="number"
            />
            <label htmlFor="scalez">z</label>
            <input
              id="scalez"
              onChange={handleChange("scale", "z")}
              value={state.scale.z}
              type="number"
            />
            <button
              onClick={() => {
                setStateGizmoState("translate");
              }}
            >
              translate
            </button>
            <button
              onClick={() => {
                setStateGizmoState("rotate");
              }}
            >
              rotate
            </button>
            <button
              onClick={() => {
                setStateGizmoState("scale");
              }}
            >
              scale
            </button>
            <button
              onClick={() => {
                setState(initialState);
              }}
            >
              {" "}
              reset{" "}
            </button>
          </Positions>
        </Row>
      </Box>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  max-width: 1240px;
  margin: 0 auto;
`;

const Box = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 18px;
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex: 0.7 0.3;
`;

const Positions = styled.div`
  display: flex;
  flex-direction: column;
`;

export interface IThreeDPosition {
  position: ICoordinates;
  rotation: ICoordinates;
  scale: ICoordinates;
}

export interface ICoordinates {
  x: number | "" | "-";
  y: number | "" | "-";
  z: number | "" | "-";
}

export type ITransformControlsType = "translate" | "rotate" | "scale";

export default ImageToModalMapper;
