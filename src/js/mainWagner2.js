// forked from https://github.com/superguigui/Wagner/blob/master/example/index.js

import {
  BoxGeometry,
  Mesh,
  MeshPhongMaterial,
  PointLight,
  Vector2,
  BufferGeometry,
  Float32BufferAttribute
} from 'three'
import dat from 'dat-gui'
import AbstractApplication from 'views/AbstractApplication'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { ShaderPass } from '@/js/utils/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';

import {FboPingPong} from "@/js/utils/FboPingPong"
import {VignettePass} from "@/js/passes/vignette/VignettePass"
import {ZoomBlurPass} from "@/js/passes/zoom-blur/ZoomBlurPass"

class Main extends AbstractApplication {
  constructor () {
    super()
    this.cubes = []

    this.params = {
      usePostProcessing: true,
      useFXAA: true,
      useBlur: true,
      useBloom: true
    }

    const light = new PointLight(0xFFFFFF, 1)
    light.position.copy(this._camera.position)
    this._scene.add(light)
    const _geometry = new BufferGeometry();
    _geometry.setAttribute( 'position', new Float32BufferAttribute( [ - 1, 3, 0, - 1, - 1, 0, 3, - 1, 0 ], 3 ) );
    _geometry.setAttribute( 'uv', new Float32BufferAttribute( [ 0, 2, 0, 0, 2, 0 ], 2 ) );
    new Mesh( _geometry, null )

    this.material = new MeshPhongMaterial({ color: 0x3a9ceb })
    let c
    for (let i = 0; i < 500; i++) {
      c = this.addCube()
      this.cubes.push(c)
      this._scene.add(c)
    }

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

  initPostprocessing () {
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
    this.compose.addPass( new RenderPass( this.scene, this.camera ) );
    this.compose.addPass( this.fxaaPass );
    // this.compose.addPass( this.bloomPass );
    // this.compose.addPass( this.vignettePass );
    this.compose.addPass( this.zoomBlurPass );

  }

  onWindowResize () {
    super.onWindowResize();
    this.compose.setSize( window.innerWidth, window.innerHeight );
    const pixelRatio = this.renderer.getPixelRatio();
    this.fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( window.innerWidth * pixelRatio );
    this.fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( window.innerHeight * pixelRatio );
    this.vignettePass.resolution = new Vector2(window.innerWidth * 2, window.innerHeight * 2);
  }

  initGui () {
    const gui = new dat.GUI()
    gui.add(this.params, 'usePostProcessing')
    gui.add(this.params, 'useFXAA')
    gui.add(this.params, 'useBlur')
    gui.add(this.params, 'useBloom')
    return gui
  }

  animate () {
    requestAnimationFrame(this.animate.bind(this))
    // super.animate()

    for (let i = 0; i < this.cubes.length; i++) {
      this.cubes[i].rotation.y += 0.01 + ((i - this.cubes.length) * 0.00001)
      this.cubes[i].rotation.x += 0.01 + ((i - this.cubes.length) * 0.00001)
    }

    if (this.params.usePostProcessing) {
      this.fxaaPass.enabled = this.params.useFXAA;
      this.bloomPass.enabled = this.params.useBloom;
      // this.vignettePass.enabled = this.params.useBlur;
      this.zoomBlurPass.enabled = this.params.useBlur;
      // if (this.params.useBlur) this.composer.pass(this.boxBlurPass)
      this.compose.render();
    } else {
      this._renderer.render(this._scene, this._camera)
    }
  }
}
export default Main
