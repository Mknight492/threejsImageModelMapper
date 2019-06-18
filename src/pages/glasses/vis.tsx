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
import { IThreeDPosition, ITransformControlsType } from "./container";

var TransformControls = require("three-transform-controls")(THREE);
const OrbitControls = require("three-orbitcontrols");

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
  const [isAnimating, setAnimating] = useState(true);
  const controls = useRef<any>(null);

  const imageAspectRatio = 3 / 4;

  const [glasses, setGlasses] = useState<any>();
  const gizmo = useRef<any>(null);
  //   let glasses: THREE.Object3D;

  // this function is called once on component mounting and sets up the threejs canvas
  useLayoutEffect(() => {
    let width = mount.current.getBoundingClientRect().width;
    let height = width * imageAspectRatio;
    let frameId: any;

    let fieldOfView = 100;
    let nearPlane = 0.1;
    let farPlane = 1000;

    const imageZ = 0;
    let modelZ = 10;

    const scene = new THREE.Scene();
    const scene2 = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      fieldOfView,
      imageAspectRatio,
      nearPlane,
      farPlane
    );
    camera.position.z = 40;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    let imgHeight = visibleHeightAtZDepth(0, camera); // visible height
    let imgWidth = imgHeight * camera.aspect; // visible width

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.autoClear = false;
    renderer.setSize(width, height);
    mount.current.appendChild(renderer.domElement);
    window.addEventListener("resize", handleResize);

    //Transform controls && orbit controls

    // const orbit = new OrbitControls(camera, renderer.domElement);
    // orbit.update();
    // orbit.addEventListener("change", renderScene);

    const control = new TransformControls(camera, renderer.domElement);
    control.addEventListener("change", renderScene);
    gizmo.current = control;

    // control.addEventListener("dragging-changed", function(event: any) {
    //   orbit.enabled = !event.value;
    // });

    const updateState = (glasses: THREE.Object3D) => () => {
      setState({
        position: {
          x: glasses.position.x,
          y: glasses.position.y,
          z: glasses.position.z
        },
        rotation: {
          x: glasses.rotation.x,
          y: glasses.rotation.y,
          z: glasses.rotation.z
        },
        scale: {
          x: glasses.scale.x,
          y: glasses.scale.y,
          z: glasses.scale.z
        }
      });
    };

    const addObject = async (objectToAdd: THREE.Object3D) => {
      let scale = 40;
      objectToAdd.scale.set(scale * imageAspectRatio, scale, scale);

      await setGlasses(objectToAdd);
      control.attach(objectToAdd);
      //   control.scale.set(80, 80, 80);

      scene.add(control);
      scene!.add(objectToAdd);
      control.addEventListener("change", updateState(objectToAdd));
    };

    const web =
      "https://s3-us-west-1.amazonaws.com/glassesobjects/glasses/object_json_files/3Dviewer.json";
    const normal = "./3/glasses2.json";

    //glasses loader
    let json_path = normal;
    const loader = new THREE.ObjectLoader();
    loader.load(json_path, addObject);

    //image loader
    var imageLoader = new THREE.TextureLoader();
    var imageMaterial = new THREE.MeshLambertMaterial({
      map: imageLoader.load(
        "https://s3.amazonaws.com/duhaime/blog/tsne-webgl/assets/cat.jpg"
      )
    });
    var imageMaterial2 = new THREE.MeshLambertMaterial({
      map: imageLoader.load("")
    });
    // deterime what is visable fgrom the camera and make the image equal to that size

    console.log(imgWidth); //
    var imageGeometry = new THREE.PlaneGeometry(imgWidth, imgHeight);

    // combine our image geometry and material into a mesh
    var mesh = new THREE.Mesh(imageGeometry, imageMaterial);
    var mesh2 = new THREE.Mesh(imageGeometry, imageMaterial);

    // set the position of the image mesh in the x,y,z dimensions
    mesh.position.set(0, 0, imageZ);
    mesh2.position.set(0, 0, 1);

    // add the image to the scene
    //scene.add(mesh);
    scene2.add(mesh); //need to overcome

    var amb = new THREE.AmbientLight(0xffffff, 1);
    scene2.add(amb);

    function renderScene() {
      renderer.render(scene2, camera);
      renderer.render(scene, camera);
    }

    function handleResize() {
      width = mount.current.getBoundingClientRect().width;
      height = width * imageAspectRatio;
      renderer.setSize(width, height);
      camera.updateProjectionMatrix();
      renderScene();
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

    controls.current = { start, stop };

    return () => {
      stop();
      window.removeEventListener("resize", handleResize);
      mount.current.removeChild(renderer.domElement);
      scene.remove(glasses);
      scene.remove(mesh);
      imageGeometry.dispose();
      imageMaterial.dispose();
    };
  }, ["USE_ONCE"]);

  //   useLayoutEffect(() => {
  //     if (isAnimating) {
  //       controls.current.start();
  //     } else {
  //       controls.current.stop();
  //     }
  //   }, [isAnimating]);

  useLayoutEffect(() => {
    console.log("effect");

    if (glasses && position) {
      glasses.position.x = position.x || 0;
      glasses.position.y = position.y || 0;
      glasses.position.z = position.z || 0;
      glasses.rotation.x = rotation.x || 0;
      glasses.rotation.y = rotation.y || 0;
      glasses.rotation.z = rotation.z || 0;
      glasses.scale.x = scale.x || 0;
      glasses.scale.y = scale.y || 0;
      glasses.scale.z = scale.z || 0;
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
    glasses
  ]);

  useLayoutEffect(() => {
    gizmo.current.setMode(gizmoState);
  }, [gizmoState]);

  return (
    <div style={{ width: "100%" }}>
      <div
        className="vis"
        style={{ width: "90%", margin: "0 auto" }}
        ref={mount}
        // onClick={() => setAnimating(!isAnimating)}
      />
    </div>
  );
};

//helpers

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

export default Vis;
