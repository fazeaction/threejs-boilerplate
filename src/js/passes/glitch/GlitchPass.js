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
	this.shader.uniforms.enabled.value = true;

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

    this.shader.uniforms.enabled.value = false;

  }

  ++this.counter;

  composer.pass(this.shader);
};

/*
import {
  RawShaderMaterial,
  GLSL3,
  Vector2,
  Math as THREEMath,
  DataTexture
} from 'three'
import { ShaderPass } from '@/js/utils/ShaderPass';
import passThrough from '@/js/shaders/pass_through.vert'
import ASCIIFragment from './ascii-fs.glsl'

const defaults = {
  uniforms: {
    resolution: {value: new Vector2()},
    tDiffuse: {value: null}
  },
  params:{
    mode: 0,
    perturbMap: null
  }
}

export class ASCIIPass extends ShaderPass{

  constructor (options=defaults) {
    const uniforms = { ...defaults.uniforms, ...options.uniforms}
    super(new RawShaderMaterial({
      uniforms,
      vertexShader: passThrough,
      fragmentShader: ASCIIFragment,
      glslVersion: GLSL3
    }));

    // this.params.tPerturb = null;
    this.params = {...defaults.params, ...options.params};

    this.counter = 0;
    this.breakPoint = 0;
    this.breakPoint = THREEMath.randInt(120, 240);

    if(!this.params.tPerturb) {

      let i, x;
      let l = 64 * 64;
      let data = new Float32Array(l * 3);

      for(i = 0; i < l; ++i) {

        x = THREEMath.randFloat(0, 1);

        data[i * 3] = x;
        data[i * 3 + 1] = x;
        data[i * 3 + 2] = x;

      }

      this.params.tPerturb = new DataTexture(data, 64, 64, RGBFormat, FloatType);
      this.params.tPerturb.needsUpdate = true;

    }
  }

  generateTrigger(){
    this.breakPoint = Math.randInt(120, 240);
  }

  render( renderer, writeBuffer, readBuffer) {

  this.material.uniforms.resolution.value.set(writeBuffer.width, writeBuffer.height)
  this.material.uniforms.tPerturb = this.params.tPerturb;
  this.material.uniforms.enabled.value = true;

  if (this.counter % this.breakPoint === 0 || this.params.mode === 2) {

    this.material.uniforms.amount.value = Math.random() / 30.0;
    this.material.uniforms.angle.value = THREEMath.randFloat(-Math.PI, Math.PI);
    this.material.uniforms.seed.value = Math.random();
    this.material.uniforms.seedX.value = THREEMath.randFloat(-1.0, 1.0);
    this.material.uniforms.seedY.value = THREEMath.randFloat(-1.0, 1.0);
    this.material.uniforms.distortionX.value = THREEMath.randFloat(0.0, 1.0);
    this.material.uniforms.distortionY.value = THREEMath.randFloat(0.0, 1.0);
    this.material.uniforms.colS.value = 0.05;
    // ASCIIPass.prototype.generateTrigger;

  } else if(this.counter % this.breakPoint < this.breakPoint / 5 || this.params.mode === 1) {

    this.material.uniforms.amount.value = Math.random() / 90.0;
    this.material.uniforms.angle.value = THREEMath.randFloat(-Math.PI, Math.PI);
    this.material.uniforms.seed.value = Math.random();
    this.material.uniforms.seedX.value = THREEMath.randFloat(-0.3, 0.3);
    this.material.uniforms.seedY.value = THREEMath.randFloat(-0.3, 0.3);
    this.material.uniforms.distortionX.value = THREEMath.randFloat(0.0, 1.0);
    this.material.uniforms.distortionY.value = THREEMath.randFloat(0.0, 1.0);
    this.material.uniforms.colS.value = 0.05;

  } else if(this.params.mode === 0) {

    this.material.uniforms.enabled.value = false;

  }

  ++this.counter;

  super.render(renderer, writeBuffer, readBuffer)

}


}
 */
