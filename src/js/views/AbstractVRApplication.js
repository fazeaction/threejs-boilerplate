import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from 'three'
import { WEBVR } from 'three/examples/js/vr/WebVR'

class AbstractVRApplication {
  constructor () {
    this._camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10)

    this._scene = new Scene()
    this._scene.add(this._camera)

    this._renderer = new WebGLRenderer()
    this._renderer.setPixelRatio(window.devicePixelRatio)
    this._renderer.setSize(window.innerWidth, window.innerHeight)
    this._renderer.vr.enabled = true
    document.body.appendChild(this._renderer.domElement)

    document.body.appendChild(WEBVR.createButton(this._renderer))

    window.addEventListener('resize', this.onWindowResize.bind(this), false)
  }

  get renderer () {
    return this._renderer
  }

  get camera () {
    return this._camera
  }

  get scene () {
    return this._scene
  }

  get effect () {
    return this._effect
  }

  get controls () {
    return this._controls
  }

  onWindowResize () {
    this._camera.aspect = window.innerWidth / window.innerHeight
    this._camera.updateProjectionMatrix()

    this._renderer.setSize(window.innerWidth, window.innerHeight)
  }

  animate (timestamp) {
    this._effect.requestAnimationFrame(this.animate.bind(this))
    this._controls.update()
    this._effect.render(this._scene, this._camera)
  }
}
export default AbstractVRApplication
