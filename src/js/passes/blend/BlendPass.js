import {
  Vector2,
  RawShaderMaterial,
  GLSL3
} from 'three'
import { ShaderPass } from '@/js/utils/ShaderPass';
import passThrough from '@/js/shaders/pass_through.vert'
import BlendFragment from './blend-fs.glsl'

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

  constructor (mode=1, opacity=1, tInput2 =null, resolution2 = new Vector2(), sizeMode=1, aspectRatio = 1, aspectRatio2=1 ) {
    super(new RawShaderMaterial({
      uniforms:{
        mode: {value: mode},
        opacity: {value: opacity},
        tDiffuse: {value: null},
        tInput2: {value: tInput2},
        resolution: {value: new Vector2},
        resolution2: {value: resolution2},
        sizeMode: {value: sizeMode},
        aspectRatio: {value: aspectRatio},
        aspectRatio2: {value: aspectRatio2}
      },
      vertexShader: passThrough,
      fragmentShader: BlendFragment,
      glslVersion: GLSL3
    }));
  }

  get mode() {
    return this.material.uniforms.mode.value;
  }

  set mode(value) {
    this.material.uniforms.mode.value = value;
  }

  get opacity() {
    return this.material.uniforms.opacity.value;
  }

  set opacity(value) {
    this.material.uniforms.opacity.value = value;
  }

  get tDiffuse() {
    return this.material.uniforms.tDiffuse.value;
  }

  set tDiffuse(value) {
    this.material.uniforms.tDiffuse.value = value;
  }

  get tInput2() {
    return this.material.uniforms.tInput2.value;
  }

  set tInput2(value) {
    this.material.uniforms.tInput2.value = value;
  }

  get resolution2() {
    return this.material.uniforms.resolution2.value;
  }

  set resolution2(value) {
    this.material.uniforms.resolution2.value = value;
  }

  get sizeMode() {
    return this.material.uniforms.sizeMode.value;
  }

  set sizeMode(value) {
    this.material.uniforms.sizeMode.value = value;
  }

  get aspectRatio() {
    return this.material.uniforms.aspectRatio.value;
  }

  set aspectRatio(value) {
    this.material.uniforms.aspectRatio.value = value;
  }

  get aspectRatio2() {
    return this.material.uniforms.aspectRatio2.value;
  }

  set aspectRatio2(value) {
    this.material.uniforms.aspectRatio2.value = value;
  }

  render( renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */ ) {

    this.material.uniforms.aspectRatio.value = (writeBuffer.width / writeBuffer.height)
    this.material.uniforms.aspectRatio2.value = (writeBuffer.width / writeBuffer.height)
    super.render(renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */ )

  }

}
