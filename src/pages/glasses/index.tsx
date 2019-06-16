import React, { Component } from "react";
import * as THREE from "three";

import styled from "styled-components";

class ThreeD extends Component<any, any> {
  canvas: React.RefObject<HTMLCanvasElement>;
  camera?: THREE.PerspectiveCamera;
  renderer?: THREE.WebGLRenderer;
  scene?: THREE.Scene;
  constructor(props: any) {
    super(props);
    this.canvas = React.createRef();
    this.animate = this.animate.bind(this);
    this.state = {};
  }

  componentDidMount() {
    console.log(this.state);

    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 1, 1000);

    this.camera.position.set(0, 20, 100);
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas.current!,
      antialias: true
    });
    this.renderer.sortObjects = false;
    this.renderer.setPixelRatio(4);
    this.renderer.setClearColor(0xffffff);
    let json_path =
      "https://s3-us-west-1.amazonaws.com/glassesobjects/glasses/object_json_files/3Dviewer.json";
    let loader = new THREE.ObjectLoader();
    loader.load(json_path, this.addObject);

    this.renderer.render(this.scene, this.camera);
    this.animate();
  }

  addObject = (object: THREE.Object3D) => {
    const maxDistance = 100;
    let bbox = new THREE.Box3().setFromObject(object);

    let scale = (0.12 * this.state.canvasWidth) / maxDistance;
    object.scale.set(scale, scale, scale);
    this.scene!.add(object);
  };
  // This method gets called recursively with requestAnimiationFrame
  animate() {
    this.renderer!.render(this.scene!, this.camera!);
    requestAnimationFrame(this.animate);
  }

  render() {
    return <Canvas ref={this.canvas} />;
  }
}

const Canvas = styled.canvas`
  width: 800px;
  height: 800px;
`;

export default ThreeD;
