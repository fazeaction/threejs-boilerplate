import {
  GLSL3,
  RawShaderMaterial,
  Vector2,
  LinearFilter,
  RGBAFormat,
  WebGLRenderTarget
} from 'three'
import { BlendPass } from './../blend/BlendPass';
import { FullBoxBlurPass } from './../box-blur/FullBoxBlurPass';
import { ZoomBlurPass } from './../zoom-blur/ZoomBlurPass';
import { CopyPass } from '@/js/passes/copy/CopyPass.js';

const BlendMode = BlendPass.blendMode;

const optionsDefault = {
  width: 512,
  height: 512,
  blurAmount: 20,
  applyZoomBlur: false,
  zoomBlurStrength: 0.2,
  useTexture: false,
  zoomBlurCenter: new Vector2(0.5, 0.5),
  blendMode: BlendMode.Screen,
  glowTexture: null
}

export class MultiPassBloomPass extends BlendPass{
  constructor (options={}) {
    super()

    this.options = {...optionsDefault, ...options}

    this.blurPass = new FullBoxBlurPass(2);
    this.copyPass = new CopyPass();

    this.blendPass = new BlendPass();
    this.zoomBlur = new ZoomBlurPass();

    this.width = this.options.width;
    this.height = this.options.height;

    const pars = { minFilter: LinearFilter, magFilter: LinearFilter, format: RGBAFormat };
    this.writeBuffer = new WebGLRenderTarget( this.width, this.height, pars );
    this.readBuffer = new WebGLRenderTarget( this.width, this.height, pars );

  }

  render( renderer, writeBuffer, readBuffer, deltaTime, maskActive ) {

    if (this.options.useTexture) {
      this.copyPass.material.uniforms.tDiffuse.value = this.options.glowTexture;
      this.copyPass.directRender(renderer, this.readBuffer);
    } else {
      this.copyPass.fsQuad.material.uniforms.tDiffuse.value = readBuffer.texture;
      this.copyPass.directRender(renderer, this.readBuffer);
    }

    this.blurPass.amount = this.options.blurAmount;
    this.blurPass.render(renderer, this.writeBuffer, this.readBuffer, deltaTime, maskActive);

    if (this.options.applyZoomBlur) {
      this.zoomBlur.center.set(0.5 * this.width, 0.5 * this.height);
      this.zoomBlur.strength = this.options.zoomBlurStrength;
      this.zoomBlur.render(renderer, this.readBuffer, this.writeBuffer, deltaTime, maskActive)
    }

    if (this.options.useTexture) {
      // TODO this is not working yet
      /* this.blendPass.mode = BlendMode.Screen;
      this.blendPass.tDiffuse = this.options.glowTexture;
      this.composer.addPass(this.blendPass);*/
    }

    this.uniforms.mode.value = this.options.blendMode;
    this.uniforms.tInput2.value = this.readBuffer.texture;

    super.render(renderer, writeBuffer, readBuffer);

  }

}
