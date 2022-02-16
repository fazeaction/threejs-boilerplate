// forked from https://github.com/superguigui/Wagner/blob/master/example/index.js

import {
  Mesh,
  RepeatWrapping,
  Vector2,
  BoxGeometry,
  MeshBasicMaterial,
  MeshPhongMaterial,
  TextureLoader,
  Object3D,
  AmbientLight,
  SpotLight,
  PCFShadowMap,
  SmoothShading,
  CameraHelper, LinearFilter, RGBAFormat, WebGLRenderTarget, Color
} from 'three'
import {Pane} from 'tweakpane';
import AbstractApplication from 'views/AbstractApplication'
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

import {MultiPassBloomPass} from "@/js/passes/bloom/MultiPassBloomPass"

class Main extends AbstractApplication {
  constructor () {
    super()

    this.renderer.setClearColor(new Color(0x000000))

    this.modelMaterial = new MeshPhongMaterial( {
      map: new TextureLoader().load( './static/textures/1324-decal.jpg' ),
      normalMap: new TextureLoader().load( './static/textures/1324-normal.jpg' ),
      shininess: 10,
      flatShading: false
    } );

    var SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 1024;

    var ambient = new AmbientLight( 0x444444 );
    this.scene.add( ambient );

    const light = new SpotLight( 0xaaaaaa);
    light.position.set( 0, 1500, 1000 );
    light.target.position.set( 0, 0, 0 );

    light.castShadow = true;

    light.shadow.camera.near = 1200;
    light.shadow.camera.far = 2500;
    light.shadow.camera.fov = 90;

    //light.shadowCameraVisible = true;

    light.shadow.bias = 0.0001;
    light.shadow.darkness = 0.5;

    light.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    light.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    this.scene.add( light );
    this.scene.add( new CameraHelper( light.shadow.camera ) );

    this.light = light;

    this.renderer.setPixelRatio( window.devicePixelRatio );
    // this.renderer.shadowMap.enabled = true;
    // this.renderer.shadowMap.type = PCFShadowMap;

    this.glowMaterial = new MeshBasicMaterial( {
      // emissive: 0xffffff,
      map: new TextureLoader().load( './static/textures/1324-glow.jpg' ),
    } );

    this.glowMaterial.map.repeat = new Vector2( 1, 1 );
    this.glowMaterial.map.wrapS = this.glowMaterial.map.wrapT = RepeatWrapping;
    const pars = { minFilter: LinearFilter, magFilter: LinearFilter, format: RGBAFormat };
    this.glowTexture = new WebGLRenderTarget( window.innerWidth, window.innerHeight, pars );

    this.createCubes();

    this.composer = new EffectComposer( this.renderer);
    this.composer.addPass( new RenderPass( this.scene, this.camera ) );
    this.bloomPass = new MultiPassBloomPass({
      strength:.5,
      zoomBlurStrength: 2,
      blurAmount: 2,
      applyZoomBlur: false,
      useTexture: false
    });
    this.bloomPass.strength = .5;
    this.composer.addPass( this.bloomPass );

    const gui = new Pane()
    gui.addInput(this.bloomPass.options, 'blurAmount', {min:0, max:2})
    gui.addInput(this.bloomPass.options, 'applyZoomBlur')
    gui.addInput(this.bloomPass.options, 'zoomBlurStrength', {min:0, max:2})
    gui.addInput(this.bloomPass.options, 'useTexture')

    this.onWindowResize();
    this.animate()
  }

  onWindowResize () {
    super.onWindowResize();
    this.composer.setSize( window.innerWidth, window.innerHeight );
    this.bloomPass.options.zoomBlurCenter.set( .5 * window.innerWidth, .5 * window.innerHeight );
    this.glowTexture.setSize( window.innerWidth, window.innerHeight );
  }

  createCubes() {

    var s = new BoxGeometry( 10, 10, 10, 1, 1 ,1 );
    var gg = [];
    var r = 2000;
    for( var j = 0; j < 100 ; j++ ) {
      var m = new Object3D();
      m.rotation.set( Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI );
      m.position.set( ( .5 - Math.random() ) * r, ( .5 - Math.random() ) * r, ( .5 - Math.random() ) * r );
      var scale = 10 + Math.random() * 20;

      m.scale.set( scale, scale, scale );
      // sc.push(m.scale);
      m.updateMatrix()
      gg.push(s.clone().applyMatrix4(m.matrix));
    }

    const mg = mergeBufferGeometries(gg)
    const model = new Mesh( mg, this.modelMaterial );
    mg.computeBoundingSphere();
    model.castShadow = true;
    model.receiveShadow = true;
    this.scene.add( model );

  }



  animate () {
    requestAnimationFrame(this.animate.bind(this))

    const t = .001 * Date.now();

    // this.light.position.set( 0, 3000 * Math.cos( t ), 2000 * Math.sin( t ) );

    if( this.bloomPass.options.useTexture ) {
      this.scene.overrideMaterial = this.glowMaterial;
      this.renderer.setRenderTarget( this.glowTexture );
      this.renderer.render( this.scene, this.camera );
      this.renderer.setRenderTarget( null );
      this.scene.overrideMaterial = null;
      this.bloomPass.options.glowTexture = this.glowTexture.texture;
    }

    this.composer.render();

  }
}
export default Main
