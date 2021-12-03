import {
  RawShaderMaterial,
  GLSL3
} from 'three'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import BoxBlurVertex from './box-blur-vs.glsl'
import BoxBlurFragment from './box-blur-fs.glsl'

export class BoxBlurPass extends ShaderPass {

  constructor (delta = new THREE.Vector2()) {
    super(new RawShaderMaterial({
      uniforms: {
        delta: {value: delta}
      },
      vertexShader: BoxBlurVertex,
      fragmentShader: BoxBlurFragment,
      glslVersion: GLSL3
    }));
  }

  get delta () {
    return this.material.uniforms.delta.value;
  }

  set delta (value) {
    this.material.uniforms.delta.value = value;
  }

}
