// forked from https://github.com/superguigui/Wagner/blob/master/example/index.js

import {
  Vector2,
  PerspectiveCamera,
  Mesh,
  PointLight,
  BoxGeometry,
  MeshPhongMaterial,
} from 'three'
import dat from 'dat-gui'
import AbstractApplication from 'views/AbstractApplication'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import {FXAAPass} from '@/js/passes/fxaa/FXAAPass'
import {BoxBlurPass} from '@/js/passes/box-blur/BoxBlurPass'
import {VignettePass} from "@/js/passes/vignette/VignettePass"
import {MultiPassBloomPass} from "@/js/passes/bloom/MultiPassBloomPass"

class Main extends AbstractApplication {
  constructor () {
    super()
    this.cubes = []

    this._camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000)
    this.camera.position.z = 100

    this.light = new PointLight(0xffffff, 1)
    this.light.position.copy(this.camera.position)
    this.scene.add(this.light)

    this.params = {
      usePostProcessing: true,
      useFXAA: false,
      useBlur: false,
      useBloom: true,
      useVignette: false
    }

    this.material = new MeshPhongMaterial({ color: 0x3a9ceb })
    let c
    for (let i = 0; i < 500; i++) {
      c = this.addCube()
      this.cubes.push(c)
      this._scene.add(c)
    }
    c.position.set(0, 0, 50)

    this.initPostprocessing()
    this.initGui()
    this.onWindowResize();
    this.animate()
  }

  addCube() {
    var cube = new Mesh(new BoxGeometry(20, 20, 20), this.material)
    cube.position.set(Math.random() * 600 - 300, Math.random() * 600 - 300, Math.random() * -500)
    cube.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2)
    return cube
  }


  initPostprocessing () {
    this.compose = new EffectComposer( this.renderer);
    this.compose.addPass( new RenderPass( this.scene, this.camera ) );

    this.fxaaPass = new FXAAPass();
    this.boxBlurPass = new BoxBlurPass({
      uniforms:{
        delta:{value:new Vector2(3, 3)}
      }
    })
    this.bloomPass = new MultiPassBloomPass({
      blurAmount: 2,
      applyZoomBlur: true
    });
    this.vignettePass = new VignettePass();

    this.compose.addPass( this.fxaaPass );
    this.compose.addPass( this.boxBlurPass );
    this.compose.addPass( this.bloomPass );
    this.compose.addPass( this.vignettePass );
  }

  onWindowResize () {
    super.onWindowResize();
    this.compose.setSize( window.innerWidth, window.innerHeight );
  }

  initGui () {
    const gui = new dat.GUI()
    gui.add(this.params, 'usePostProcessing')
    gui.add(this.params, 'useFXAA')
    gui.add(this.params, 'useBlur')
    gui.add(this.params, 'useBloom')
    gui.add(this.params, 'useVignette')
    return gui
  }

  animate () {
    requestAnimationFrame(this.animate.bind(this))

    for (let i = 0; i < this.cubes.length; i++) {
      this.cubes[i].rotation.y += 0.01 + ((i - this.cubes.length) * 0.00001)
      this.cubes[i].rotation.x += 0.01 + ((i - this.cubes.length) * 0.00001)
    }

    if (this.params.usePostProcessing) {
      this.fxaaPass.enabled = this.params.useFXAA;
      this.boxBlurPass.enabled = this.params.useBlur;
      this.bloomPass.enabled = this.params.useBloom;
      this.vignettePass.enabled = this.params.useVignette;

      this.compose.render();
    } else {
      this._renderer.render(this._scene, this._camera)
    }
  }
}
export default Main
