// forked from https://threejs.org/examples/?q=vr#webvr_cubes

import {
  Color,
  MathUtils,
  Matrix4,
  Clock,
  LineSegments,
  LineBasicMaterial,
  HemisphereLight,
  DirectionalLight,
  BoxBufferGeometry,
  Mesh,
  MeshLambertMaterial,
  Vector3,
  Raycaster
} from 'three'
import AbstractVRApplication from 'views/AbstractVRApplication'
import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry'

class Main extends AbstractVRApplication {
  constructor () {
    super()

    this.tempMatrix = new Matrix4()
    this.clock = new Clock()
    this.INTERSECTED = undefined

    this.scene.background = new Color(0x505050)
    this.camera.position.set(0, 1.6, 3)

    this.room = new LineSegments(
      new BoxLineGeometry(6, 6, 6, 10, 10, 10).translate(0, 3, 0),
      new LineBasicMaterial({ color: 0x808080 })
    )
    this.scene.add(this.room)

    this.scene.add(new HemisphereLight(0x606060, 0x404040))

    const light = new DirectionalLight(0xffffff)
    light.position.set(1, 1, 1).normalize()
    this.scene.add(light)

    const geometry = new BoxBufferGeometry(0.15, 0.15, 0.15)

    for (var i = 0; i < 200; i++) {
      var object = new Mesh(geometry, new MeshLambertMaterial({ color: Math.random() * 0xffffff }))

      object.position.x = Math.random() * 4 - 2
      object.position.y = Math.random() * 4
      object.position.z = Math.random() * 4 - 2

      object.rotation.x = Math.random() * 2 * Math.PI
      object.rotation.y = Math.random() * 2 * Math.PI
      object.rotation.z = Math.random() * 2 * Math.PI

      object.scale.x = Math.random() + 0.5
      object.scale.y = Math.random() + 0.5
      object.scale.z = Math.random() + 0.5

      object.userData.velocity = new Vector3()
      object.userData.velocity.x = Math.random() * 0.01 - 0.005
      object.userData.velocity.y = Math.random() * 0.01 - 0.005
      object.userData.velocity.z = Math.random() * 0.01 - 0.005

      this.room.add(object)
    }

    this.raycaster = new Raycaster()

    this.animate()
  }

  onWindowResize () {
    super.onWindowResize()
  }

  animate () {
    this.renderer.setAnimationLoop(this.render.bind(this))
  }

  render () {
    const delta = this.clock.getDelta() * 60

    if (this.controller.userData.isSelecting === true) {
      const cube = this.room.children[ 0 ]
      this.room.remove(cube)

      cube.position.copy(this.controller.position)
      cube.userData.velocity.x = (Math.random() - 0.5) * 0.02 * delta
      cube.userData.velocity.y = (Math.random() - 0.5) * 0.02 * delta
      cube.userData.velocity.z = (Math.random() * 0.01 - 0.05) * delta
      cube.userData.velocity.applyQuaternion(this.controller.quaternion)
      this.room.add(cube)
    }

    // find intersections

    this.tempMatrix.identity().extractRotation(this.controller.matrixWorld)

    this.raycaster.ray.origin.setFromMatrixPosition(this.controller.matrixWorld)
    this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix)

    const intersects = this.raycaster.intersectObjects(this.room.children)

    if (intersects.length > 0) {
      if (this.INTERSECTED !== intersects[ 0 ].object) {
        if (this.INTERSECTED) this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex)

        this.INTERSECTED = intersects[ 0 ].object
        this.INTERSECTED.currentHex = this.INTERSECTED.material.emissive.getHex()
        this.INTERSECTED.material.emissive.setHex(0xff0000)
      }
    } else {
      if (this.INTERSECTED) this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex)

      this.INTERSECTED = undefined
    }

    // Keep cubes inside room

    for (let i = 0; i < this.room.children.length; i++) {
      const cube = this.room.children[ i ]

      cube.userData.velocity.multiplyScalar(1 - (0.001 * delta))

      cube.position.add(cube.userData.velocity)

      if (cube.position.x < -3 || cube.position.x > 3) {
        cube.position.x = MathUtils.clamp(cube.position.x, -3, 3)
        cube.userData.velocity.x = -cube.userData.velocity.x
      }

      if (cube.position.y < 0 || cube.position.y > 6) {
        cube.position.y = MathUtils.clamp(cube.position.y, 0, 6)
        cube.userData.velocity.y = -cube.userData.velocity.y
      }

      if (cube.position.z < -3 || cube.position.z > 3) {
        cube.position.z = MathUtils.clamp(cube.position.z, -3, 3)
        cube.userData.velocity.z = -cube.userData.velocity.z
      }

      cube.rotation.x += cube.userData.velocity.x * 2 * delta
      cube.rotation.y += cube.userData.velocity.y * 2 * delta
      cube.rotation.z += cube.userData.velocity.z * 2 * delta
    }

    this.renderer.render(this.scene, this.camera)
  }
}
export default Main
