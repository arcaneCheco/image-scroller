import * as THREE from "three";
import Experience from "./Experience.js";
import Gradient from "./Gradient.js";

export default class World {
  constructor(_options) {
    this.experience = new Experience();
    this.config = this.experience.config;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.resources.on("groupEnd", (_group) => {
      if (_group.name === "base") {
        this.setGradient();
        this.setDummy();
      }
    });
  }

  setDummy() {
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({
        map: this.resources.items.lennaTexture,
        depthWrite: false,
        depthTest: false,
      })
    );
    this.scene.add(cube);
  }
  setGradient() {
    this.gradient = new Gradient();
  }

  resize() {}

  update() {
    if (this.gradient) {
      this.gradient.update();
    }
  }

  destroy() {}
}
