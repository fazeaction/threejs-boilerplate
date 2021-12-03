import {
  RawShaderMaterial,
  GLSL3
} from 'three'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import passThrough from '@/js/shaders/pass_through.vert'
import BlendFragment from './blend-fs.glsl'

export class BlendPass extends ShaderPass{

  constructor (mode=1, opacity=1, tInput2 =null, resolution2 = new THREE.Vector2(), sizeMode=1, aspectRatio = 1, aspectRatio2=1 ) {
    super(new RawShaderMaterial({
      uniforms:{
        mode: {value: mode},
        opacity: {value: opacity},
        tInput2: {value: tInput2},
        resolution2: {value: resolution2},
        sizeMode: {value: sizeMode},
        aspectRatio: {value: aspectRatio},
        aspectRatio2: {value: aspectRatio2}
      },
      vertexShader: passThrough,
      fragmentShader: BlendFragment,
      glslVersion: GLSL3
    }));
  }

  get mode() {
    return this.material.uniforms.mode.value;
  }

  set mode(value) {
    this.material.uniforms.mode.value = value;
  }

  get opacity() {
    return this.material.uniforms.opacity.value;
  }

  set opacity(value) {
    this.material.uniforms.opacity.value = value;
  }

  get tInput2() {
    return this.material.uniforms.tInput2.value;
  }

  set tInput2(value) {
    this.material.uniforms.tInput2.value = value;
  }

  get resolution2() {
    return this.material.uniforms.resolution2.value;
  }

  set resolution2(value) {
    this.material.uniforms.resolution2.value = value;
  }

  get sizeMode() {
    return this.material.uniforms.sizeMode.value;
  }

  set sizeMode(value) {
    this.material.uniforms.sizeMode.value = value;
  }

  get aspectRatio() {
    return this.material.uniforms.aspectRatio.value;
  }

  set aspectRatio(value) {
    this.material.uniforms.aspectRatio.value = value;
  }

  get aspectRatio2() {
    return this.material.uniforms.aspectRatio2.value;
  }

  set aspectRatio2(value) {
    this.material.uniforms.aspectRatio2.value = value;
  }

}
