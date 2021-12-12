import { Pass } from 'three/examples/jsm/postprocessing/Pass.js';
import {BoxBlurPass} from './BoxBlurPass';
import {Vector2} from 'three'

export class FullBoxBlurPass extends Pass {

  constructor (amount = 2) {
    super();
    this._amount = amount;
    this.boxPass = new BoxBlurPass({uniforms:{delta:{value:new Vector2(amount, amount)}}});
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
    this.boxPass.delta.set( this.amount, 0 );
    this.boxPass.resolution.set( this.writeBuffer.width, this.writeBuffer.height );
    this.boxPass.render( renderer, this.writeBuffer, readBuffer, deltaTime, maskActive );
    this.boxPass.delta.set( 0, this.amount );
    this.boxPass.render( renderer, writeBuffer, this.writeBuffer, deltaTime, maskActive );

  }

}
