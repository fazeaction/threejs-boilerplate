import {
  Vector2,
  RawShaderMaterial,
  GLSL3
} from 'three'
import { ShaderPass } from '@/js/utils/ShaderPass';
import passThrough from '@/js/shaders/pass_through.vert'
import ZoomBlurFragment from './zoom-blur-fs.glsl'

export class ZoomBlurPass extends ShaderPass{

  constructor (center=new Vector2(0.5, 0.5), strength=1) {
    super(new RawShaderMaterial({
      uniforms:{
        center: {value: center},
        strength: {value: strength},
        resolution: {value: new Vector2()},
        tDiffuse: {value: null}
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

  render( renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */ ) {
    console.log(writeBuffer.width, writeBuffer.height);
    this.material.uniforms.resolution.value.set(writeBuffer.width, writeBuffer.height)
    super.render(renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */ )

  }

}
