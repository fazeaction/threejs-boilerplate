// forked from https://github.com/superguigui/Wagner/blob/master/example/index.js

import {
  Mesh,
  PointLight,
  Vector2,
  BoxGeometry,
  BufferGeometry,
  MeshPhongMaterial,
  TextureLoader, Matrix4, Object3D,AmbientLight,SpotLight,PCFShadowMap, CameraHelper
} from 'three'
import dat from 'dat-gui'
import AbstractApplication from 'views/AbstractApplication'
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { ShaderPass } from '@/js/utils/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';

import {FboPingPong} from "@/js/utils/FboPingPong"
import {VignettePass} from "@/js/passes/vignette/VignettePass"
import {ZoomBlurPass} from "@/js/passes/zoom-blur/ZoomBlurPass"
import {ToonPass} from "@/js/passes/toon/ToonPass"
import {MultiPassBloomPass} from "@/js/passes/bloom/MultiPassBloomPass"

class Main extends AbstractApplication {
  constructor () {
    super()
    // this.cubes = []

    this.modelMaterial = new MeshPhongMaterial( {
      map: new TextureLoader().load( './static/textures/1324-decal.jpg' ),
      normalMap: new TextureLoader().load( './static/textures/1324-normal.jpg' ),
      shininess: 10,
      flatShading: false
    } );

    this.params = {
      usePostProcessing: true,
      useFXAA: false,
      useBloomPass: false,
      useVignettePass: false,
      useZoomBlurPass: false,
      useToonPass: false
    }

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

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFShadowMap;

    /*const _geometry = new BufferGeometry();
    _geometry.setAttribute( 'position', new Float32BufferAttribute( [ - 1, 3, 0, - 1, - 1, 0, 3, - 1, 0 ], 3 ) );
    _geometry.setAttribute( 'uv', new Float32BufferAttribute( [ 0, 2, 0, 0, 2, 0 ], 2 ) );
    new Mesh( _geometry, null )

    this.material = new MeshPhongMaterial({ color: 0x3a9ceb })
    let c
    for (let i = 0; i < 500; i++) {
      c = this.addCube()
      this.cubes.push(c)
      this._scene.add(c)
    }*/
    this.createCubes();

    // this.initPostprocessing2()
    this.initPostprocessing()
    this.initGui()
    this.onWindowResize();
    this.animate()
  }

  addCube () {
    const cube = new Mesh(new BoxGeometry(20, 20, 20), this.material)

    cube.position.set(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * -500
    )

    cube.rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    )
    return cube
  }

  initPostprocessing2 () {
    const params = {
      exposure: 1,
      bloomStrength: 5,
      bloomThreshold: 0,
      bloomRadius: 0,
      scene: "Scene with Glow"
    };
    this.renderer.autoClearColor = true
    this.compose = new EffectComposer( this.renderer);
    this.fxaaPass = new ShaderPass( FXAAShader );
    this.bloomPass = new UnrealBloomPass( new Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    this.bloomPass.threshold = params.bloomThreshold;
    this.bloomPass.strength = params.bloomStrength;
    this.bloomPass.radius = params.bloomRadius;
    this.vignettePass = new VignettePass();
    this.zoomBlurPass = new ZoomBlurPass();
    this.toonPass = new ToonPass();
    this.compose.addPass( new RenderPass( this.scene, this.camera ) );
    this.compose.addPass( this.fxaaPass );
    this.compose.addPass( this.bloomPass );
    this.compose.addPass( this.zoomBlurPass );
    this.compose.addPass( this.toonPass );
    this.compose.addPass( this.vignettePass );

  }

  initPostprocessing(){
    this.compose = new EffectComposer( this.renderer);
    const a = new RenderPass( this.scene, this.camera );
    this.compose.addPass( a );
    this.bloomPass = new MultiPassBloomPass();
    this.vignettePass = new VignettePass();
    this.bloomPass.params.strength = .5;
    // this.compose.addPass( this.bloomPass );
    this.compose.addPass( this.vignettePass );
  }

  onWindowResize () {
    super.onWindowResize();
    this.compose.setSize( window.innerWidth, window.innerHeight );
    const pixelRatio = this.renderer.getPixelRatio();
    // this.fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( window.innerWidth * pixelRatio );
    // this.fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( window.innerHeight * pixelRatio );
    // this.vignettePass.resolution = new Vector2(window.innerWidth * 2, window.innerHeight * 2);
  }

  initGui () {
    const gui = new dat.GUI()
    gui.add(this.params, 'usePostProcessing')
    gui.add(this.params, 'useFXAA')
    gui.add(this.params, 'useBloomPass')
    gui.add(this.params, 'useVignettePass')
    gui.add(this.params, 'useZoomBlurPass')
    gui.add(this.params, 'useToonPass')

    return gui
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
    // super.animate()

    /*for (let i = 0; i < this.cubes.length; i++) {
      this.cubes[i].rotation.y += 0.01 + ((i - this.cubes.length) * 0.00001)
      this.cubes[i].rotation.x += 0.01 + ((i - this.cubes.length) * 0.00001)
    }*/
    const t = .001 * Date.now();
    this.light.position.set( 0, 3000 * Math.cos( t ), 2000 * Math.sin( t ) );

    if (this.params.usePostProcessing) {
      // this.fxaaPass.enabled = this.params.useFXAA;
      // this.bloomPass.enabled = this.params.useBloomPass;
      this.vignettePass.enabled = this.params.useVignettePass;
      // this.zoomBlurPass.enabled = this.params.useZoomBlurPass;
      // this.toonPass.enabled = this.params.useToonPass;

      this.compose.render();
    } else {
      this._renderer.render(this._scene, this._camera)
    }
  }
}
export default Main
