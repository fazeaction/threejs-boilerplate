import canvasSketch from 'canvas-sketch';
import Main from './src/js/canvas-sketch/canvas2'

const sketch = ({ context }) => {
  const main = new Main(context);
  return {
    resize:main.onWindowResize.bind(main),
    render:main.animate.bind(main),
    unload:main.unload.bind(main)
  };
};
canvasSketch(sketch, Main.settings);
