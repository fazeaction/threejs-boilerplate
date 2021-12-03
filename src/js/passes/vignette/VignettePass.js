import {
  Vector2,
  RawShaderMaterial,
  GLSL3
} from 'three'
// import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { ShaderPass } from '@/js/utils/ShaderPass.js';
import passThrough from '@/js/shaders/pass_through.vert'
import VignetteFragment from './vignette-fs.glsl'

export class VignettePass extends ShaderPass{

  constructor (boost=1, reduction=1) {
    super(new RawShaderMaterial({
      uniforms:{
        boost: {value: boost},
        reduction: {value: reduction}
      },
      vertexShader: passThrough,
      fragmentShader: VignetteFragment,
      glslVersion: GLSL3
    }));
  }
  get boost() {
    return this.material.uniforms.boost.value;
  }

  set boost(value) {
    this.material.uniforms.boost.value = value;
  }
  get reduction() {
    return this.material.uniforms.reduction.value;
  }

  set reduction(value) {
    this.material.uniforms.reduction.value = value;
  }

}
