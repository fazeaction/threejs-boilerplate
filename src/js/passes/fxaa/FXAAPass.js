import {
  RawShaderMaterial,
  GLSL3
} from 'three'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import passThrough from '@/js/shaders/pass_through.vert'
import FXAAFragment from './fxaa-fs.glsl'

export class FXAAPass extends ShaderPass {

  constructor () {
    super(new RawShaderMaterial({
      vertexShader: passThrough,
      fragmentShader: FXAAFragment,
      glslVersion: GLSL3
    }));
  }
}
