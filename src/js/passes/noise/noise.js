import {
  RawShaderMaterial,
  GLSL3
} from 'three'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import passThrough from '@/js/shaders/pass_through.vert'
import NoiseFragment from './noise-fs.glsl'

export class BrightnessContrastPass extends ShaderPass {

  constructor (amount = 0.1, speed= 0) {
    super(new RawShaderMaterial({
      uniforms: {
        amount: {value: amount},
        speed: {value: speed}
      },
      vertexShader: passThrough,
      fragmentShader: NoiseFragment,
      glslVersion: GLSL3
    }));
  }

  get amount () {
    return this.material.uniforms.amount.value;
  }

  set amount (value) {
    this.material.uniforms.amount.value = value;
  }

  get speed () {
    return this.material.uniforms.speed.value;
  }

  set speed (value) {
    this.material.uniforms.speed.value = value;
  }

}
