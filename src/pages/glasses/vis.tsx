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

  const mount = useRef<any>(null);
  const gizmo = useRef<any>(null); // reference to the transformcontrols/gizmo
  const currentImage = useRef<any>(null);
  const currentModel = useRef<any>(null);

  // this function is called once on component mounting and sets up the threejs canvas
  useLayoutEffect(() => {
    let frameId: any;

    let fieldOfView = 100;
    let initialAspectRatio = 1;
    let nearPlane = 0.1;
    let farPlane = 1000;
    const imageZ = 0;

    //initialising two scenes so that model lights don't affect the image lighting
    const modelScene = new THREE.Scene();
    const imageScene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      fieldOfView,
      initialAspectRatio,
      nearPlane,
      farPlane
    );
    camera.position.z = 40;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.autoClear = false;
    renderer.setClearColor(0xffffff, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.current.appendChild(renderer.domElement);

    //Transform controls
    const control = new TransformControls(camera, renderer.domElement);
    control.addEventListener("change", renderScene);
    control.scope = "global";
    gizmo.current = control; //add reference to the controls so can be used out of

    const web =
      "https://s3-us-west-1.amazonaws.com/glassesobjects/glasses/object_json_files/3Dviewer.json";

    const alt =
      "https://images.pexels.com/photos/248797/pexels-photo-248797.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";
    const alt2 =
      "data:image/jpeg;base64,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";

    //glasses loader
    let json_path = web;
    const loader = new THREE.ObjectLoader();
    loader.load(json_path, addObject);

    let mesh: any;
    var imageLoader = new THREE.TextureLoader();

    var imageMaterial = new THREE.MeshLambertMaterial({
      map: imageLoader.load(alt2, function(img) {
        let imageRatio = img.image.naturalWidth / img.image.naturalHeight;
        //event listeners need to be change to remove/add reference to the function
        window.removeEventListener("resize", handleResize(imageRatio));
        window.addEventListener("resize", handleResize(imageRatio));
        handleResize(imageRatio)();
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
    function addObject(objectToAdd: THREE.Object3D) {
      let scale = camera.position.z;
      objectToAdd.scale.set(scale, scale, scale);
      currentModel.current = objectToAdd;
      control.attach(objectToAdd);
      modelScene.add(control);
      modelScene!.add(objectToAdd);
      control.addEventListener(
        "change",
        mapModelToState(objectToAdd, setState)
      );
    }

    function handleResize(imageAspectRatio: any) {
      return function() {
        const { width, height } = determineWidthAndHeight(imageAspectRatio);

        var maxSize = Math.max(width, height);
        renderer.setSize(maxSize, maxSize);

        let imgHeight: number;
        let imgWidth: number;

        //image is portrate
        if (imageAspectRatio < 1) {
          imgHeight = visibleHeightAtZDepth(0, camera); // visible height
          imgWidth = imgHeight * imageAspectRatio; //imageAspectRatio; // visible
        } //image is landscape
        else {
          imgWidth = visibleHeightAtZDepth(0, camera); // visible height
          imgHeight = imgWidth / imageAspectRatio; // visible wid
          mesh.position.y = (imgWidth - imgHeight) / 2;
        }
        mesh.geometry = mesh.geometry = new THREE.PlaneGeometry(
          imgWidth,
          imgHeight
        );
        camera.updateProjectionMatrix();
        renderScene();
      };
    }

    function determineWidthAndHeight(
      imageAspectRatio: any
    ): {
      width: number;
      height: number;
    } {
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
    gizmo.current.setMode(gizmoState);
  }, [gizmoState]);

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
