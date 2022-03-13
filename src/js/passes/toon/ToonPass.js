import {
  RawShaderMaterial,
  GLSL3,
  Vector2
} from 'three'
import { ShaderPass } from '@/js/utils/ShaderPass';
import passThrough from '@/js/shaders/pass_through.vert'
import ToonFragment from './toon-fs.glsl'


export class ToonPass extends ShaderPass{

  constructor () {
    super(new RawShaderMaterial({
      uniforms: {
        resolution: {value: new Vector2()},
        tDiffuse: {value: null}
      },
      vertexShader: passThrough,
      fragmentShader: ToonFragment,
      glslVersion: GLSL3
    }));
  }

  render( renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */ ) {

    this.material.uniforms.resolution.value.set(writeBuffer.width, writeBuffer.height)
    super.render(renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */ )

  }


}


