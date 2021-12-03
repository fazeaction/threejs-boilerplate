import {
  RawShaderMaterial,
  GLSL3
} from 'three'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import passThrough from '@/js/shaders/pass_through.vert'

export class GenericPass extends ShaderPass {

  constructor (fragment) {
    super(new RawShaderMaterial({
      vertexShader: passThrough,
      fragmentShader: fragment,
      glslVersion: GLSL3
    }));
  }
}
