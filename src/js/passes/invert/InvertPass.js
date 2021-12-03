'use strict';

var glslify = require('glslify');
var Pass = require('../../Pass');
var vertex = glslify('../../shaders/vertex/basic.glsl');
var fragment = glslify('./invert-fs.glsl');

function InvertPass() {
  Pass.call(this);
  this.setShader(vertex, fragment);
}

module.exports = InvertPass;

InvertPass.prototype = Object.create(Pass.prototype);
InvertPass.prototype.constructor = InvertPass;
