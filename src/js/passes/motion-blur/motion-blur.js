import {
  RawShaderMaterial,
  Matrix4,
  Texture,
  GLSL3
} from 'three'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import passThrough from '@/js/shaders/pass_through.vert'
import MotionBlurFragment from './motion-blur-fs.glsl'

export class MotionBlur extends ShaderPass {

  constructor (velocityFactor = 2, tDepth =new Texture(1,1), viewProjectionInverseMatrix=  new Matrix4(), previousViewProjectionMatrix = new Matrix4()  ) {
    super(new RawShaderMaterial({
      uniforms: {
        velocityFactor: {value: velocityFactor},
        tDepth: {value: tDepth},
        viewProjectionInverseMatrix: {value: viewProjectionInverseMatrix},
        previousViewProjectionMatrix: {value: previousViewProjectionMatrix}
      },
      vertexShader: passThrough,
      fragmentShader: MotionBlurFragment,
      glslVersion: GLSL3
    }));
  }

  get velocityFactor () {
    return this.material.uniforms.velocityFactor.value;
  }

  set velocityFactor (value) {
    this.material.uniforms.velocityFactor.value = value;
  }

  get tDepth () {
    return this.material.uniforms.tDepth.value;
  }

  set tDepth (value) {
    this.material.uniforms.tDepth.value = value;
  }

  get viewProjectionInverseMatrix () {
    return this.material.uniforms.viewProjectionInverseMatrix.value;
  }

  set viewProjectionInverseMatrix (value) {
    this.material.uniforms.viewProjectionInverseMatrix.value = value;
  }

  get previousViewProjectionMatrix () {
    return this.material.uniforms.previousViewProjectionMatrix.value;
  }

  set previousViewProjectionMatrix (value) {
    this.material.uniforms.previousViewProjectionMatrix.value = value;
  }

}
