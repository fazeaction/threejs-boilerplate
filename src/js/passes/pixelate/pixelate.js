import {
  RawShaderMaterial,
  GLSL3
} from 'three'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import passThrough from '@/js/shaders/pass_through.vert'
import PixelateFragment from './pixelate-fs.glsl'

export class PixelatePass extends ShaderPass {

  constructor (amount = 320) {
    super(new RawShaderMaterial({
      uniforms: {
        amount: {value: amount}
      },
      vertexShader: passThrough,
      fragmentShader: PixelateFragment,
      glslVersion: GLSL3
    }));
  }

  get amount () {
    return this.material.uniforms.amount.value;
  }

  set amount (value) {
    this.material.uniforms.amount.value = value;
  }

}
