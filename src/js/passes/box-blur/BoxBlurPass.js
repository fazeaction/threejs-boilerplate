import {
  RawShaderMaterial,
  Vector2,
  GLSL3
} from 'three'
import { ShaderPass } from '@/js/utils/ShaderPass';
import BoxBlurVertex from './box-blur-vs.glsl'
import BoxBlurFragment from './box-blur-fs.glsl'

const defaults = {
  uniforms: {
    delta: {value: new Vector2()},
    resolution:{value: new Vector2()},
    tDiffuse:{value: null}
  }
}

export class BoxBlurPass extends ShaderPass {

  constructor (options=defaults ) {
    const uniforms = { ...defaults.uniforms, ...options.uniforms}
    super(new RawShaderMaterial({
      uniforms,
      vertexShader: BoxBlurVertex,
      fragmentShader: BoxBlurFragment,
      glslVersion: GLSL3
    }));
  }

  render( renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */ ) {

    this.material.uniforms.resolution.value.set(writeBuffer.width, writeBuffer.height)
    super.render(renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */ )

  }

}
