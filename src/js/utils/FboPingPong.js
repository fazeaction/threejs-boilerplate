import {Fbo} from '@/js/utils/Fbo';

export class FboPingPong extends Fbo {
  constructor (w, h, options = {}, antialiased = false) {
    super(w, h, options, antialiased);
    return {src:this, dst: this.clone()};
  }
}
