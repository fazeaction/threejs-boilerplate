'use strict';

var glslify = require('glslify');
var Pass = require('../../Pass');
var vertex = glslify('../../shaders/vertex/basic.glsl');
var fragment = glslify('./copy-fs.glsl');

function CopyPass() {
  Pass.call(this);
  this.setShader(vertex, fragment);
}

module.exports = CopyPass;

CopyPass.prototype = Object.create(Pass.prototype);
CopyPass.prototype.constructor = CopyPass;
