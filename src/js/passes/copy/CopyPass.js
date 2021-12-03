import {
  RawShaderMaterial,
  GLSL3
} from 'three'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import passThrough from '@/js/shaders/pass_through.vert'
import CopyFragment from './copy-fs.glsl'

export class CopyPass extends ShaderPass {

  constructor () {
    super(new RawShaderMaterial({
      vertexShader: passThrough,
      fragmentShader: CopyFragment,
      glslVersion: GLSL3
    }));
  }

}
