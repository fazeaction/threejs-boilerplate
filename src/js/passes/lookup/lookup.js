import {
  RawShaderMaterial,
  Texture,
  GLSL3
} from 'three'
import { ShaderPass } from '@/js/utils/ShaderPass';
import passThrough from '@/js/shaders/pass_through.vert'
import LookupFragment from './lookup-fs.glsl'

export class KaleidoscopePass extends ShaderPass {

  constructor (uLookup = new Texture(512,512)) {
    super(new RawShaderMaterial({
      uniforms: {
        uLookup: {value: uLookup}
      },
      vertexShader: passThrough,
      fragmentShader: LookupFragment,
      glslVersion: GLSL3
    }));
  }

  get uLookup () {
    return this.material.uniforms.uLookup.value;
  }

  set uLookup (value) {
    this.material.uniforms.uLookup.value = value;
  }

}
