/*
  code by @mattdesl (https://github.com/mattdesl/webpack-three-hmr-test)

  A babel plugin should help us inline
  this file into our bundle, so that users
  do not need to manually interact with it.
 */

//var window = require('global/window')

// <filename, materialList> cache
// Stores all materials created by a hot module.
module.exports.cache = function (filename) {
  var cache
  if (window.__hmrShaderCache) {
    cache = window.__hmrShaderCache
  } else {
    cache = {}
    Object.defineProperty(window, '__hmrShaderCache', {
      configurable: true,
      enumerable: false,
      writable: false,
      value: cache
    })
  }
  if (!cache[filename]) {
    cache[filename] = {}
  }
  return cache[filename]
}

// Enables HMR on the given material
module.exports.enable = enable
function enable (cache, material) {
  var uuid = material.uuid
  if (cache[uuid]) {
    throw new Error('This material already has HMR set.')
  }
  
  cache[uuid] = material

  var oldDispose = material.dispose
  material.dispose = function () {
    if (cache[uuid]) delete cache[uuid]
    return oldDispose.call(material)
  }

  var oldClone = material.clone
  material.clone = function () {
    var newObj = oldClone.call(material)
    enable(cache, newObj)
    return newObj
  }
}

module.exports.update = function (cache, opt) {
  console.log('[ThreeJS]', 'Patching shaders')
  Object.keys(cache).forEach(uuid => {
    var material = cache[uuid]
    if (!material) return
    material.setValues(opt)
    material.needsUpdate = true
  })
}
