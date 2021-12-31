import {
  MathUtils, Object3D,
  Scene,
  Vector3,
  DirectionalLight
} from 'three'
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import dat from 'dat-gui'

export class SkyEnvironment extends Sky {

  constructor(renderer) {
    super();
    this._renderer = renderer;
    this.scale.setScalar( 450000 );

    this.sun = new DirectionalLight( 0xffffff, 10 );
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.width = 512; // default
    this.sun.shadow.mapSize.height = 512; // default
    this.sun.shadow.camera.near = 0.5; // default
    this.sun.shadow.camera.far = 500; // default

    /// GUI

    this.effectController = {
      turbidity: 10,
      rayleigh: 3,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.7,
      elevation: 2,
      azimuth: 180,
      exposure: this._renderer.toneMappingExposure
    }

    const gui = new dat.GUI();

    gui.add( this.effectController, 'turbidity', 0.0, 20.0, 0.1 ).onChange( this.guiChanged.bind(this) );
    gui.add( this.effectController, 'rayleigh', 0.0, 4, 0.001 ).onChange( this.guiChanged.bind(this) );
    gui.add( this.effectController, 'mieCoefficient', 0.0, 0.1, 0.001 ).onChange( this.guiChanged.bind(this) );
    gui.add( this.effectController, 'mieDirectionalG', 0.0, 1, 0.001 ).onChange( this.guiChanged.bind(this) );
    gui.add( this.effectController, 'elevation', -90, 90, 0.1 ).onChange( this.guiChanged.bind(this) );
    gui.add( this.effectController, 'azimuth', - 180, 180, 0.1 ).onChange( this.guiChanged.bind(this) );
    gui.add( this.effectController, 'exposure', 0, 1, 0.0001 ).onChange( this.guiChanged.bind(this) );

    this.guiChanged();
  }

  guiChanged() {
    const uniforms = this.material.uniforms;
    uniforms[ 'turbidity' ].value = this.effectController.turbidity;
    uniforms[ 'rayleigh' ].value = this.effectController.rayleigh;
    uniforms[ 'mieCoefficient' ].value = this.effectController.mieCoefficient;
    uniforms[ 'mieDirectionalG' ].value = this.effectController.mieDirectionalG;

    const phi = MathUtils.degToRad( 90 - this.effectController.elevation );
    const theta = MathUtils.degToRad( this.effectController.azimuth );

    this.sun.position.setFromSphericalCoords( 1, phi, theta );

    uniforms[ 'sunPosition' ].value.copy( this.sun.position );

    if(this.onChangeCallBack) this.onChangeCallBack();
  }

  get exposure(){
    return this.effectController.exposure;
  }

  onChange(callback){
    this.onChangeCallBack = callback;
  }

}