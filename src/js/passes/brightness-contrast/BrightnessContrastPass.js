import {
  RawShaderMaterial,
  GLSL3
} from 'three'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import passThrough from '@/js/shaders/pass_through.vert'
import BrightnessContrastFragment from './brightness-contrast-fs.glsl'

export class BrightnessContrastPass extends ShaderPass {

  constructor (brightness = 1, contrast = 1) {
    super(new RawShaderMaterial({
      uniforms: {
        brightness: {value: brightness},
        contrast: {value: contrast}
      },
      vertexShader: passThrough,
      fragmentShader: BrightnessContrastFragment,
      glslVersion: GLSL3
    }));
  }

  get brightness () {
    return this.material.uniforms.brightness.value;
  }

  set brightness (value) {
    this.material.uniforms.brightness.value = value;
  }

  get contrast () {
    return this.material.uniforms.contrast.value;
  }

  set contrast (value) {
    this.material.uniforms.contrast.value = value;
  }

}
