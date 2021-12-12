import {
  Vector2,
  RawShaderMaterial,
  GLSL3
} from 'three'
import { ShaderPass } from '@/js/utils/ShaderPass';
import passThrough from '@/js/shaders/pass_through.vert'
import ZoomBlurFragment from './zoom-blur-fs.glsl'

const defaults = {
  uniforms: {
    center: {value: new Vector2(0.5, 0.5)},
    strength: {value: 1},
    resolution: {value: new Vector2()},
    tDiffuse: {value: null}
  }
}

export class ZoomBlurPass extends ShaderPass{

  constructor (options=defaults) {
    const uniforms = { ...defaults.uniforms, ...options.uniforms}
    super(new RawShaderMaterial({
      uniforms,
      vertexShader: passThrough,
      fragmentShader: ZoomBlurFragment,
      glslVersion: GLSL3
    }));
  }

  render( renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */ ) {
    this.material.uniforms.resolution.value.set(writeBuffer.width, writeBuffer.height)
    super.render(renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */ )

  }

}
