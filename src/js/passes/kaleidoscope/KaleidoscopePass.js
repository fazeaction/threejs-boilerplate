import {
  RawShaderMaterial,
  GLSL3
} from 'three'
import { ShaderPass } from '@/js/utils/ShaderPass';
import passThrough from '@/js/shaders/pass_through.vert'
import KaleidoscopeFragment from './kaleidoscope-fs.glsl'

export class KaleidoscopePass extends ShaderPass {

  constructor (sides = 2, angle =0) {
    super(new RawShaderMaterial({
      uniforms: {
        sides: {value: sides},
        angle: {value: angle}
      },
      vertexShader: passThrough,
      fragmentShader: KaleidoscopeFragment,
      glslVersion: GLSL3
    }));
  }

  get sides () {
    return this.material.uniforms.sides.value;
  }

  set sides (value) {
    this.material.uniforms.sides.value = value;
  }

  get angle () {
    return this.material.uniforms.angle.value;
  }

  set angle (value) {
    this.material.uniforms.angle.value = value;
  }

}


