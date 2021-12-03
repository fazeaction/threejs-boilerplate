import {
  Vector2,
  RawShaderMaterial,
  GLSL3
} from 'three'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import passThrough from '@/js/shaders/pass_through.vert'
import ZoomBlurFragment from './zoom-blur-fs.glsl'

export class ZoomBlurPass extends ShaderPass{

  constructor (center=new Vector2(0.5, 0.5), strength=1) {
    super(new RawShaderMaterial({
      uniforms:{
        center: {value: center},
        strength: {value: strength}
      },
      vertexShader: passThrough,
      fragmentShader: ZoomBlurFragment,
      glslVersion: GLSL3
    }));
  }

  get center() {
    return this.material.uniforms.center.value;
  }

  set center(value) {
    this.material.uniforms.center.value = value;
  }
  get strength() {
    return this.material.uniforms.strength.value;
  }

  set strength(value) {
    this.material.uniforms.strength.value = value;
  }

}
