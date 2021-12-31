import canvasSketch from 'canvas-sketch';
import Main from './src/js/canvas'
// import Main from './js/mainWagner2'
// import Main from './js/mainWagner4'
// import Main from './js/mainVR'

console.log(Main.settings)

const sketch = ({ context }) => {
  const main = new Main(context);
  return {
    resize:main.onWindowResize.bind(main),
    render:main.animate.bind(main),
    unload:main.unload.bind(main)
  };
};
canvasSketch(sketch, Main.settings);
