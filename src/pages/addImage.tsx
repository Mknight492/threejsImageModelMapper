import React, {
  Dispatch,
  SetStateAction,
  useState,
  FormEvent,
  ChangeEvent
} from "react";

import styled from "styled-components";

//apollo imports
import { Mutation, MutationFn } from "react-apollo";
import {
  CreateImageMutation,
  CreateImageMutationVariables
} from "../graphql/API";
import { createImage } from "../graphql/mutations";
import gql from "graphql-tag";

import { IPages } from "../App";

interface IProps {
  setStatePage: Dispatch<SetStateAction<IPages>>;
}

interface IFormState {
  imageUrl: {
    data: string;
    isValid: Boolean;
  };
  modelUrl: {
    data: string;
    isValid: Boolean;
  };
}

type INetworkState = null | "loading" | "error" | "success";

const AddImage: React.FunctionComponent<IProps> = () => {
  const [formState, setStateFormState] = useState<IFormState>(initialState());
  const [networkState, setStateNetworkState] = useState<INetworkState>();

  const handleChange = (key: keyof IFormState) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    console.log("here", event, event.target.value);
    event.persist();
    setStateFormState(state => {
      const newState = { ...state };
      newState[key].data = event.target.value;
      Object.values(newState).forEach(formRow => {
        formRow.isValid = true;
      });
      return newState;
    });
    setStateNetworkState(null);
  };

  const handleSubmit = (
    mutation: MutationFn<CreateImageMutation, CreateImageMutationVariables>
  ) => async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formIsValid()) {
      mutation({
        variables: {
          input: {
            modelUrl: formState.modelUrl.data,
            imageUrl: formState.imageUrl.data,
            finished: "false"
          }
        }
      });
      setStateNetworkState("success");
    } else {
      addValidationToForm();
    }
  };

  const addValidationToForm = () => {
    setStateFormState(state => {
      const newState = { ...state };
      Object.values(newState).forEach(formRow => {
        formRow.isValid = isValidURL(formRow.data);
      });
      return newState;
    });
  };

  const formIsValid = (): Boolean => {
    return Object.values(formState).reduce(
      (acc, formRow) => isValidURL(formRow.data) && acc,

      true
    );
  };

  return (
    <Mutation<CreateImageMutation, CreateImageMutationVariables>
      mutation={gql(createImage)}
    >
      {(Mutation, { data, loading, error }) => {
        console.log(data);
        if (error) setStateNetworkState("error");
        else if (loading) setStateNetworkState("loading");
        else if (data) setStateNetworkState(null);
        return (
          <Wrapper>
            <Form onSubmit={handleSubmit(Mutation)}>
              <h2> Add an image </h2>
              <label htmlFor="imageUrl">Image Url</label>
              <input
                id="imageUrl"
                onChange={handleChange("imageUrl")}
                value={formState.imageUrl.data}
                type="text"
              />
              <ErrorLabel htmlFor="imageUrl">
                {formState.imageUrl.isValid
                  ? "\u00A0" //retains label height in dom
                  : "please enter a valid image URL"}
              </ErrorLabel>
              <label htmlFor="modelUrl">Model Url</label>
              <input
                id="modelUrl"
                onChange={handleChange("modelUrl")}
                value={formState.modelUrl.data}
                type="text"
              />
              <ErrorLabel htmlFor="imageUrl">
                {formState.modelUrl.isValid
                  ? "\u00A0"
                  : "please enter a valid model URL"}
              </ErrorLabel>
              <button type="submit">Add image</button>
              {networkState === "error" && (
                <div> there was an error adding your image</div>
              )}
              {networkState === "loading" && <div>processing... </div>}
              {networkState === "success" && (
                <div> your image was added succesfully</div>
              )}
            </Form>
          </Wrapper>
        );
      }}
    </Mutation>
  );
};

//helper functions

const initialState = (): IFormState => ({
  imageUrl: {
    data: "",
    isValid: true
  },
  modelUrl: {
    data: "",
    isValid: true
  }
});

const isValidURL = (url: string): Boolean => {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + //port
    "(\\?[;&amp;a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );
  console.log(url);
  console.log(pattern.test(url));
  return pattern.test(url);
};
//stlyes

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  max-width: 1240px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 2px blue solid;
  max-width: 600px;
  width: 100%;
`;

const ErrorLabel = styled.label`
  color: red;
  font-weight: bold;
`;

export default AddImage;
