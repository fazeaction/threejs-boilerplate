/*'use strict';

var glslify = require('glslify');
var THREE = require('three');
var Pass = require('../../Pass');
var vertex = glslify('../../shaders/vertex/basic.glsl');
var fragment = glslify('./zoom-blur-fs.glsl');*/

import {
  Vector2,
  RawShaderMaterial,
  GLSL3
} from 'three'
// import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { ShaderPass } from '@/js/utils/ShaderPass.js';
import passThrough from '@/js/shaders/pass_through.vert'
import VignetteFragment from './zoom-blur-fs.glsl'

export class ZoomBlurPass extends ShaderPass{

  constructor (center=new Vector2(0.5, 0.5), strength=1) {
    super(new RawShaderMaterial({
      uniforms:{
        center: {value: center},
        strength: {value: strength}
      },
      vertexShader: passThrough,
      fragmentShader: VignetteFragment,
      glslVersion: GLSL3
    }));
  }

  get center() {
    return this.material.uniforms.center.value;
  }

  set center(value) {
    this.material.uniforms.center.value = value;
  }
  get strength() {
    return this.material.uniforms.strength.value;
  }

  set strength(value) {
    this.material.uniforms.strength.value = value;
  }

}


/*function ZoomBlurPass(options) {
  Pass.call(this);

  options = options || {};

  this.setShader(vertex, fragment);

  this.params.center = new THREE.Vector2(options.centerX || 0.5, options.centerY || 0.5);
  this.params.strength = options.strength || 0.1;
}

module.exports = ZoomBlurPass;

ZoomBlurPass.prototype = Object.create(Pass.prototype);
ZoomBlurPass.prototype.constructor = ZoomBlurPass;

ZoomBlurPass.prototype.run = function(composer) {
  this.shader.uniforms.center.value.set(composer.width * this.params.center.x, composer.height * this.params.center.y);
  this.shader.uniforms.strength.value = this.params.strength;
  composer.pass(this.shader);
};*/
