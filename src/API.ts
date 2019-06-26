/* tslint:disable */
//  This file was automatically generated and should not be edited.

export type CreateImageInput = {
  imageUrl?: string | null,
  modelUrl?: string | null,
  translateX?: number | null,
  translateY?: number | null,
  translateZ?: number | null,
  rotateX?: number | null,
  rotateY?: number | null,
  rotateZ?: number | null,
  scaleX?: number | null,
  scaleY?: number | null,
  scaleZ?: number | null,
  finished?: string | null,
};

export type UpdateImageInput = {
  id?: string | null,
  imageUrl?: string | null,
  modelUrl?: string | null,
  translateX?: number | null,
  translateY?: number | null,
  translateZ?: number | null,
  rotateX?: number | null,
  rotateY?: number | null,
  rotateZ?: number | null,
  scaleX?: number | null,
  scaleY?: number | null,
  scaleZ?: number | null,
  finished?: string | null,
};

export type DeleteImageInput = {
  id: string,
};

export type TableImageFilterInput = {
  id?: TableIDFilterInput | null,
  url?: TableStringFilterInput | null,
  translateX?: TableFloatFilterInput | null,
  translateY?: TableFloatFilterInput | null,
  translateZ?: TableFloatFilterInput | null,
  rotateX?: TableFloatFilterInput | null,
  rotateY?: TableFloatFilterInput | null,
  rotateZ?: TableFloatFilterInput | null,
  scaleX?: TableFloatFilterInput | null,
  scaleY?: TableFloatFilterInput | null,
  scaleZ?: TableFloatFilterInput | null,
  finished?: TableBooleanFilterInput | null,
};

export type TableIDFilterInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type TableStringFilterInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type TableFloatFilterInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  contains?: number | null,
  notContains?: number | null,
  between?: Array< number | null > | null,
};

export type TableBooleanFilterInput = {
  ne?: boolean | null,
  eq?: boolean | null,
};

export type CreateImageMutationVariables = {
  input: CreateImageInput,
};

export type CreateImageMutation = {
  createImage:  {
    __typename: "Image",
    id: string | null,
    imageUrl: string | null,
    modelUrl: string | null,
    translateX: number | null,
    translateY: number | null,
    translateZ: number | null,
    rotateX: number | null,
    rotateY: number | null,
    rotateZ: number | null,
    scaleX: number | null,
    scaleY: number | null,
    scaleZ: number | null,
    finished: boolean | null,
  } | null,
};

export type UpdateImageMutationVariables = {
  input: UpdateImageInput,
};

export type UpdateImageMutation = {
  updateImage:  {
    __typename: "Image",
    id: string | null,
    imageUrl: string | null,
    modelUrl: string | null,
    translateX: number | null,
    translateY: number | null,
    translateZ: number | null,
    rotateX: number | null,
    rotateY: number | null,
    rotateZ: number | null,
    scaleX: number | null,
    scaleY: number | null,
    scaleZ: number | null,
    finished: boolean | null,
  } | null,
};

export type DeleteImageMutationVariables = {
  input: DeleteImageInput,
};

export type DeleteImageMutation = {
  deleteImage:  {
    __typename: "Image",
    id: string | null,
    imageUrl: string | null,
    modelUrl: string | null,
    translateX: number | null,
    translateY: number | null,
    translateZ: number | null,
    rotateX: number | null,
    rotateY: number | null,
    rotateZ: number | null,
    scaleX: number | null,
    scaleY: number | null,
    scaleZ: number | null,
    finished: boolean | null,
  } | null,
};

export type GetImageQueryVariables = {
  id: string,
};

export type GetImageQuery = {
  getImage:  {
    __typename: "Image",
    id: string | null,
    imageUrl: string | null,
    modelUrl: string | null,
    translateX: number | null,
    translateY: number | null,
    translateZ: number | null,
    rotateX: number | null,
    rotateY: number | null,
    rotateZ: number | null,
    scaleX: number | null,
    scaleY: number | null,
    scaleZ: number | null,
    finished: boolean | null,
  } | null,
};

export type ListImagesQueryVariables = {
  filter?: TableImageFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListImagesQuery = {
  listImages:  {
    __typename: "ImageConnection",
    items:  Array< {
      __typename: "Image",
      id: string | null,
      imageUrl: string | null,
      modelUrl: string | null,
      translateX: number | null,
      translateY: number | null,
      translateZ: number | null,
      rotateX: number | null,
      rotateY: number | null,
      rotateZ: number | null,
      scaleX: number | null,
      scaleY: number | null,
      scaleZ: number | null,
      finished: boolean | null,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type ListUnfinishedImagesQuery = {
  listUnfinishedImages:  Array< {
    __typename: "Image",
    id: string | null,
    imageUrl: string | null,
    modelUrl: string | null,
    translateX: number | null,
    translateY: number | null,
    translateZ: number | null,
    rotateX: number | null,
    rotateY: number | null,
    rotateZ: number | null,
    scaleX: number | null,
    scaleY: number | null,
    scaleZ: number | null,
    finished: boolean | null,
  } | null > | null,
};

export type OnCreateImageSubscriptionVariables = {
  id?: string | null,
  url?: string | null,
  translateX?: number | null,
  translateY?: number | null,
  translateZ?: number | null,
};

export type OnCreateImageSubscription = {
  onCreateImage:  {
    __typename: "Image",
    id: string | null,
    imageUrl: string | null,
    modelUrl: string | null,
    translateX: number | null,
    translateY: number | null,
    translateZ: number | null,
    rotateX: number | null,
    rotateY: number | null,
    rotateZ: number | null,
    scaleX: number | null,
    scaleY: number | null,
    scaleZ: number | null,
    finished: boolean | null,
  } | null,
};

export type OnUpdateImageSubscriptionVariables = {
  id?: string | null,
  url?: string | null,
  translateX?: number | null,
  translateY?: number | null,
  translateZ?: number | null,
};

export type OnUpdateImageSubscription = {
  onUpdateImage:  {
    __typename: "Image",
    id: string | null,
    imageUrl: string | null,
    modelUrl: string | null,
    translateX: number | null,
    translateY: number | null,
    translateZ: number | null,
    rotateX: number | null,
    rotateY: number | null,
    rotateZ: number | null,
    scaleX: number | null,
    scaleY: number | null,
    scaleZ: number | null,
    finished: boolean | null,
  } | null,
};

export type OnDeleteImageSubscriptionVariables = {
  id?: string | null,
  url?: string | null,
  translateX?: number | null,
  translateY?: number | null,
  translateZ?: number | null,
};

export type OnDeleteImageSubscription = {
  onDeleteImage:  {
    __typename: "Image",
    id: string | null,
    imageUrl: string | null,
    modelUrl: string | null,
    translateX: number | null,
    translateY: number | null,
    translateZ: number | null,
    rotateX: number | null,
    rotateY: number | null,
    rotateZ: number | null,
    scaleX: number | null,
    scaleY: number | null,
    scaleZ: number | null,
    finished: boolean | null,
  } | null,
};
