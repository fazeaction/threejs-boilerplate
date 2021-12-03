'use strict';

var THREE = require('three');
var glslify = require('glslify');
var Pass = require('../../Pass');
var vertex = glslify('../../shaders/vertex/basic.glsl');
var fragment = glslify('./glitch-fs.glsl');

function GlitchPass(options) {
  Pass.call(this);
  this.setShader(vertex, fragment);

  options = options || {};

  // this.params.tPerturb = null;
  this.params.mode = options.mode || 0;

  this.counter = 0;
  this.breakPoint = 0;
  this.breakPoint = THREE.Math.randInt(120, 240);

  if(options.perturbMap !== undefined) {

    this.params.tPerturb = options.perturbMap;

	} else {

		this.perturbMap = null;
    let i, x;
  	let l = 64 * 64;
  	let data = new Float32Array(l * 3);

  	for(i = 0; i < l; ++i) {

  		x = THREE.Math.randFloat(0, 1);

  		data[i * 3] = x;
  		data[i * 3 + 1] = x;
  		data[i * 3 + 2] = x;

  	}

  	this.perturbMap = new THREE.DataTexture(data, 64, 64, THREE.RGBFormat, THREE.FloatType);
  	this.perturbMap.needsUpdate = true;
  	this.params.tPerturb = this.perturbMap;

	}
}

module.exports = GlitchPass;

GlitchPass.prototype = Object.create(Pass.prototype);
GlitchPass.prototype.constructor = GlitchPass;

GlitchPass.prototype.generateTrigger = function(){
  this.breakPoint = THREE.Math.randInt(120, 240);
}

GlitchPass.prototype.run = function(composer) {

  this.shader.uniforms.tPerturb = this.params.tPerturb;
	this.shader.uniforms.active.value = true;

  if (this.counter % this.breakPoint === 0 || this.params.mode === 2) {

    this.shader.uniforms.amount.value = Math.random() / 30.0;
  	this.shader.uniforms.angle.value = THREE.Math.randFloat(-Math.PI, Math.PI);
  	this.shader.uniforms.seed.value = Math.random();
  	this.shader.uniforms.seedX.value = THREE.Math.randFloat(-1.0, 1.0);
  	this.shader.uniforms.seedY.value = THREE.Math.randFloat(-1.0, 1.0);
  	this.shader.uniforms.distortionX.value = THREE.Math.randFloat(0.0, 1.0);
  	this.shader.uniforms.distortionY.value = THREE.Math.randFloat(0.0, 1.0);
  	this.shader.uniforms.colS.value = 0.05;
    GlitchPass.prototype.generateTrigger;

  } else if(this.counter % this.breakPoint < this.breakPoint / 5 || this.params.mode === 1) {

    this.shader.uniforms.amount.value = Math.random() / 90.0;
  	this.shader.uniforms.angle.value = THREE.Math.randFloat(-Math.PI, Math.PI);
  	this.shader.uniforms.seed.value = Math.random();
  	this.shader.uniforms.seedX.value = THREE.Math.randFloat(-0.3, 0.3);
  	this.shader.uniforms.seedY.value = THREE.Math.randFloat(-0.3, 0.3);
  	this.shader.uniforms.distortionX.value = THREE.Math.randFloat(0.0, 1.0);
  	this.shader.uniforms.distortionY.value = THREE.Math.randFloat(0.0, 1.0);
  	this.shader.uniforms.colS.value = 0.05;

  } else if(this.params.mode === 0) {

    this.shader.uniforms.active.value = false;

  }

  ++this.counter;

  composer.pass(this.shader);
};
