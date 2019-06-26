// tslint:disable
// this is an auto generated file. This will be overwritten

export const onCreateImage = `subscription OnCreateImage(
  $id: ID
  $url: String
  $translateX: Float
  $translateY: Float
  $translateZ: Float
) {
  onCreateImage(
    id: $id
    url: $url
    translateX: $translateX
    translateY: $translateY
    translateZ: $translateZ
  ) {
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
export const onUpdateImage = `subscription OnUpdateImage(
  $id: ID
  $url: String
  $translateX: Float
  $translateY: Float
  $translateZ: Float
) {
  onUpdateImage(
    id: $id
    url: $url
    translateX: $translateX
    translateY: $translateY
    translateZ: $translateZ
  ) {
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
export const onDeleteImage = `subscription OnDeleteImage(
  $id: ID
  $url: String
  $translateX: Float
  $translateY: Float
  $translateZ: Float
) {
  onDeleteImage(
    id: $id
    url: $url
    translateX: $translateX
    translateY: $translateY
    translateZ: $translateZ
  ) {
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
