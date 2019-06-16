import React, { useRef, useEffect, useLayoutEffect, useState } from "react";
import * as THREE from "three";

//helpers
import { SizeMe } from "react-sizeme";

const Vis = () => {
  const mount = useRef<any>(null);
  const [isAnimating, setAnimating] = useState(true);
  const controls = useRef<any>(null);

  const imageAspectRatio = 3 / 4;

  useLayoutEffect(() => {
    let width = mount.current.getBoundingClientRect().width;
    let height = width * imageAspectRatio;
    let frameId: any;

    var fieldOfView = 100;
    var nearPlane = 0.1;
    var farPlane = 1000;

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

    var imgHeight = visibleHeightAtZDepth(0, camera); // visible height
    var imgWidth = imgHeight * camera.aspect; // visible width

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.autoClear = false;

    let glasses: THREE.Object3D;
    const addObject = (objectToAdd: THREE.Object3D) => {
      //   let box = new THREE.Box3().setFromObject(objectToAdd);
      let scale = 40;

      objectToAdd.scale.set(scale, scale, scale);
      objectToAdd.position.z = modelZ;
      //   objectToAdd.rotation.y = 1;
      //   objectToAdd.rotation.x = 1;
      scene!.add(objectToAdd);
      glasses = objectToAdd;
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

    // deterime what is visable fgrom the camera and make the image equal to that size

    console.log(imgWidth); //
    var imageGeometry = new THREE.PlaneGeometry(imgWidth, imgHeight);

    // combine our image geometry and material into a mesh
    var mesh = new THREE.Mesh(imageGeometry, imageMaterial);

    // set the position of the image mesh in the x,y,z dimensions
    mesh.position.set(0, 0, imageZ);

    // add the image to the scene
    scene2.add(mesh);

    var amb = new THREE.AmbientLight(0xffffff, 1);
    scene2.add(amb);

    renderer.setSize(width, height);

    const renderScene = () => {
      renderer.render(scene, camera);
      renderer.render(scene2, camera);
    };

    const handleResize = () => {
      width = mount.current.getBoundingClientRect().width;
      height = width * imageAspectRatio;
      renderer.setSize(width, height);
      camera.updateProjectionMatrix();

      renderScene();
    };

    const animate = () => {
      if (glasses && glasses.rotation && glasses.rotation.y !== null) {
        // glasses.rotation.x += 0.03;
        // glasses.rotation.z += 0.02;
        // glasses.rotation.y += 0.01;
      }

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

    mount.current.appendChild(renderer.domElement);
    window.addEventListener("resize", handleResize);
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

  useLayoutEffect(() => {
    if (isAnimating) {
      controls.current.start();
    } else {
      controls.current.stop();
    }
  }, [isAnimating]);

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
