import {
  RawShaderMaterial,
  GLSL3
} from 'three'
import { ShaderPass } from '@/js/utils/ShaderPass';
import passThrough from '@/js/shaders/pass_through.vert'
import TiltShiftFragment from './tiltshift-fs.glsl'

export class TiltShiftPass extends ShaderPass{

  constructor (bluramount=1.0, center=1.1, stepSize =0.004) {
    super(new RawShaderMaterial({
      uniforms:{
        bluramount: {value: bluramount},
        center: {value: center},
        stepSize: {value: stepSize},
      },
      vertexShader: passThrough,
      fragmentShader: TiltShiftFragment,
      glslVersion: GLSL3
    }));
  }

  get bluramount() {
    return this.material.uniforms.bluramount.value;
  }

  set bluramount(value) {
    this.material.uniforms.bluramount.value = value;
  }

  get center() {
    return this.material.uniforms.center.value;
  }

  set center(value) {
    this.material.uniforms.center.value = value;
  }

  get stepSize() {
    return this.material.uniforms.stepSize.value;
  }

  set stepSize(value) {
    this.material.uniforms.stepSize.value = value;
  }

}
