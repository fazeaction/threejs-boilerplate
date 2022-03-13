import {
  RawShaderMaterial,
  Vector2,
  GLSL3
} from 'three'
import { ShaderPass } from '@/js/utils/ShaderPass';
import passThrough from '@/js/shaders/pass_through.vert'
import RGBSplitFragment from './rgbsplit-fs.glsl'

export class RGBSplitPass extends ShaderPass {

  constructor (delta = new Vector2()) {
    super(new RawShaderMaterial({
      uniforms: {
        delta: {value: delta}
      },
      vertexShader: passThrough,
      fragmentShader: RGBSplitFragment,
      glslVersion: GLSL3
    }));
  }

  get delta () {
    return this.material.uniforms.delta.value;
  }

  set delta (value) {
    this.material.uniforms.delta.value = value;
  }

}
