import {
  ShaderMaterial,
  UniformsUtils
} from 'three';
import { Pass, FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';

export class ShaderPass extends Pass {

  constructor( shader, textureID ) {

    super();

    this.textureID = ( textureID !== undefined ) ? textureID : 'tDiffuse';
    this.uniforms = shader.uniforms;
    this.material = shader;

    for (const uniform in this.uniforms) {
      Object.defineProperty(this, uniform, {
        get: function() {
          return this.material.uniforms[uniform].value;
        },
        set: function(value) {
          return this.material.uniforms[uniform].value = value;
        },
      });
    }

    this.fsQuad = new FullScreenQuad( this.material );

  }

  render( renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */ ) {

    if ( this.uniforms[ this.textureID ] ) {

      this.uniforms[ this.textureID ].value = readBuffer.texture;

    }

    this.directRender(renderer, writeBuffer);
  }
  directRender( renderer, writeBuffer) {

    this.fsQuad.material = this.material;

    if ( this.renderToScreen ) {

      renderer.setRenderTarget( null );
      this.fsQuad.render( renderer );

    } else {

      renderer.setRenderTarget( writeBuffer );
      // TODO: Avoid using autoClear properties, see https://github.com/mrdoob/three.js/pull/15571#issuecomment-465669600
      if ( this.clear ) renderer.clear( renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil );
      this.fsQuad.render( renderer );

    }

  }

}
