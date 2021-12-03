// Worker.js

// Post data to parent thread
self.postMessage({ foo: 'foo' })

// Respond to message from parent thread
self.addEventListener('message', (event) => {
  self.postMessage({ lol: 'lol' })
})
