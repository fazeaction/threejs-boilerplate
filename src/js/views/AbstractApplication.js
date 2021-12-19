import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Color,
  sRGBEncoding
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

class AbstractApplication {
  constructor () {
    this._camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000)
    this._camera.position.z = 1000

    this._scene = new Scene()
    this._scene.add(this.camera);

    this._renderer = new WebGLRenderer({ antialias: true, alpha: false })
    this._renderer.setSize(window.innerWidth, window.innerHeight)
    this._renderer.setClearColor(new Color(0x323232))
    document.body.appendChild(this._renderer.domElement)

    this._controls = new OrbitControls(this._camera, this._renderer.domElement)
    // this._controls.addEventListener( 'change', render ) // add this only if there is no animation loop (requestAnimationFrame)
    this._controls.enableDamping = true
    this._controls.dampingFactor = 0.25
    // this._controls.enableZoom = false

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

  onWindowResize () {
    this._camera.aspect = window.innerWidth / window.innerHeight
    this._camera.updateProjectionMatrix()

    this._renderer.setSize(window.innerWidth, window.innerHeight)
  }

  animate (timestamp) {
    requestAnimationFrame(this.animate.bind(this))
    this._renderer.render(this._scene, this._camera)
  }
}

export default AbstractApplication
