import React, { useState } from "react";

//styles
import styled from "styled-components";

//graphQL
import { Query, Mutation } from "react-apollo";
import { listUnfinishedImages } from "../../graphql/queries";
import { updateImage } from "../../graphql/mutations";
import gql from "graphql-tag";
import { UpdateImageMutation, UpdateImageMutationVariables } from "../../API";

//components
import Test from "./vis";
import Loading from "../../components/loading/loading";
import Error from "../../components/error/error";

const initialState = (
  imageToBelabelled?: IimageToBelabelled
): IimageToBelabelled => ({
  id: imageToBelabelled ? imageToBelabelled.id : "",
  imageUrl: imageToBelabelled ? imageToBelabelled.imageUrl : "",
  modelUrl: imageToBelabelled ? imageToBelabelled.modelUrl : " ",
  translateX: 0,
  translateY: 0,
  translateZ: 10,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  scaleX: 1,
  scaleY: 1,
  scaleZ: 1,
  finished: "false"
});

const ImageToModalMapper = () => {
  const [model3DpositionState, setStateModel3Dposition] = useState(
    initialState()
  );
  const [gizmoState, setStateGizmoState] = useState<ITransformControlsType>(
    "translate"
  );

  const handleChange = (field: keyof IimageToBelabelled) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.persist();
    setStateModel3Dposition(state => {
      const newState = { ...state };
      const { value } = event.target;

      if (
        field !== "id" &&
        field !== "imageUrl" &&
        field !== "modelUrl" &&
        field !== "finished"
      ) {
        if (value === "-") newState[field] = "-" as any;
        if (value === "") newState[field] = "" as any;
        else {
          let finalValue = isNaN(value as any)
            ? 0
            : parseFloat(event.target.value);

          newState[field] = finalValue;
        }
      }

      return newState;
    });
  };

  return (
    <Query<listUnfinishedImagesQuery>
      query={gql(listUnfinishedImages)}
      fetchPolicy="network-only"
    >
      {({ loading, error, data }) => {
        if (loading) return <Loading />;
        if (error) return <Error error={error} />;

        if (data) {
          const { listUnfinishedImages } = data;
          if (
            listUnfinishedImages[0] &&
            listUnfinishedImages[0].id &&
            model3DpositionState.id === ""
          ) {
            console.log("setting initial image");
            setStateModel3Dposition(initialState(listUnfinishedImages[0]));
          } //
          return (
            <Wrapper>
              <Box>
                <Title>Image 1</Title>
                <Row>
                  <Test
                    imageToLabel={{ ...model3DpositionState }}
                    setState={setStateModel3Dposition}
                    gizmoState={gizmoState}
                  />
                  <Positions>
                    <h3> Position</h3>
                    <label htmlFor="positionx">x</label>
                    <input
                      id="positionx"
                      onChange={handleChange("translateX")}
                      value={model3DpositionState.translateX}
                      type="number"
                    />
                    <label htmlFor="positiony">y</label>
                    <input
                      id="positiony"
                      onChange={handleChange("translateY")}
                      value={model3DpositionState.translateY}
                      type="number"
                    />
                    <label htmlFor="positionz">z</label>
                    <input
                      id="positionz"
                      onChange={handleChange("translateZ")}
                      value={model3DpositionState.translateZ}
                      type="number"
                    />
                    <h3> Rotation</h3>
                    <label htmlFor="rotationx">x</label>
                    <input
                      id="rotationx"
                      onChange={handleChange("rotateX")}
                      value={model3DpositionState.rotateX || "0"}
                      type="number"
                    />
                    <label htmlFor="rotationy">y</label>
                    <input
                      id="rotationy"
                      onChange={handleChange("rotateY")}
                      value={model3DpositionState.rotateY || "0"}
                      type="number"
                    />
                    <label htmlFor="rotationz">z</label>
                    <input
                      id="rotationz"
                      onChange={handleChange("rotateZ")}
                      value={model3DpositionState.rotateZ || "0"}
                      type="number"
                    />
                    <h3> Scale</h3>
                    <label htmlFor="scalex">x</label>
                    <input
                      id="scalex"
                      onChange={handleChange("scaleX")}
                      value={model3DpositionState.scaleX || "0"}
                      type="number"
                    />
                    <label htmlFor="scaley">y</label>
                    <input
                      id="scaley"
                      onChange={handleChange("scaleY")}
                      value={model3DpositionState.scaleY || "0"}
                      type="number"
                    />
                    <label htmlFor="scalez">z</label>
                    <input
                      id="scalez"
                      onChange={handleChange("scaleZ")}
                      value={model3DpositionState.scaleZ || "0"}
                      type="number"
                    />
                    <StyledButton
                      active={gizmoState === "translate"}
                      onClick={() => {
                        setStateGizmoState("translate");
                      }}
                    >
                      translate
                    </StyledButton>
                    <StyledButton
                      active={gizmoState === "rotate"}
                      onClick={() => {
                        setStateGizmoState("rotate");
                      }}
                    >
                      rotate
                    </StyledButton>
                    <StyledButton
                      active={gizmoState === "scale"}
                      onClick={() => {
                        setStateGizmoState("scale");
                      }}
                    >
                      scale
                    </StyledButton>
                    <StyledButton
                      onClick={() => {
                        setStateModel3Dposition(initialState());
                      }}
                    >
                      reset
                    </StyledButton>
                    <Mutation<UpdateImageMutation, UpdateImageMutationVariables>
                      mutation={gql(updateImage)}
                    >
                      {sendMutation => (
                        <StyledButton
                          onClick={async () => {
                            await sendMutation({
                              variables: {
                                input: {
                                  ...model3DpositionState,
                                  finished: "true" as any
                                }
                              }
                            });
                            const currentIndex = data.listUnfinishedImages.findIndex(
                              item => item.id === model3DpositionState.id
                            );
                            const nextItem =
                              data.listUnfinishedImages[currentIndex + 1];
                            if (nextItem)
                              setStateModel3Dposition(initialState(nextItem));
                            else {
                              document.location.reload();
                            }
                          }}
                        >
                          done
                        </StyledButton>
                      )}
                    </Mutation>
                  </Positions>
                </Row>
              </Box>
            </Wrapper>
          );
        }
      }}
    </Query>
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

interface IStyledButton {
  active?: Boolean;
  onClick: () => void;
}

const StyledButton = styled.button<IStyledButton>`
  margin-top: 15px;
  background-color: ${p => (p.active ? "blue" : "white")};
` as React.FunctionComponent<IStyledButton>;

export type ITransformControlsType = "translate" | "rotate" | "scale";

export interface IimageToBelabelled {
  id: string;
  imageUrl: string;
  modelUrl: string;
  translateX: number;
  translateY: number;
  translateZ: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  finished: string;
}

interface listUnfinishedImagesQuery {
  listUnfinishedImages: IimageToBelabelled[];
}

export default ImageToModalMapper;
