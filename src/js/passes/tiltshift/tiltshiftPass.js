'use strict';

var glslify = require('glslify');
var Pass = require('../../Pass');
var vertex = glslify('../../shaders/vertex/basic.glsl');
var fragment = glslify('./tiltshift-fs.glsl');

function TiltShiftPass(options) {
  Pass.call(this);

  options = options || {};

  this.setShader(vertex, fragment);

	this.params.bluramount = options.bluramount || 1.0;
	this.params.center = options.center || 1.1;
	this.params.stepSize = options.stepSize || 0.004;
}

module.exports = TiltShiftPass;

TiltShiftPass.prototype = Object.create(Pass.prototype);
TiltShiftPass.prototype.constructor = TiltShiftPass;

TiltShiftPass.prototype.run = function(composer) {

	this.shader.uniforms.bluramount.value = this.params.bluramount;
	this.shader.uniforms.center.value = this.params.center;
	this.shader.uniforms.stepSize.value = this.params.stepSize;
	
  composer.pass(this.shader);
};
