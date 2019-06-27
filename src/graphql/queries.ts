// tslint:disable
// this is an auto generated file. This will be overwritten

export const getImage = `query GetImage($id: ID!) {
  getImage(id: $id) {
    id
    imageUrl
    modelUrl
    translateX
    translateY
    translateZ
    rotateX
    rotateY
    rotateZ
    scaleX
    scaleY
    scaleZ
    finished
  }
}
`;
export const listImages = `query ListImages(
  $filter: ModelImageFilterInput
  $limit: Int
  $nextToken: String
) {
  listImages(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      imageUrl
      modelUrl
      translateX
      translateY
      translateZ
      rotateX
      rotateY
      rotateZ
      scaleX
      scaleY
      scaleZ
      finished
    }
    nextToken
  }
}
`;
export const imagesByFinished = `query ImagesByFinished(
  $finished: String
  $filter: ModelImageFilterInput
  $limit: Int
  $nextToken: String
) {
  imagesByFinished(
    finished: $finished
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      imageUrl
      modelUrl
      translateX
      translateY
      translateZ
      rotateX
      rotateY
      rotateZ
      scaleX
      scaleY
      scaleZ
      finished
    }
    nextToken
  }
}
`;
