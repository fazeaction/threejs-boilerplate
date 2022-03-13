// forked from https://github.com/superguigui/Wagner/blob/master/example/index.js

import {
  Mesh,
  RepeatWrapping,
  Vector2,
  MeshBasicMaterial,
  MeshPhongMaterial,
  TextureLoader,
  AmbientLight,
  SpotLight,
  PCFShadowMap,
  IcosahedronGeometry,
  MeshNormalMaterial,
  BackSide,
  CameraHelper, LinearFilter, RGBAFormat, WebGLRenderTarget, Color
} from 'three'
import AbstractApplication from 'views/AbstractApplication'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { TeapotGeometry } from 'three/examples/jsm/geometries/TeapotGeometry.js';
import {ASCIIPass} from './passes/ascii/ASCIIPass'

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
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFShadowMap;

    this.glowMaterial = new MeshBasicMaterial( {
      // emissive: 0xffffff,
      map: new TextureLoader().load( './static/textures/1324-glow.jpg' ),
    } );

    this.glowMaterial.map.repeat = new Vector2( 1, 1 );
    this.glowMaterial.map.wrapS = this.glowMaterial.map.wrapT = RepeatWrapping;
    const pars = { minFilter: LinearFilter, magFilter: LinearFilter, format: RGBAFormat };
    this.glowTexture = new WebGLRenderTarget( window.innerWidth, window.innerHeight, pars );

    this.createTeapot();

    this.composer = new EffectComposer( this.renderer);
    this.composer.addPass( new RenderPass( this.scene, this.camera ) );
    this.asciiPass = new ASCIIPass();
    this.composer.addPass( this.asciiPass );

    this.onWindowResize();
    this.animate()
  }

  createTeapot() {

    var sphere = new Mesh( new IcosahedronGeometry( 2000, 4 ), new MeshNormalMaterial( { side: BackSide } ) );
    this.scene.add( sphere );


      const model = new Mesh(
        new TeapotGeometry(),
        this.modelMaterial
      );
      var scale = 10;
      model.scale.set ( scale, scale, scale );
      model.material.map.wrapS = model.material.map.wrapT = RepeatWrapping;
      model.material.map.repeat.set( 1, 1 );
      model.castShadow = true;
      model.receiveShadow = true;
      this.scene.add( model );

  }

  onWindowResize () {
    super.onWindowResize();
    this.composer.setSize( window.innerWidth, window.innerHeight );
  }

  animate () {
    requestAnimationFrame(this.animate.bind(this))

    const t = .001 * Date.now();

    // this.light.position.set( 0, 3000 * Math.cos( t ), 2000 * Math.sin( t ) );

    this.composer.render();
    // this.renderer.render(this.scene, this.camera)

  }
}
export default Main
