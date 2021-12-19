import {
  RawShaderMaterial,
  GLSL3
} from 'three'
import { ShaderPass } from '@/js/utils/ShaderPass';
import passThrough from '@/js/shaders/pass_through.vert'
import ToonFragment from './toon-fs.glsl'


export class ToonPass extends ShaderPass{

  constructor () {
    super(new RawShaderMaterial({
      uniforms: {
        tDiffuse: {value: null}
      },
      vertexShader: passThrough,
      fragmentShader: ToonFragment,
      glslVersion: GLSL3
    }));
  }

}


