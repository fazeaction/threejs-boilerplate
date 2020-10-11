import {
  sRGBEncoding,
  Float32BufferAttribute,
  BufferGeometry,
  Line,
  VertexColors,
  AdditiveBlending,
  LineBasicMaterial,
  RingBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from 'three'
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js'
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js'

class AbstractVRApplication {
  constructor () {
    const container = document.createElement('div')
    document.body.appendChild(container)

    this._camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10)

    this._scene = new Scene()
    this._scene.add(this._camera)

    this._renderer = new WebGLRenderer({ antialias: true })
    this._renderer.setPixelRatio(window.devicePixelRatio)
    this._renderer.setSize(window.innerWidth, window.innerHeight)
    this._renderer.outputEncoding = sRGBEncoding
    this._renderer.xr.enabled = true
    container.appendChild(this._renderer.domElement)

    this._controller = this._renderer.xr.getController(0)
    this._controller.addEventListener('selectstart', this.onSelectStart.bind(this))
    this._controller.addEventListener('selectend', this.onSelectEnd.bind(this))
    this._controller.addEventListener('connected', this.onConnected.bind(this))
    this._controller.addEventListener('disconnected', this.onDisconnected.bind(this))
    this._scene.add(this._controller)

    const controllerModelFactory = new XRControllerModelFactory()

    this.controllerGrip = this._renderer.xr.getControllerGrip(0)
    this.controllerGrip.add(controllerModelFactory.createControllerModel(this.controllerGrip))
    this._scene.add(this.controllerGrip)

    window.addEventListener('resize', this.onWindowResize.bind(this), false)
    document.body.appendChild(VRButton.createButton(this._renderer))
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

  get controller () {
    return this._controller
  }

  onSelectStart () {
    this._controller.userData.isSelecting = true
  }

  onSelectEnd () {
    this._controller.userData.isSelecting = false
  }

  onConnected (event) {
    this._controller.add(this.buildController(event.data))
  }

  onDisconnected () {
    this._controller.remove(this._controller.children[0])
  }

  buildController (data) {
    switch (data.targetRayMode) {
      case 'tracked-pointer': {
        const geometry = new BufferGeometry()
        geometry.setAttribute('position', new Float32BufferAttribute([0, 0, 0, 0, 0, -1], 3))
        geometry.setAttribute('color', new Float32BufferAttribute([0.5, 0.5, 0.5, 0, 0, 0], 3))

        const material = new LineBasicMaterial({ vertexColors: VertexColors, blending: AdditiveBlending })

        return new Line(geometry, material)
      }
      case 'gaze': {
        const geometry = new RingBufferGeometry(0.02, 0.04, 32).translate(0, 0, -1)
        const material = new MeshBasicMaterial({ opacity: 0.5, transparent: true })
        return new Mesh(geometry, material)
      }
    }
  }

  onWindowResize () {
    this._camera.aspect = window.innerWidth / window.innerHeight
    this._camera.updateProjectionMatrix()

    this._renderer.setSize(window.innerWidth, window.innerHeight)
  }

  animate (timestamp) {
    this._renderer.setAnimationLoop(this.render.bind(this))
  }

  render () {

  }
}
export default AbstractVRApplication
