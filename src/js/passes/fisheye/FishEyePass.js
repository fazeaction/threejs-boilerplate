import {
  RawShaderMaterial,
  GLSL3
} from 'three'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import passThrough from '@/js/shaders/pass_through.vert'
import FishEyeFragment from './fisheye-fs.glsl'

export class BrightnessContrastPass extends ShaderPass {

  constructor (power = 1.2) {
    super(new RawShaderMaterial({
      uniforms: {
        power: {value: power}
      },
      vertexShader: passThrough,
      fragmentShader: FishEyeFragment,
      glslVersion: GLSL3
    }));
  }

  get power () {
    return this.material.uniforms.power.value;
  }

  set power (value) {
    this.material.uniforms.power.value = value;
  }

}
