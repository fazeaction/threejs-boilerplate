'use strict';

var THREE = require('three');
var glslify = require('glslify');

var Pass = require('../../Pass');
var vertex = glslify('../../shaders/vertex/basic.glsl');
var fragment = glslify('./sepia-fs.glsl');

function SepiaPass(options) {
  Pass.call(this);
  this.setShader(vertex, fragment);

  options = options || {};

  this.params.amount = options.amount || 0.5;
  this.params.color = options.color || new THREE.Color(1.2, 1.0, 0.8);
}

module.exports = SepiaPass;

SepiaPass.prototype = Object.create(Pass.prototype);
SepiaPass.prototype.constructor = SepiaPass;

SepiaPass.prototype.run = function(composer) {
  this.shader.uniforms.amount.value = this.params.amount;
  this.shader.uniforms.color.value = this.params.color;

  composer.pass(this.shader);
};
