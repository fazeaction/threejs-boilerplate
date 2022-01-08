import {
  ACESFilmicToneMapping,
  sRGBEncoding,
  PMREMGenerator,
  TorusKnotGeometry,
  MeshStandardMaterial,
  Mesh,
  PlaneGeometry,
  DoubleSide,
  AmbientLight,
  Vector3,
  PCFSoftShadowMap
} from 'three'
import { SkyEnvironment } from '@/js/environments/Sky';
import dat from 'dat-gui'
import AbstractApplication from 'views/AbstractApplication'
import {DamagedHelmet} from './models/DamagedHelmet'
import {DirectionalLight} from './lights/DirectionalLight'

class Main extends AbstractApplication {
  constructor () {
    super()

    // this._camera = new PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
    this.camera.near = 0.25;
    this.camera.fov  = 45;
    this.camera.updateProjectionMatrix();

    this.camera.position.set( 0, 0, 3 );

    this._renderer.setPixelRatio( window.devicePixelRatio );
    this._renderer.outputEncoding = sRGBEncoding;
    this._renderer.toneMapping = ACESFilmicToneMapping;
    this._renderer.physicallyCorrectLights = true;
    this._renderer.toneMappingExposure = 0.5;
    this._renderer.shadowMap.enabled = true;
    this._renderer.shadowMap.type = PCFSoftShadowMap; // default PCFShadowMap
    this.pmremGenerator = new PMREMGenerator( this._renderer );
    this.skyEnv = new SkyEnvironment(this._renderer);
    this.skyEnv.onChange(this.onChange.bind(this));
    this.scene.add(this.skyEnv);

    let geometry = new TorusKnotGeometry( 18, 8, 150, 20 );
    // let geometry = new THREE.SphereGeometry( 26, 64, 32 );
    let material = new MeshStandardMaterial( {
      color: 0xffffff,
      metalness: 1,
      roughness: 0
    } );

    const damagedHelmet = new DamagedHelmet(this._renderer);
    this.scene.add(damagedHelmet);

    geometry = new PlaneGeometry( 20, 20 );
    const materialGround = new MeshStandardMaterial( {
      color: 0xffffff,
      metalness: 0,
      roughness: 1
    } );

    const planeMesh = new Mesh( geometry, materialGround );
    planeMesh.material.map = this.scene.background
    planeMesh.material.metalness = 1
    planeMesh.material.side = DoubleSide
    planeMesh.position.y = - 1;
    planeMesh.rotation.x = - Math.PI * 0.5;
    planeMesh.receiveShadow = true;
    this.scene.add( planeMesh );

    this.directionalLight = new DirectionalLight( 0xffffff, 10 );
    this.directionalLight.position.set(0, 1, 0)
    this.scene.add( this.directionalLight );
    const light = new AmbientLight( 0xffffff ); // soft white light
    this.scene.add( light );


    this.onChange();
    this.animate()
  }

  onChange(){
    const texture = this.pmremGenerator.fromScene( this.skyEnv ).texture;
    this.scene.environment = texture;
    this.directionalLight.position.copy(this.skyEnv.sun.position);
  }

  animate (timestamp) {
    requestAnimationFrame(this.animate.bind(this))
    this._renderer.render(this.scene, this._camera)
  }
}

export default Main
