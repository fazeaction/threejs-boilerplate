'use strict';

var glslify = require('glslify');
var Pass = require('../../Pass');
var vertex = glslify('../../shaders/vertex/basic.glsl');
var fragment = glslify('./kaleidoscope-fs.glsl');

function KaleidoscopePass(options) {

  Pass.call(this);
  this.setShader(vertex, fragment);

  options = options || {};

  this.params.sides =  options.sides || 2;
  this.params.angle =  options.angle || 0;

  this.shader.uniforms.tInput.value = null;

}

module.exports = KaleidoscopePass;

KaleidoscopePass.prototype = Object.create(Pass.prototype);
KaleidoscopePass.prototype.constructor = KaleidoscopePass;

KaleidoscopePass.prototype.run = function(composer) {

  this.shader.uniforms.sides.value = this.params.sides;
  this.shader.uniforms.angle.value = this.params.angle;
  composer.pass(this.shader);

};
