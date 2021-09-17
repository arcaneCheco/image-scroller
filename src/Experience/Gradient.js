import * as THREE from "three";
import Experience from "./Experience";
import vertexShader from "./shaders/gradient/vertex.glsl";
import fragmentShader from "./shaders/gradient/fragment.glsl";

export default class Gradient {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.gradientScene;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    if (this.debug) {
      this.debugFolder = this.debug.addFolder({
        title: "gradient",
      });
    }

    this.setGeometry();
    this.setColors();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(2, 2, 1, 1);
  }

  setColors() {
    this.colors = {};

    this.colors.start = {};
    this.colors.start.value = "#ff0000";
    this.colors.start.instance = new THREE.Color(this.colors.start.value);
    this.colors.start.saturation = 32;
    this.colors.start.lightness = 38;

    this.colors.end = {};
    this.colors.end.value = "#161626";
    this.colors.end.instance = new THREE.Color(this.colors.end.value);

    if (this.debug) {
      this.debugFolder
        .addInput(this.colors.end, "value", {
          view: "color",
          label: "uEndColor",
        })
        .on("change", () => {
          this.colors.end.instance.set(this.colors.end.value);
        });

      this.debugFolder.addInput(this.colors.start, "saturation", {
        label: "saturation",
        min: 0,
        max: 100,
        step: 1,
      });
      this.debugFolder.addInput(this.colors.start, "lightness", {
        label: "lightness",
        min: 0,
        max: 100,
        step: 1,
      });
    }
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uDecay: { value: 1 },
        uStartColor: { value: this.colors.start.instance },
        uEndColor: { value: this.colors.end.instance },
      },
      depthWrite: false,
    });

    if (this.debug) {
      this.debugFolder.addInput(this.material.uniforms.uDecay, "value", {
        label: "uDecay",
        min: 0,
        max: 5,
        step: 0.001,
      });
    }
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  update() {
    this.colors.start.value = `hsl(${this.time.elapsed * 0.01}, ${
      this.colors.start.saturation
    }%, ${this.colors.start.lightness}%)`;
    this.colors.start.instance.set(this.colors.start.value);
  }
}
