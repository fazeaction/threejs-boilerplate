import {
  RawShaderMaterial,
  GLSL3
} from 'three'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import passThrough from '@/js/shaders/pass_through.vert'
import SSAOFragment from './ssao-fs.glsl'

var BlendPass = require('../blend/BlendPass');
var FullBoxBlurPass = require('../box-blur/FullBoxBlurPass');
var Composer = require('../../Composer');

export class SSAO extends ShaderPass{

  constructor (xReverse=1.0, yReverse=1.1, xMirror =0.004, yMirror = false, mirrorCenter=0, angle = 0 ) {
    super(new RawShaderMaterial({
      uniforms:{
        xReverse: {value: xReverse},
        yReverse: {value: yReverse},
        xMirror: {value: xMirror},
        yMirror: {value: yMirror},
        mirrorCenter: {value: mirrorCenter},
        angle: {value: angle}
      },
      vertexShader: passThrough,
      fragmentShader: SSAOFragment,
      glslVersion: GLSL3
    }));
  }

  get xReverse() {
    return this.material.uniforms.xReverse.value;
  }

  set xReverse(value) {
    this.material.uniforms.xReverse.value = value;
  }

  get yReverse() {
    return this.material.uniforms.yReverse.value;
  }

  set yReverse(value) {
    this.material.uniforms.yReverse.value = value;
  }

  get xMirror() {
    return this.material.uniforms.xMirror.value;
  }

  set xMirror(value) {
    this.material.uniforms.xMirror.value = value;
  }

  get yMirror() {
    return this.material.uniforms.yMirror.value;
  }

  set yMirror(value) {
    this.material.uniforms.yMirror.value = value;
  }

  get mirrorCenter() {
    return this.material.uniforms.mirrorCenter.value;
  }

  set mirrorCenter(value) {
    this.material.uniforms.mirrorCenter.value = value;
  }

  get angle() {
    return this.material.uniforms.angle.value;
  }

  set angle(value) {
    this.material.uniforms.angle.value = value;
  }

}

'use strict';

var THREE = require('three');
var glslify = require('glslify');
var Pass = require('../../Pass');
var vertex = glslify('../../shaders/vertex/basic.glsl');
var fragment = glslify('./ssao-fs.glsl');
var BlendPass = require('../blend/BlendPass');
var FullBoxBlurPass = require('../box-blur/FullBoxBlurPass');
var Composer = require('../../Composer');

function SSAO(options) {
  Pass.call(this);
  this.setShader(vertex, fragment);



  this.blendPass = new BlendPass();

  this.blurPass = new FullBoxBlurPass(2);
  this.params.tDepth = new THREE.Texture()
  this.params.isPacked = false
  this.params.onlyOcclusion = false

  this.params.blurAmount = 1;

}

module.exports = SSAO;

SSAO.prototype = Object.create(Pass.prototype);
SSAO.prototype.constructor = SSAO;


SSAO.prototype.run = function(composer) {



    this.shader.uniforms.tDepth.value = this.tDepth;


    if( !this.composer ) {
        var s = 4;
        this.composer = new Composer( composer.renderer, { useRGBA: true } );
        this.composer.setSize( composer.width / s, composer.height / s );
      }

      this.composer.reset();

      this.composer.setSource( composer.output );

      this.shader.uniforms.tDepth.value = this.params.tDepth;
      this.shader.uniforms.isPacked.value = this.params.isPacked;
      this.shader.uniforms.onlyOcclusion.value = this.params.onlyOcclusion;
      this.composer.pass( this.shader );

      this.blurPass.params.amount = this.params.blurAmount;
      this.composer.pass(this.blurPass);

      if( this.params.onlyOcclusion ) {
        composer.setSource( this.composer.output );
      } else {
        this.blendPass.params.mode = 4;
        this.blendPass.params.tInput2 = this.composer.output;

        composer.pass( this.blendPass );
      }


};










