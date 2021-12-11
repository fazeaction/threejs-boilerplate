import {
  RawShaderMaterial,
  Vector2,
  GLSL3
} from 'three'
import { ShaderPass } from '@/js/utils/ShaderPass';
import BoxBlurVertex from './box-blur-vs.glsl'
import BoxBlurFragment from './box-blur-fs.glsl'

export class BoxBlurPass extends ShaderPass {

  constructor (delta = new Vector2()) {
    super(new RawShaderMaterial({
      uniforms: {
        delta: {value: delta},
        resolution:{value: new Vector2()},
        tDiffuse:{value: null}
      },
      vertexShader: BoxBlurVertex,
      fragmentShader: BoxBlurFragment,
      glslVersion: GLSL3
    }));
  }

  get delta () {
    return this.material.uniforms.delta.value;
  }

  set delta (value) {
    this.material.uniforms.delta.value = value;
  }

  get resolution () {
    return this.material.uniforms.resolution.value;
  }

  set resolution (value) {
    this.material.uniforms.resolution.value = value;
  }

  render( renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */ ) {

    this.material.uniforms.resolution.value.set(writeBuffer.width, writeBuffer.height)
    super.render(renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */ )

  }

}
