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
  PCFSoftShadowMap,
  BoxGeometry,
  InstancedMesh,
  Matrix4,
} from 'three'
import { SkyEnvironment } from './../environments/Sky';
import {DamagedHelmet} from './../models/DamagedHelmet'
import {DirectionalLight} from './../lights/DirectionalLight'
import AbstractCanvasSketchApplication from './../views/AbstractCanvasSketchApplication'

class Main extends AbstractCanvasSketchApplication {
  constructor (context) {
    super(context)

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
    console.log(this.skyEnv);
    this.scene.add(this.skyEnv);

    const damagedHelmet = new DamagedHelmet(this._renderer);
    this.scene.add(damagedHelmet);

    const geometry = new PlaneGeometry( 200, 200 );
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
    // planeMesh.castShadow = true;
    planeMesh.receiveShadow = true;
    this.scene.add( planeMesh );

    const ambientLight = new AmbientLight( 0xffffff );
    this.scene.add( ambientLight );

    const cubeGeometry = new BoxGeometry(1, 1, 1);
    const material = new MeshStandardMaterial( {
      color: 0xffffff,
      metalness: 1,
      roughness: 1
    } );
    const count = 10;
    const mesh = new InstancedMesh( cubeGeometry, material, count );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    for ( let i = 0; i < count; i ++ ) {

      const matrix = new Matrix4();
      const sc = Math.random();
      if(i===0) matrix.makeTranslation(0, 0.5*i,2)
      else matrix.makeTranslation(0, 0.5*(i-1),0*i)
      mesh.setMatrixAt( i, matrix );
    }

    this.scene.add( mesh );

    this.directionalLight = new DirectionalLight( 0xffffff, 10 );
    this.scene.add( this.directionalLight );
    // const mesh2 = new Mesh( cubeGeometry, material, count );
    //this.scene.add( mesh2 );
    this.onChange();
  }

  onChange(){
    const texture = this.pmremGenerator.fromScene( this.skyEnv ).texture;
    this._scene.environment = texture;
    this.directionalLight.position.copy(this.skyEnv.sun.position);
    // this._renderer.toneMappingExposure = this.skyEnv.exposure;
  }

  animate () {
    this._renderer.render(this.scene, this._camera)
  }
}

export default Main
