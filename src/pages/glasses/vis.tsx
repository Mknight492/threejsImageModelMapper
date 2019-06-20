import React, {
  useRef,
  useEffect,
  useLayoutEffect,
  useState,
  Dispatch,
  SetStateAction
} from "react";
import * as THREE from "three";

//helpers
import { SizeMe } from "react-sizeme";

//models
import {
  IThreeDPosition,
  ITransformControlsType,
  ICoordinate
} from "./container";

import styled from "styled-components";

//the transfor controls aren't exported from "three" so have to be imported like so
var TransformControls = require("three-transform-ctrls");

interface IState {
  ThreeDPosition: IThreeDPosition;
  setState: Dispatch<SetStateAction<IThreeDPosition>>;
  gizmoState: ITransformControlsType;
  imageUrl: string;
  modelUrl: string;
}

const Vis: React.FunctionComponent<IState> = ({
  ThreeDPosition,
  setState,
  gizmoState,
  imageUrl,
  modelUrl
}) => {
  const { position, rotation, scale } = ThreeDPosition;

  const [imageOffset, setStateImageOffset] = useState<number>(0);

  const mount = useRef<any>(null);
  const gizmo = useRef<any>(null); // reference to the transformcontrols/gizmo

  const renderer = useRef<THREE.WebGLRenderer>();

  let fieldOfView = 100;
  let initialAspectRatio = 1;
  let nearPlane = 0.1;
  let farPlane = 1000;
  const imageZ = 0;

  const camera = useRef<THREE.PerspectiveCamera>(
    new THREE.PerspectiveCamera(
      fieldOfView,
      initialAspectRatio,
      nearPlane,
      farPlane
    )
  );

  const modelScene = useRef<THREE.Scene>(new THREE.Scene());
  const imageScene = useRef<THREE.Scene>(new THREE.Scene());

  const image = useRef({
    loader: new THREE.TextureLoader(),
    imageMaterial: new THREE.MeshLambertMaterial(),
    imageGeometry: new THREE.PlaneGeometry(),
    mesh: new THREE.Mesh(),
    currentImageEventListener: (event: Event) => {}
  });

  const model = useRef({
    loader: new THREE.ObjectLoader(),
    modelinstance: new THREE.Object3D(),
    eventListener: (event: Event) => {}
  });

  // this function is called once on component mounting and sets up the threejs canvas
  useLayoutEffect(() => {
    let frameId: any;

    camera.current.position.z = 40;
    camera.current.lookAt(new THREE.Vector3(0, 0, 0));

    let rendererInstance = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });

    renderer.current = rendererInstance;
    renderer.current.autoClear = false;
    renderer.current.setClearColor(0xffffff, 0);
    renderer.current.setPixelRatio(window.devicePixelRatio);
    mount.current.appendChild(renderer.current.domElement);

    //Transform controls
    const control = new TransformControls(
      camera.current,
      renderer.current.domElement
    );
    control.addEventListener("change", renderScene);
    control.scope = "global";
    gizmo.current = control; //add reference to the controls so can be used out of

    var amb = new THREE.AmbientLight(0xffffff, 1);
    imageScene.current.add(amb);

    const animate = () => {
      renderScene();
      frameId = window.requestAnimationFrame(animate);
    };

    const start = () => {
      if (!frameId) {
        frameId = requestAnimationFrame(animate);
      }
    };

    const stop = () => {
      cancelAnimationFrame(frameId);
      frameId = null;
    };

    start();

    return () => {
      stop();
    };
  }, ["USE_ONCE"]);

  //method for updating model position if its edited in the form
  useLayoutEffect(() => {
    if (model && model.current && position) {
      model.current.modelinstance.position.x = formatCoordinate(position.x);
      model.current.modelinstance.position.y = formatCoordinate(position.y);
      model.current.modelinstance.position.z = formatCoordinate(position.z);
      model.current.modelinstance.rotation.x =
        (degreesToRadians(rotation.x) as number) || 0;
      model.current.modelinstance.rotation.y =
        (degreesToRadians(rotation.y) as number) || 0;
      model.current.modelinstance.rotation.z =
        (degreesToRadians(rotation.z) as number) || 0;
      model.current.modelinstance.scale.x = formatCoordinate(scale.x);
      model.current.modelinstance.scale.y = formatCoordinate(scale.y);
      model.current.modelinstance.scale.z = formatCoordinate(scale.z);
    }
  }, [
    position.x,
    position.y,
    position.z,
    rotation.x,
    rotation.y,
    rotation.z,
    scale.x,
    scale.y,
    scale.z,
    model.current
  ]);

  //method for upading gizmo when the mode button is clicked
  useLayoutEffect(() => {
    gizmo.current.setMode(gizmoState);
  }, [gizmoState]);

  //method for loading new image and model on props change
  useLayoutEffect(() => {
    addImage(imageUrl);
  }, [imageUrl]);

  useLayoutEffect(() => {
    addModel(modelUrl);
  }, [modelUrl]);

  function addModel(modelUrl: string) {
    //remove old model
    modelScene.current.remove(model.current.modelinstance);
    gizmo.current.removeEventListener("change", model.current.eventListener);
    //add new model
    model.current.loader.load(modelUrl, (modelToAdd: THREE.Object3D) => {
      let scale = camera.current.position.z;
      modelToAdd.scale.set(scale, scale, scale);
      modelToAdd.position.z = 10;
      model.current.modelinstance = modelToAdd;
      gizmo.current.attach(modelToAdd);
      modelScene.current.add(gizmo.current);
      modelScene!.current.add(modelToAdd);
      model.current.eventListener = mapModelToState(modelToAdd, setState);
      gizmo.current.addEventListener("change", model.current.eventListener);
    });
  }

  function addImage(imageUrl: string) {
    //remove old image
    if (image.current.mesh) imageScene.current.remove(image.current.mesh);
    if (image.current.imageGeometry) image.current.imageGeometry.dispose();
    if (image.current.imageMaterial) image.current.imageMaterial.dispose();
    if (image.current.currentImageEventListener)
      window.removeEventListener(
        "resize",
        image.current.currentImageEventListener
      );

    const loaderInst = new THREE.TextureLoader();
    //add new image
    image.current.imageMaterial = new THREE.MeshLambertMaterial({
      map: loaderInst.load(imageUrl, function(img) {
        let imageRatio = img.image.naturalWidth / img.image.naturalHeight;
        //event listeners need to be change to remove/add reference to the function
        image.current.currentImageEventListener = handleResize(imageRatio);
        window.addEventListener(
          "resize",
          image.current.currentImageEventListener
        );
        image.current.currentImageEventListener({} as Event);
      })
    });
    image.current.imageGeometry = new THREE.PlaneGeometry(1, 1);

    // combine our image geometry and material into a mesh
    image.current.mesh = new THREE.Mesh(
      image.current.imageGeometry,
      image.current.imageMaterial
    );

    // set the position of the image mesh in the x,y,z dimensions
    image.current.mesh.position.set(0, 0, imageZ);

    // add the image to the scene
    imageScene.current.add(image.current.mesh); //need to overcome
  }

  function renderScene() {
    if (renderer.current && camera.current) {
      renderer.current.render(imageScene.current, camera.current);
      renderer.current.render(modelScene.current, camera.current);
    }
  }

  function handleResize(imageAspectRatio: any) {
    return function() {
      const { width, height } = determineWidthAndHeight(imageAspectRatio);

      var maxSize = Math.max(width, height);
      if (renderer.current) renderer.current.setSize(maxSize, maxSize);

      let imgHeight: number;
      let imgWidth: number;

      //image is portrate
      if (imageAspectRatio < 1) {
        imgHeight = maximumWidthOrHeightAtZDepth(0, camera.current);
        imgWidth = imgHeight * imageAspectRatio;
        setStateImageOffset(0);
      } //image is landscape
      else {
        imgWidth = maximumWidthOrHeightAtZDepth(0, camera.current);
        imgHeight = imgWidth / imageAspectRatio;

        setStateImageOffset((height - width) / 2); // means image will always be in the top left
      }
      image.current.mesh.geometry = new THREE.PlaneGeometry(
        imgWidth,
        imgHeight
      );
      camera.current.updateProjectionMatrix();
      renderScene();
    };
  }

  function determineWidthAndHeight(imageAspectRatio: any) {
    var viewportHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );
    var maxHeight = viewportHeight - 40; //this is the height of the title
    let maxWidth = mount.current.getBoundingClientRect().width;

    let sizeByWidth = {
      width: maxWidth,
      height: maxWidth / imageAspectRatio
    };
    let sizeByHeight = {
      width: maxHeight * imageAspectRatio,
      height: maxHeight
    };

    if (
      sizeByWidth.width < sizeByHeight.width &&
      sizeByWidth.height < maxHeight
    ) {
      return sizeByWidth;
    } else return sizeByHeight;
  }

  return (
    <div style={{ width: "100%" }}>
      <Mount ref={mount} shift={imageOffset} />
    </div>
  );
};

//helpers & styles

const mapModelToState = (
  model: THREE.Object3D,
  setState: Dispatch<SetStateAction<IThreeDPosition>>
) => () => {
  setState({
    position: {
      x: model.position.x,
      y: model.position.y,
      z: model.position.z
    },
    rotation: {
      x: radiansToDegrees(model.rotation.x),
      y: radiansToDegrees(model.rotation.y),
      z: radiansToDegrees(model.rotation.z)
    },
    scale: {
      x: model.scale.x,
      y: model.scale.y,
      z: model.scale.z
    }
  });
};

const maximumWidthOrHeightAtZDepth = (depth: any, camera: any) => {
  // compensate for cameras not positioned at z=0
  const cameraOffset = camera.position.z;
  if (depth < cameraOffset) depth -= cameraOffset;
  else depth += cameraOffset;

  // vertical fov in radians
  const vFOV = (camera.fov * Math.PI) / 180;

  // Math.abs to ensure the result is always positive
  return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
};

function formatCoordinate(coordinate: ICoordinate): number {
  return coordinate === "-" || coordinate === "" ? 0 : coordinate;
}

const radiansToDegrees = (rads: ICoordinate): ICoordinate => {
  if (rads === "" || rads === "-") return rads;
  return (rads * 180) / Math.PI;
};

const degreesToRadians = (degs: ICoordinate): ICoordinate => {
  if (degs === "" || degs === "-") return degs;
  return (degs / 180) * Math.PI;
};

//styles

interface scalabe {
  shift: number;
  ref: React.MutableRefObject<any>;
}

const Mount = styled.div<scalabe>`
  width: 95%;
  display: flex;
  align-items: center;
  justify-content: center;
  * {
    margin-top: ${p => p.shift}px;
    margin-bottom: ${p => p.shift}px;
  }
` as React.FunctionComponent<scalabe>;

export default Vis;
