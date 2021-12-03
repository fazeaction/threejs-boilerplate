'use strict';

var glslify = require( 'glslify' );
var Pass = require( '../../Pass' );
var vertex = glslify( '../../shaders/vertex/basic.glsl' );
var fragment = glslify( './fisheye-fs.glsl' );

function FishEyePass( options ) {

	Pass.call( this );

	options = options || {};

	this.setShader( vertex, fragment );

	this.params.power = options.power || 1.2;

}

module.exports = FishEyePass;

FishEyePass.prototype = Object.create( Pass.prototype );
FishEyePass.prototype.constructor = FishEyePass;

FishEyePass.prototype.run = function( composer ) {

	this.shader.uniforms.power.value = this.params.power;
	composer.pass( this.shader );

};
