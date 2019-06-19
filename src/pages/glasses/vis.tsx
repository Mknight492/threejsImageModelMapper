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
var TransformControls = require("three-transform-controls")(THREE);

interface IState {
  ThreeDPosition: IThreeDPosition;
  setState: Dispatch<SetStateAction<IThreeDPosition>>;
  gizmoState: ITransformControlsType;
}

const Vis: React.FunctionComponent<IState> = ({
  ThreeDPosition,
  setState,
  gizmoState
}) => {
  const { position, rotation, scale } = ThreeDPosition;

  const [imageAspectRatio, setStateAspectRatio] = useState<number>(0);

  const mount = useRef<any>(null);
  const gizmo = useRef<any>(null); // reference to the transformcontrols/gizmo
  const currentImage = useRef<any>(null);
  const currentModel = useRef<any>(null);

  // this function is called once on component mounting and sets up the threejs canvas
  useLayoutEffect(() => {
    let frameId: any;

    let fieldOfView = 100;
    let nearPlane = 0.1;
    let farPlane = 1000;
    const imageZ = 0;

    //initialising two scenes so that model lights don't affect the image lighting
    const modelScene = new THREE.Scene();
    const imageScene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      fieldOfView,
      imageAspectRatio,
      nearPlane,
      farPlane
    );
    camera.position.z = 40;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.autoClear = false;
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.current.appendChild(renderer.domElement);

    //Transform controls
    const control = new TransformControls(camera, renderer.domElement);
    control.addEventListener("change", renderScene);
    control.scope = "local";
    gizmo.current = control; //add reference to the controls so can be used out of

    const addObject = (objectToAdd: THREE.Object3D) => {
      let scale = 40;
      // - the scale might need to change based on the current image Aspect ratio
      console.log(imageAspectRatio);
      objectToAdd.scale.set(scale, scale, scale);
      currentModel.current = objectToAdd;
      control.attach(objectToAdd);

      modelScene.add(control);
      modelScene!.add(objectToAdd);
      control.addEventListener(
        "change",
        mapModelToState(objectToAdd, setState)
      );
    };

    const web =
      "https://s3-us-west-1.amazonaws.com/glassesobjects/glasses/object_json_files/3Dviewer.json";
    const normal = "./3/glasses2.json";

    const alt =
      "https://images.pexels.com/photos/248797/pexels-photo-248797.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";
    const caturl =
      "https://s3.amazonaws.com/duhaime/blog/tsne-webgl/assets/cat.jpg";

    //glasses loader
    let json_path = web;
    const loader = new THREE.ObjectLoader();
    loader.load(json_path, addObject);

    let mesh: any;
    var imageLoader = new THREE.TextureLoader();

    var imageMaterial = new THREE.MeshLambertMaterial({
      map: imageLoader.load(alt, function(img) {
        //   window.removeEventListener("resize", handleResize(imageAspectRatio));
        let imageRatio = img.image.naturalHeight / img.image.naturalWidth;
        setStateAspectRatio(imageRatio);

        let imgHeight = visibleHeightAtZDepth(0, camera); // visible height
        let imgWidth = (imgHeight * 3) / 4; //imageAspectRatio; // visible width
        let scale = 40;
        // currentModel.current.scale.set(
        //   scale / imageRatio,
        //   scale * imageRatio,
        //   scale
        // );
        //
        window.addEventListener("resize", handleResize(imageRatio));
        mesh.scale.set(imgWidth, imgHeight, 1);
        handleResize(imageRatio)();
        scaleModel(imageRatio);
      })
    });
    var imageGeometry = new THREE.PlaneGeometry(1, 1);

    // combine our image geometry and material into a mesh
    mesh = new THREE.Mesh(imageGeometry, imageMaterial);

    // set the position of the image mesh in the x,y,z dimensions
    mesh.position.set(0, 0, imageZ);
    mesh.geometry = new THREE.PlaneGeometry(1, 1);
    // add the image to the scene
    imageScene.add(mesh); //need to overcome

    var amb = new THREE.AmbientLight(0xffffff, 1);
    imageScene.add(amb);

    function renderScene() {
      renderer.render(imageScene, camera);
      renderer.render(modelScene, camera);
    }

    function handleResize(imageAspectRatio: any) {
      return function() {
        const { width, height } = determineWidthAndHeight(imageAspectRatio);
        camera.aspect = imageAspectRatio;
        renderer.setSize(width, height);
        camera.updateProjectionMatrix();
        renderScene();
      };
    }

    function determineWidthAndHeight(imageAspectRatio: any) {
      let width = mount.current.getBoundingClientRect().width;
      let height = width * imageAspectRatio;
      var viewportHeight =
        Math.max(
          document.documentElement.clientHeight,
          window.innerHeight || 0
        ) - 40;
      var maxHeight = viewportHeight - 40; //this is the height of the title

      const reduceScale = height > maxHeight ? height / maxHeight : 1;
      width = width / reduceScale;
      height = height / reduceScale;
      return { width, height };
    }

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
      window.removeEventListener("resize", handleResize);
      mount.current.removeChild(renderer.domElement);
      modelScene.remove(currentModel.current);
      modelScene.remove(mesh);
      imageGeometry.dispose();
      imageMaterial.dispose();
    };
  }, ["USE_ONCE"]);

  useLayoutEffect(() => {
    if (currentModel && currentModel.current && position) {
      currentModel.current.position.x = position.x || 0;
      currentModel.current.position.y = position.y || 0;
      currentModel.current.position.z = position.z || 10;
      currentModel.current.rotation.x = degreesToRadians(rotation.x) || 0;
      currentModel.current.rotation.y = degreesToRadians(rotation.y) || 0;
      currentModel.current.rotation.z = degreesToRadians(rotation.z) || 0;
      currentModel.current.scale.x = scale.x || 40;
      currentModel.current.scale.y = scale.y || 40;
      currentModel.current.scale.z = scale.z || 40;
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
    currentModel.current
  ]);

  useLayoutEffect(() => {
    scaleModel(imageAspectRatio);
  }, [currentModel.current]);

  useLayoutEffect(() => {
    gizmo.current.setMode(gizmoState);
  }, [gizmoState]);

  useLayoutEffect(() => {}, [currentImage.current]);

  function scaleModel(imageRatio: number) {
    let scale = 40;
    if (currentModel.current)
      currentModel.current.scale.set(
        scale * imageRatio,
        scale / imageRatio,
        scale
      );
  }

  return (
    <div style={{ width: "100%" }}>
      <Mount ref={mount} />
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

const visibleHeightAtZDepth = (depth: any, camera: any) => {
  // compensate for cameras not positioned at z=0
  const cameraOffset = camera.position.z;
  if (depth < cameraOffset) depth -= cameraOffset;
  else depth += cameraOffset;

  // vertical fov in radians
  const vFOV = (camera.fov * Math.PI) / 180;

  // Math.abs to ensure the result is always positive
  return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
};

const visibleWidthAtZDepth = (depth: any, camera: any) => {
  const height = visibleHeightAtZDepth(depth, camera);
  return height * camera.aspect;
};

const radiansToDegrees = (rads: ICoordinate): ICoordinate => {
  if (rads === "" || rads === "-") return rads;
  return (rads * 180) / Math.PI;
};

const degreesToRadians = (degs: ICoordinate): ICoordinate => {
  if (degs === "" || degs === "-") return degs;
  return (degs / 180) * Math.PI;
};

//styles

const Mount = styled.div`
  width: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default Vis;
