'use strict';

var THREE = require('three');
var glslify = require('glslify');
var Pass = require('../../Pass');
var vertex = glslify('../../shaders/vertex/basic.glsl');
var fragment = glslify('./rgbsplit-fs.glsl');

function RGBSplit(options) {
  Pass.call(this);
  this.setShader(vertex, fragment);
  this.params.delta = options.delta || new THREE.Vector2();
}

module.exports = RGBSplit;

RGBSplit.prototype = Object.create(Pass.prototype);
RGBSplit.prototype.constructor = RGBSplit;

RGBSplit.prototype.run = function(composer) {

  this.shader.uniforms.delta.value.copy( this.params.delta );
  
  composer.pass(this.shader);
};