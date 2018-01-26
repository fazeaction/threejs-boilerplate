import * as THREE from 'three'
import AbstractApplication from 'views/AbstractApplication'
import shaderVert from 'shaders/custom.vert'
import shaderFrag from 'shaders/custom.frag'

class Main extends AbstractApplication {
  constructor () {
    super()

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
