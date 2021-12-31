import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Color,
  sRGBEncoding
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

class AbstractCanvasSketchApplication {
  static settings = { animate: true, context: 'webgl2', attributes: { antialias: true } };
  constructor (context) {
    this._camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000)
    this._camera.position.z = 1000

    this._scene = new Scene()
    this._scene.add(this.camera);

    console.log(context);

    this._renderer = new WebGLRenderer(context)

    this._controls = new OrbitControls(this._camera, this._renderer.domElement)
    // this._controls.addEventListener( 'change', render ) // add this only if there is no animation loop (requestAnimationFrame)
    this._controls.enableDamping = true
    this._controls.dampingFactor = 0.25
    // this._controls.enableZoom = false

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

  onWindowResize ({ pixelRatio, viewportWidth, viewportHeight }) {
    this._camera.aspect = viewportWidth / viewportHeight
    this._camera.updateProjectionMatrix()

    this._renderer.setSize(viewportWidth, viewportHeight)
    this._renderer.setPixelRatio(pixelRatio)
  }

  animate (timestamp) {
    this._renderer.render(this._scene, this._camera)
  }

  unload(){

  }
}

export default AbstractCanvasSketchApplication
