'use strict';

var THREE = require('three');
var glslify = require('glslify');
var Pass = require('../../Pass');
var vertex = glslify('../../shaders/vertex/basic.glsl');
var fragment = glslify('./lookup-fs.glsl');

function Lookup(options) {

  Pass.call(this);
  this.setShader(vertex, fragment);
  this.params.uLookup = new THREE.Texture(512,512);
}

module.exports = Lookup;

Lookup.prototype = Object.create(Pass.prototype);

Lookup.prototype.constructor = Lookup;

Lookup.prototype.run = function(composer) {

  this.shader.uniforms.uLookup.value = this.params.uLookup;
  
  composer.pass(this.shader);
};