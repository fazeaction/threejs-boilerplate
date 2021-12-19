import {
  RawShaderMaterial,
  GLSL3
} from 'three'
import { ShaderPass } from '@/js/utils/ShaderPass';
import passThrough from '@/js/shaders/pass_through.vert'
import SymetricFragment from './symetric-fs.glsl'

export class SymetricPass extends ShaderPass{

  constructor (xReverse=1.0, yReverse=1.1, xMirror =0.004, yMirror = false, mirrorCenter=0, angle = 0 ) {
    super(new RawShaderMaterial({
      uniforms:{
        xReverse: {value: xReverse},
        yReverse: {value: yReverse},
        xMirror: {value: xMirror},
        yMirror: {value: yMirror},
        mirrorCenter: {value: mirrorCenter},
        angle: {value: angle}
      },
      vertexShader: passThrough,
      fragmentShader: SymetricFragment,
      glslVersion: GLSL3
    }));
  }

  get xReverse() {
    return this.material.uniforms.xReverse.value;
  }

  set xReverse(value) {
    this.material.uniforms.xReverse.value = value;
  }

  get yReverse() {
    return this.material.uniforms.yReverse.value;
  }

  set yReverse(value) {
    this.material.uniforms.yReverse.value = value;
  }

  get xMirror() {
    return this.material.uniforms.xMirror.value;
  }

  set xMirror(value) {
    this.material.uniforms.xMirror.value = value;
  }

  get yMirror() {
    return this.material.uniforms.yMirror.value;
  }

  set yMirror(value) {
    this.material.uniforms.yMirror.value = value;
  }

  get mirrorCenter() {
    return this.material.uniforms.mirrorCenter.value;
  }

  set mirrorCenter(value) {
    this.material.uniforms.mirrorCenter.value = value;
  }

  get angle() {
    return this.material.uniforms.angle.value;
  }

  set angle(value) {
    this.material.uniforms.angle.value = value;
  }

}
