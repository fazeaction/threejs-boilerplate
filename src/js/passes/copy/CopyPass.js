import {
  RawShaderMaterial,
  GLSL3, Vector2
} from 'three'
import { ShaderPass } from '@/js/utils/ShaderPass';
import passThrough from '@/js/shaders/pass_through.vert'
import CopyFragment from './copy-fs.glsl'

export class CopyPass extends ShaderPass {

  constructor () {
    super(new RawShaderMaterial({
      uniforms:{
        tDiffuse: {value: null}
      },
      vertexShader: passThrough,
      fragmentShader: CopyFragment,
      glslVersion: GLSL3
    }));
  }

}
