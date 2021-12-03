import {
  RawShaderMaterial,
  GLSL3
} from 'three'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import passThrough from '@/js/shaders/pass_through.vert'
import ToonFragment from './toon-fs.glsl'


export class ToonPass extends ShaderPass{

  constructor () {
    super(new RawShaderMaterial({
      vertexShader: passThrough,
      fragmentShader: ToonFragment,
      glslVersion: GLSL3
    }));
  }

}


