import {
  RawShaderMaterial,
  Color,
  GLSL3
} from 'three'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import passThrough from '@/js/shaders/pass_through.vert'
import SepiaFragment from './sepia-fs.glsl'

export class SepiaPass extends ShaderPass {

  constructor (amount = 0.5, color = new Color(1.2, 1.0, 0.8)) {
    super(new RawShaderMaterial({
      uniforms: {
        amount: {value: amount},
        color: {value: color}
      },
      vertexShader: passThrough,
      fragmentShader: SepiaFragment,
      glslVersion: GLSL3
    }));
  }

  get amount () {
    return this.material.uniforms.amount.value;
  }

  set amount (value) {
    this.material.uniforms.amount.value = value;
  }

  get color () {
    return this.material.uniforms.color.value;
  }

  set color (value) {
    this.material.uniforms.color.value = value;
  }

}
