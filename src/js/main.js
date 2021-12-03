import {
  BoxGeometry,
  Mesh,
  ShaderMaterial
  // TextureLoader,
  // MeshBasicMaterial
} from 'three'
import AbstractApplication from 'views/AbstractApplication'
import shaderVert from 'shaders/noise.vert'
import shaderFrag from 'shaders/noise.frag'
import Worker from 'workers/file.worker?worker'
console.log('Worker', Worker)
class Main extends AbstractApplication {
  constructor () {
    super()

    // simple webworker
    const worker = new Worker()

    worker.postMessage({ a: 1 })
    worker.addEventListener('message', function (event) {
      console.log(event)
    })

    const geometry = new BoxGeometry(200, 200, 200)

    // const texture = new TextureLoader().load('static/textures/crate.gif')
    // const material = new MeshBasicMaterial({ map: texture })
    const material2 = new ShaderMaterial({
      vertexShader: shaderVert,
      fragmentShader: shaderFrag
    })

    this._mesh = new Mesh(geometry, material2)
    this._scene.add(this._mesh)

    this.animate()
  }
}

export default Main
