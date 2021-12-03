'use strict';

var glslify = require('glslify');
var Pass = require('../../Pass');

var vertex = glslify('../../shaders/vertex/ortho.glsl');

function GenericPass(fragment) {
  Pass.call(this);
  this.setShader(vertex, fragment);
}

module.exports = GenericPass;

GenericPass.prototype = Object.create(Pass.prototype);
GenericPass.prototype.constructor = GenericPass;
