import {
  RawShaderMaterial,
  GLSL3, Vector2
} from 'three'
import { ShaderPass } from '@/js/utils/ShaderPass';
import passThrough from '@/js/shaders/pass_through.vert'
import VignetteFragment from './vignette-fs.glsl'

const defaults = {
  uniforms: {
    boost: {value: 1},
    reduction: {value: 1},
    tDiffuse: {value: null}
  }
}

export class VignettePass extends ShaderPass{

  constructor (options=defaults) {
    const uniforms = { ...defaults.uniforms, ...options.uniforms}
    super(new RawShaderMaterial({
      uniforms,
      vertexShader: passThrough,
      fragmentShader: VignetteFragment,
      glslVersion: GLSL3
    }));
  }

}
