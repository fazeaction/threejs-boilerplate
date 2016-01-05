/*
  code by @mattdesl (https://github.com/mattdesl/webpack-three-hmr-test)

  An example of statically inlining GLSL
  with glslify for source transforms, such as
  "import" statements and hex colors.
  
  The "three-hmr" boilerplate will eventually
  be removed, and instrumented automatically by
  a babel transform.
 */

const hmr = require('three-hmr/three-hmr')
const cache = hmr.cache(__filename)
const glslify = require('glslify')

const vertexShader = glslify('../shaders/noise.vert')
const fragmentShader = glslify('../shaders/noise.frag')

import THREE from 'three'

module.exports = function (opt) {
  const material = new THREE.RawShaderMaterial({
    vertexShader, fragmentShader
  })
  hmr.enable(cache, material)
  return material
}

if (module.hot) {
  module.hot.accept(err => {
    if (err) throw errr
  })
  hmr.update(cache, {
    vertexShader, fragmentShader
  })
}
