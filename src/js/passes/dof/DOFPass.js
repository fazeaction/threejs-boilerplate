import {
  RawShaderMaterial,
  GLSL3
} from 'three'
import { ShaderPass } from '@/js/utils/ShaderPass';
import passThrough from '@/js/shaders/pass_through.vert'
import DOFFragment from './dof-fs.glsl'

export class BrightnessContrastPass extends ShaderPass {

  constructor (focalDistance = 0.01, aperture = .005, tBias=null) {
    super(new RawShaderMaterial({
      uniforms: {
        focalDistance: {value: focalDistance},
        aperture: {value: aperture},
        tBias: {value: tBias}
      },
      vertexShader: passThrough,
      fragmentShader: DOFFragment,
      glslVersion: GLSL3
    }));
  }

  get brightness () {
    return this.material.uniforms.brightness.value;
  }

  set brightness (value) {
    this.material.uniforms.brightness.value = value;
  }

  get contrast () {
    return this.material.uniforms.contrast.value;
  }

  set contrast (value) {
    this.material.uniforms.contrast.value = value;
  }

}

/*module.exports = DOFPass;

DOFPass.prototype = Object.create(Pass.prototype);
DOFPass.prototype.constructor = DOFPass;

DOFPass.prototype.run = function(composer) {
  this.shader.uniforms.tBias.value = this.params.tBias;
  this.shader.uniforms.focalDistance.value = this.params.focalDistance;
  this.shader.uniforms.aperture.value = this.params.aperture;

  this.shader.uniforms.delta.value.set( 1, 0 );
  composer.pass(this.shader);

  this.shader.uniforms.delta.value.set( 0, 1 );
  composer.pass(this.shader);
};*/
