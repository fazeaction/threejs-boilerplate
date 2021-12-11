import {
  RawShaderMaterial,
  GLSL3
} from 'three'
import { ShaderPass } from '@/js/utils/ShaderPass';
import passThrough from '@/js/shaders/pass_through.vert'
import InvertFragment from './invert-fs.glsl'

export class InvertPass extends ShaderPass {

  constructor () {
    super(new RawShaderMaterial({
      vertexShader: passThrough,
      fragmentShader: InvertFragment,
      glslVersion: GLSL3
    }));
  }

}
