import * as THREE from 'three'
import AbstractApplication from 'views/AbstractApplication'
import shaderVert from 'shaders/custom.vert'
import shaderFrag from 'shaders/custom.frag'
import Worker from 'workers/file.worker.js'

class Main extends AbstractApplication {
  constructor () {
    super()

    // simple webworker
    const worker = new Worker()

    worker.postMessage({ a: 1 })
    worker.addEventListener('message', function (event) {
      console.log(event)
    })

    // const texture = new THREE.TextureLoader().load('static/textures/crate.gif')

    const geometry = new THREE.BoxGeometry(200, 200, 200)
    // const material = new THREE.MeshBasicMaterial({ map: texture })

    const material2 = new THREE.ShaderMaterial({
      vertexShader: shaderVert,
      fragmentShader: shaderFrag
    })

    this._mesh = new THREE.Mesh(geometry, material2)
    this._scene.add(this._mesh)

    this.animate()
  }
}

export default Main
