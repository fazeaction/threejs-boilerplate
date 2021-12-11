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
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { CopyPass } from '@/js/passes/copy/CopyPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import BoxBlurVertex from '../box-blur/box-blur-vs.glsl'
import BoxBlurFragment from '../box-blur/box-blur-fs.glsl'
import passThrough from '@/js/shaders/pass_through.vert'
import BlendFragment from './../blend/blend-fs.glsl'

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

export class MultiPassBloomPass extends ShaderPass{
  constructor (options={}) {
    const blend = new BlendPass();
    super(new RawShaderMaterial({
      uniforms:blend.uniforms,
      vertexShader: passThrough,
      fragmentShader: BlendFragment,
      glslVersion: GLSL3
    }));

    options = {...optionsDefault, ...options}

    this.blurPass = new FullBoxBlurPass(2);
    this.copyPass = new CopyPass();

    this.blendPass = new BlendPass();
    this.zoomBlur = new ZoomBlurPass();

    this.width = options.width || 512;
    this.height = options.height || 512;

    const pars = { minFilter: LinearFilter, magFilter: LinearFilter, format: RGBAFormat };
    this.writeBuffer = new WebGLRenderTarget( this.width, this.height, pars );
    this.readBuffer = new WebGLRenderTarget( this.width, this.height, pars );

    this.params = {};
    this.params.blurAmount = options.blurAmount || 2;
    this.params.applyZoomBlur = options.applyZoomBlur || false;
    this.params.zoomBlurStrength = options.zoomBlurStrength || 0.2;
    this.params.useTexture = options.useTexture || false;
    this.params.zoomBlurCenter = options.zoomBlurCenter || new Vector2(0.5, 0.5);
    this.params.blendMode = options.blendMode || BlendMode.Screen;
    this.params.glowTexture = null;

  }

  render( renderer, writeBuffer, readBuffer, deltaTime, maskActive ) {

    if (this.params.useTexture) {
      this.copyPass.material.uniforms.tDiffuse.value = this.params.glowTexture;
      this.copyPass.directRender(renderer, this.readBuffer);
    } else {
      this.copyPass.fsQuad.material.uniforms.tDiffuse.value = readBuffer.texture;
      this.copyPass.directRender(renderer, this.readBuffer);
    }

    this.blurPass.amount = this.params.blurAmount;
    this.blurPass.render(renderer, this.writeBuffer, this.readBuffer, deltaTime, maskActive);

    if (this.params.applyZoomBlur) {
      this.zoomBlur.center.set(0.5 * this.width, 0.5 * this.height);
      this.zoomBlur.strength = this.params.zoomBlurStrength;
      this.zoomBlur.render(renderer, this.readBuffer, this.writeBuffer, deltaTime, maskActive)
    }

    if (this.params.useTexture) {
      this.blendPass.mode = BlendMode.Screen;
      this.blendPass.tDiffuse = this.params.glowTexture;
      this.composer.addPass(this.blendPass);
    }

    this.uniforms.mode.value = this.params.blendMode;
    this.uniforms.tInput2.value = this.readBuffer.texture;
    // this.blendPass.render(renderer, writeBuffer, readBuffer, deltaTime, maskActive);

    if ( this.uniforms[ this.textureID ] ) {

      this.uniforms[ this.textureID ].value = readBuffer.texture;

    }

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
