import {
  Vector2,
  RawShaderMaterial,
  GLSL3
} from 'three'
import { ShaderPass } from '@/js/utils/ShaderPass';
import passThrough from '@/js/shaders/pass_through.vert'
import BlendFragment from './blend-fs.glsl'

const defaults = {
  uniforms: {
    mode: {value: 1},
    opacity: {value: 1},
    tDiffuse: {value: null},
    tInput2: {value: null},
    resolution2: {value: new Vector2()},
    sizeMode: {value:1},
    aspectRatio: {value: 1},
    aspectRatio2: {value: 1}
  }
}

export class BlendPass extends ShaderPass{

  static blendMode = {
    Normal: 1,
    Dissolve: 2, // UNAVAILABLE
    Darken: 3,
    Multiply: 4,
    ColorBurn: 5,
    LinearBurn: 6,
    DarkerColor: 7, // UNAVAILABLE
    Lighten: 8,
    Screen: 9,
    ColorDodge: 10,
    LinearDodge: 11,
    LighterColor: 12, // UNAVAILABLE
    Overlay: 13,
    SoftLight: 14,
    HardLight: 15,
    VividLight: 16, // UNAVAILABLE
    LinearLight: 17,
    PinLight: 18, // UNAVAILABLE
    HardMix: 19, // UNAVAILABLE
    Difference: 20,
    Exclusion: 21,
    Substract: 22, // UNAVAILABLE
    Divide: 23 // UNAVAILABLE
  };

  constructor (options=defaults ) {
    const uniforms = { ...defaults.uniforms, ...options.uniforms}
    super(new RawShaderMaterial({
      uniforms,
      vertexShader: passThrough,
      fragmentShader: BlendFragment,
      glslVersion: GLSL3
    }));
  }

  render( renderer, writeBuffer, readBuffer ) {

    this.material.uniforms.aspectRatio.value = (writeBuffer.width / writeBuffer.height)
    this.material.uniforms.aspectRatio2.value = (writeBuffer.width / writeBuffer.height)
    super.render(renderer, writeBuffer, readBuffer )

  }

  directRender( renderer, writeBuffer ) {

    this.material.uniforms.aspectRatio.value = (writeBuffer.width / writeBuffer.height)
    this.material.uniforms.aspectRatio2.value = (writeBuffer.width / writeBuffer.height)
    super.directRender( renderer, writeBuffer )

  }

}
