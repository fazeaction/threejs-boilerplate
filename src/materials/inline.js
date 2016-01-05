/*
  code by @mattdesl (https://github.com/mattdesl/webpack-three-hmr-test)

  An example of simple inline shaders,
  without using glslify.
  
  The "three-hmr" boilerplate will eventually
  be removed, and instrumented automatically by
  a babel transform.
 */

const hmr = require('three-hmr/three-hmr')
const cache = hmr.cache(__filename)

const vertexShader = `
  attribute vec4 position;
  attribute vec2 uv;
  uniform mat4 projectionMatrix;
  uniform mat4 modelViewMatrix;
  varying vec2 vUv;
  void main () {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * position;
  }
`.trim()

const fragmentShader = `
  precision mediump float;
  varying vec2 vUv;
  
  const vec3 colorA = vec3(1.0, 0.0, 0.0);
  const vec3 colorB = vec3(1.0, 1.0, 1.0);
  
  float checker(vec2 uv, float repeats) {
    float cx = floor(repeats * uv.x);
    float cy = floor(repeats * uv.y); 
    float result = mod(cx + cy, 2.0);
    return sign(result);
  }
  
  void main () {
    float d = checker(vUv, 10.0);
    vec3 color = mix(colorA, colorB, d);
    gl_FragColor = vec4(color, 1.0);
  }
`.trim()

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
