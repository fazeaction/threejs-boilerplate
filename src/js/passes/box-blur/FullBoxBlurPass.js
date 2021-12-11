import { Pass } from 'three/examples/jsm/postprocessing/Pass.js';
import {BoxBlurPass} from './BoxBlurPass';
import {Vector2} from 'three'

export class FullBoxBlurPass extends Pass {

  constructor (amount = 2) {
    super();
    this._amount = amount;
    this.boxPass = new BoxBlurPass(new Vector2(this._amount, this._amount));
  }

  get amount () {
    return this._amount;
  }

  set amount (value) {
    this._amount = value;
  }

  render( renderer, writeBuffer, readBuffer, deltaTime, maskActive ) {
    if(!this.writeBuffer){
      this.writeBuffer = writeBuffer.clone();
    }
    this.boxPass.delta.set( this._amount, 0 );
    this.boxPass.resolution.set( this.writeBuffer.width, this.writeBuffer.height );
    this.boxPass.render( renderer, this.writeBuffer, readBuffer, deltaTime, maskActive );
    this.boxPass.delta.set( 0, this._amount );
    this.boxPass.render( renderer, writeBuffer, this.writeBuffer, deltaTime, maskActive );

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
