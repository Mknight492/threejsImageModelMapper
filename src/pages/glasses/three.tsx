import React, { useLayoutEffect } from "react";

const Test = () => <div />;
export default Test;

// import * as THREE from "three";

// import styled from "styled-components";

// const ThreeD: React.FunctionComponent = () => {

//   let camera: THREE.PerspectiveCamera;
//   let renderer: ?THREE.WebGLRenderer;
//   let scene : ?THREE.Scene;
//   const canvas = React.useRef<React.MutableRefObject<HTMLCanvasElement>>();

// useLayoutEffect(()=>{
//     const aspect = window.innerWidth / window.innerHeight;
//     camera = new THREE.PerspectiveCamera(45, aspect, 1, 1000);
//     camera.position.set(0, 20, 100);
//     scene = new THREE.Scene();
//     if(canvas && canvas.current)
//     renderer = new THREE.WebGLRenderer({
//       canvas: canvas.current,
//       antialias: true
//     });
//     this.renderer.sortObjects = false;
//     this.renderer.setPixelRatio(4);
//     this.renderer.setClearColor(0xffffff);
//     let json_path =
//       "https://s3-us-west-1.amazonaws.com/glassesobjects/glasses/object_json_files/3Dviewer.json";
//     let loader = new THREE.ObjectLoader();
//     loader.load(json_path, this.addObject);

//     this.renderer.render(this.scene, this.camera);
//     this.animate();
// },[])

//   componentDidMount() {
//     console.log(this.state);

//   }

//   addObject = (object: THREE.Object3D) => {
//     const maxDistance = 100;
//     let bbox = new THREE.Box3().setFromObject(object);

//     let scale = (0.12 * this.state.canvasWidth) / maxDistance;
//     object.scale.set(scale, scale, scale);
//     this.scene!.add(object);
//   };
//   // This method gets called recursively with requestAnimiationFrame
//   animate() {
//     this.renderer!.render(this.scene!, this.camera!);
//     requestAnimationFrame(this.animate);
//   }

//   render() {
//     return <Canvas ref={canvas} />;
//   }
// }

// const Canvas = styled.canvas`
//   width: 800px;
//   height: 800px;
// `;

// export default ThreeD;
