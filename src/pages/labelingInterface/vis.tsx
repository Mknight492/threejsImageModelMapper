import React, {
  useRef,
  useLayoutEffect,
  Dispatch,
  SetStateAction
} from "react";
import * as THREE from "three";

//models
import { ITransformControlsType, IimageToBelabelled } from "./container";

//styles
import styled from "styled-components";

//misc
//had to customis
import TransformControls from "../../misc/transformControls";

interface IState {
  imageToLabel: IimageToBelabelled;
  setState: Dispatch<SetStateAction<IimageToBelabelled>>;
  gizmoState: ITransformControlsType;
}

const Vis: React.FunctionComponent<IState> = ({
  imageToLabel,
  setState,
  gizmoState
}) => {
  const mount = useRef<any>(null);
  const gizmo = useRef<any>(null); // reference to the transformcontrols/gizmo

  const renderer = useRef<THREE.WebGLRenderer>();

  let fieldOfView = 100;
  let initialAspectRatio = 1;
  let nearPlane = 0.1;
  let farPlane = 1000;
  const imageZ = 0;

  const useOnce = "UseOnce";

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
    camera.current.position.z = 1000;
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
  }, [useOnce]);

  //method for updating model position if its edited in the form
  useLayoutEffect(() => {
    if (model && model.current) {
      model.current.modelinstance.position.x = formatCoordinate(
        imageToLabel.translateX || 0
      );
      model.current.modelinstance.position.y = formatCoordinate(
        imageToLabel.translateY || 0
      );
      model.current.modelinstance.position.z = formatCoordinate(
        imageToLabel.translateZ || 0
      );
      model.current.modelinstance.rotation.x = degreesToRadians(
        imageToLabel.rotateX || 0
      ) as number;
      model.current.modelinstance.rotation.y = degreesToRadians(
        imageToLabel.rotateY || 0
      ) as number;
      model.current.modelinstance.rotation.z = degreesToRadians(
        imageToLabel.rotateZ || 0
      ) as number;
      model.current.modelinstance.scale.x = formatCoordinate(
        ((imageToLabel.scaleX as number) || 0) * camera.current.position.z
      );
      model.current.modelinstance.scale.y = formatCoordinate(
        ((imageToLabel.scaleY as number) || 0) * camera.current.position.z
      );
      model.current.modelinstance.scale.z = formatCoordinate(
        ((imageToLabel.scaleZ as number) || 0) * camera.current.position.z
      );
    }
  }, [
    imageToLabel.translateX,
    imageToLabel.translateY,
    imageToLabel.translateZ,
    imageToLabel.rotateX,
    imageToLabel.rotateY,
    imageToLabel.rotateZ,
    imageToLabel.scaleX,
    imageToLabel.scaleY,
    imageToLabel.scaleZ
  ]);

  //method for upading gizmo when the mode button is clicked
  useLayoutEffect(() => {
    gizmo.current.showZ = gizmoState !== "translate"; // hide the Z-Index handle if mode is translate
    gizmo.current.setMode(gizmoState);
  }, [gizmoState]);

  //method for loading new image and model on props change
  useLayoutEffect(() => {
    addImage(imageToLabel.imageUrl);

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

      // const loaderInst = new THREE.TextureLoader();
      //add new image
      if (imageUrl)
        image.current.imageMaterial = new THREE.MeshLambertMaterial({
          map: image.current.loader.load(imageUrl, function(img) {
            //once the image is loaded we can determine it's aspect ratio
            let imageRatio = img.image.naturalWidth / img.image.naturalHeight;

            //the aspect ratio is then used to determine maximum canvas size
            image.current.currentImageEventListener = handleResize(imageRatio);
            window.addEventListener(
              "resize",
              image.current.currentImageEventListener
            );
            image.current.currentImageEventListener({} as Event);

            //the aspect ratio is then used to determine the image width/height
            let imgHeight = maximumWidthOrHeightAtZDepth(0, camera.current);
            let imgWidth = imgHeight * imageRatio;

            image.current.mesh.geometry = new THREE.PlaneGeometry(
              imgWidth,
              imgHeight
            );

            camera.current.aspect = imageRatio;
            camera.current.updateProjectionMatrix();
          })
        });

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

    function handleResize(imageAspectRatio: number) {
      return function() {
        //determine the canvas width/height
        const { width, height } = determineWidthAndHeight(imageAspectRatio);

        //update renderer and aspect ratio.
        if (renderer.current) renderer.current.setSize(width, height);

        renderScene();
      };
    }
  }, [imageToLabel.imageUrl]);

  useLayoutEffect(() => {
    addModel(imageToLabel.modelUrl);

    function addModel(modelUrl: string) {
      //remove old model
      modelScene.current.remove(model.current.modelinstance);
      gizmo.current.removeEventListener("change", model.current.eventListener);
      //add new model
      if (modelUrl) {
        model.current.loader.load(modelUrl, (modelToAdd: THREE.Object3D) => {
          let scale = camera.current.position.z;
          modelToAdd.scale.set(scale, scale, scale);
          modelToAdd.position.z = 600;
          model.current.modelinstance = modelToAdd;
          gizmo.current.attach(modelToAdd);
          modelScene.current.add(gizmo.current);
          modelScene!.current.add(modelToAdd);
          model.current.eventListener = mapModelToState(
            modelToAdd,
            setState,
            camera.current
          );
          gizmo.current.addEventListener("change", model.current.eventListener);
        });
      }
    }
  }, [imageToLabel.modelUrl, setState]);

  function renderScene() {
    if (renderer.current && camera.current) {
      renderer.current.render(imageScene.current, camera.current);
      renderer.current.render(modelScene.current, camera.current);
    }
  }

  function determineWidthAndHeight(imageAspectRatio: number) {
    var viewportHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );

    const { top, width } = mount.current.getBoundingClientRect();
    var maxHeight = viewportHeight - top; //this is the height of the title
    let maxWidth = width;

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
      <FlexBox>
        <Mount ref={mount} active={imageToLabel.imageUrl !== ""} />
      </FlexBox>
    </div>
  );
};

//helpers & styles

const mapModelToState = (
  model: THREE.Object3D,
  setState: Dispatch<SetStateAction<IimageToBelabelled>>,
  camera: THREE.PerspectiveCamera
) => () => {
  setState(prevState => {
    const newState = {
      ...prevState,
      translateX: model.position.x,
      translateY: model.position.y,
      translateZ: 600,
      rotateX: radiansToDegrees(model.rotation.x),
      rotateY: radiansToDegrees(model.rotation.y),
      rotateZ: radiansToDegrees(model.rotation.z),
      scaleX: model.scale.x / camera.position.z,
      scaleY: model.scale.y / camera.position.z,
      scaleZ: model.scale.z / camera.position.z
    };
    return newState;
  });
};

const maximumWidthOrHeightAtZDepth = (
  depth: number,
  camera: THREE.PerspectiveCamera
) => {
  // compensate for cameras not positioned at z=0
  const cameraOffset = camera.position.z;
  if (depth < cameraOffset) depth -= cameraOffset;
  else depth += cameraOffset;

  // vertical fov in radians
  const vFOV = (camera.fov * Math.PI) / 180;

  // Math.abs to ensure the result is always positive
  return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
};

function formatCoordinate(coordinate: number | "-" | ""): number {
  return coordinate === "-" || coordinate === "" || coordinate === null
    ? 0
    : coordinate;
}

const radiansToDegrees = (rads: number | "-" | ""): number => {
  if (rads === "" || rads === "-" || rads === null) return rads as any;
  return (rads * 180) / Math.PI;
};

const degreesToRadians = (degs: number | "-" | ""): number => {
  if (degs === "" || degs === "-" || degs === null) return degs as any;
  return (degs / 180) * Math.PI;
};

//styles
const FlexBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

interface IMount {
  active: Boolean;
  ref: any;
}

const Mount = styled.div<IMount>`
  width: 95%;
  display: flex;
  justify-content: center;
  * {
    ${p => (p.active ? "border: 2px solid black" : "")};
  }
` as React.FunctionComponent<IMount>;

export default Vis;
