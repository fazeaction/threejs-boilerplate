import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import {BoxBlurPass} from './BoxBlurPass';

export class FullBoxBlurPass extends ShaderPass {

  constructor (amount = 2) {
    super();
    this.boxPass = new BoxBlurPass(amount, amount);
  }

  get amount () {
    return this.material.uniforms.amount.value;
  }

  set amount (value) {
    this.material.uniforms.amount.value = value;
  }

}



/*
FullBoxBlurPass.prototype.run = function(composer) {
  var s = this.params.amount;
  this.boxPass.params.delta.set( s, 0 );
  composer.pass( this.boxPass );
  this.boxPass.params.delta.set( 0, s );
  composer.pass( this.boxPass );
};*/
