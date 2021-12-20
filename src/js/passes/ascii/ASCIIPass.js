import {
  Vector2,
  RawShaderMaterial,
  GLSL3,
  TextureLoader
} from 'three'
import { ShaderPass } from '@/js/utils/ShaderPass';
import passThrough from '@/js/shaders/pass_through.vert'
import ASCIIFragment from './ascii-fs.glsl'

export class ASCIIPass extends ShaderPass {

  constructor () {
    super(new RawShaderMaterial({
      uniforms:{
        resolution: {value: new Vector2()},
        tDiffuse: {value: null},
        tAscii: {value: new TextureLoader().load( './static/textures/8x16_ascii_font_sorted.gif' )}
      },
      vertexShader: passThrough,
      fragmentShader: ASCIIFragment,
      glslVersion: GLSL3
    }));
  }

  render( renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */ ) {

    this.material.uniforms.resolution.value.set(writeBuffer.width, writeBuffer.height)
    super.render(renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */ )

  }

}
