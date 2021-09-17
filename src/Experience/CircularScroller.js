import * as THREE from "three";
import Experience from "./Experience";
import vertexShader from "./shaders/circularScroller/vertex.glsl";
import fragmentShader from "./shaders/circularScroller/fragment.glsl";

export default class CircularScroller {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.scene = this.experience.scene;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    this.count = 5;
    this.orbitRadius = 1.5;
    this.speed = 0.0001;
    this.addTextures = false;

    if (this.debug) {
      this.debugFolder = this.debug.addFolder({
        title: "circularScroller",
      });

      this.debugFolder
        .addInput(this, "count", {
          label: "count",
          min: 0,
          max: 20,
          step: 1,
        })
        .on("change", () => {
          this.setItems();
        });
      this.debugFolder.addInput(this, "orbitRadius", {
        label: "orbitRadius",
        min: 0,
        max: 10,
        step: 0.001,
      });
      this.debugFolder.addInput(this, "speed", {
        label: "speed",
        min: 0,
        max: 0.01,
        step: 0.0001,
      });
      this.debugFolder
        .addInput(this, "addTextures", { label: "addTextures" })
        .on("change", () => {
          this.setItems();
        });
    }

    this.setGeometry();
    // this.setColors();
    this.setMaterial();
    this.setItems();
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
  }

  setColors() {}

  setMaterial() {
    this.material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
    });
  }

  setItems() {
    if (this.group) {
      this.scene.remove(this.group);
    }
    this.group = new THREE.Group();
    this.scene.add(this.group);
    this.items = [];

    for (let i = 0; i < this.count; i++) {
      const item = {};

      // material
      item.material = this.material.clone();
      this.addTextures &&
        (item.material.map = this.resources.items[`foxFrame${i % 8}`]);

      // mesh
      item.mesh = new THREE.Mesh(this.geometry, item.material);
      this.group.add(item.mesh);

      // initial position/rotation
      item.angle = ((2 * Math.PI) / this.count) * i;
      item.rotationX = item.angle - Math.PI / 2;

      // save
      this.items.push(item);
    }
  }

  update() {
    for (let _item of this.items) {
      _item.mesh.position.y =
        Math.cos(_item.angle - this.time.elapsed * this.speed) *
        this.orbitRadius;
      _item.mesh.position.z =
        Math.sin(_item.angle - this.time.elapsed * this.speed) *
        this.orbitRadius;
      _item.mesh.rotation.x = _item.rotationX - this.time.elapsed * this.speed;
    }
  }
}
