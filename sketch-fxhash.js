import canvasSketch from 'canvas-sketch';
import Main from './src/js/canvas-sketch-fxhash/canvas'

// these are the variables you can use as inputs to your algorithms
console.log(fxhash)   // the 64 chars hex number fed to your algorithm
console.log(fxrand()) // deterministic PRNG function, use it instead of Math.random()

const sketch = ({ context }) => {
  const main = new Main(context);
  return {
    resize:main.onWindowResize.bind(main),
    render:main.animate.bind(main),
    unload:main.unload.bind(main)
  };
};
canvasSketch(sketch, Main.settings);
