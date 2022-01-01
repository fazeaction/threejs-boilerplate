import {
  Mesh,
  BoxGeometry,
  ShaderMaterial
} from 'three'
import AbstractCanvasSketchApplication from './views/AbstractCanvasSketchApplication'
import shaderVert from './shaders/noise.vert'
import shaderFrag from './shaders/noise.frag'

class Main extends AbstractCanvasSketchApplication {
  constructor (context) {
    super(context)

    const geometry = new BoxGeometry(200, 200, 200)

    // const texture = new TextureLoader().load('static/textures/crate.gif')
    // const material = new MeshBasicMaterial({ map: texture })
    const material2 = new ShaderMaterial({
      vertexShader: shaderVert,
      fragmentShader: shaderFrag
    })

    this._mesh = new Mesh(geometry, material2)
    this._scene.add(this._mesh)
  }

  animate () {
    this._renderer.render(this.scene, this._camera)
  }
}

export default Main
