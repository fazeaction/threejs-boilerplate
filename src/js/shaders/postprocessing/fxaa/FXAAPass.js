'use strict';

var glslify = require('glslify');
var Pass = require('../../Pass');
var vertex = glslify('../../shaders/vertex/basic.glsl');
var fragment = glslify('./fxaa-fs.glsl');

function FXAAPass() {
  Pass.call(this);
  this.setShader(vertex, fragment);
}

module.exports = FXAAPass;

FXAAPass.prototype = Object.create(Pass.prototype);
FXAAPass.prototype.constructor = FXAAPass;
