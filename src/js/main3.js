import {
  Line,
  Float32BufferAttribute,
  BufferGeometry,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  AmbientLight,
  CameraHelper,
  MeshStandardMaterial,
  sRGBEncoding,
  ACESFilmicToneMapping,
  PCFSoftShadowMap,
  PMREMGenerator,
  DoubleSide,
  PlaneGeometry
} from 'three'
import AbstractApplication from 'views/AbstractApplication'
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper';
import {e_wireframe_blocker} from './models/assets'
import { SkyEnvironment } from '@/js/environments/Sky';
import {DirectionalLight} from './lights/DirectionalLight'
import { ShadowMapViewer } from 'three/examples/jsm/utils/ShadowMapViewer';

class Main extends AbstractApplication {
  constructor () {
    super()

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

    const geometry = new BufferGeometry();
    // const material = new LineBasicMaterial( { vertexColors: true } );
    const material = new MeshStandardMaterial();

    const vertices = e_wireframe_blocker.vertices.flat();
    const normals = e_wireframe_blocker.normals.flat();
    const uvs = e_wireframe_blocker.coords.flat();
    const indices = e_wireframe_blocker.triangles.flat();

    geometry.setIndex( indices );
    geometry.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
    geometry.setAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );
    geometry.setAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );
    // geometry.setAttribute( 'color', new Float32BufferAttribute( colors, 3 ) );

    geometry.computeBoundingSphere();
    geometry.computeVertexNormals();

    const mesh = new Mesh( geometry, material );
    mesh.receiveShadow = true; //default is false
    mesh.castShadow = true; //default is false
    mesh.material.map = this.scene.background
    mesh.material.metalness = 1
    // mesh.material.roughness = 1
    mesh.material.side = DoubleSide
    mesh.position.y = 0;
    this.scene.add( mesh );

    this.directionalLight = new DirectionalLight( 0xffffff, 1 );
    this.directionalLight.shadow.camera.far = 45000*1.2; // default
    this.directionalLight.shadow.camera.right = 4500 * 0.5;
    this.directionalLight.shadow.camera.left = - 4500 * 0.5;
    this.directionalLight.shadow.camera.top	= 4500 * 0.5;
    this.directionalLight.shadow.camera.bottom = - 4500 * 0.5;
    this.scene.add( this.directionalLight );
    const light = new AmbientLight( 0xffffff ); // soft white light
    this.scene.add( light );
    const vnh = new VertexNormalsHelper( mesh, 1 );
    this.scene.add( vnh );

    const geometryPlane = new PlaneGeometry( 20000, 20000 );
    const materialGround = new MeshStandardMaterial( {
      color: 0xffffff,
      metalness: 0,
      roughness: 1
    } );

    const planeMesh = new Mesh( geometryPlane, materialGround );
    planeMesh.material.map = this.scene.background
    planeMesh.material.metalness = 1
    planeMesh.material.side = DoubleSide
    planeMesh.position.y = 0;
    planeMesh.rotation.x = - Math.PI * 0.5;
    planeMesh.castShadow = false;
    planeMesh.receiveShadow = true;
    this.scene.add( planeMesh );

    this.scene.add( new CameraHelper( this.directionalLight.shadow.camera ) );

    this.onChange();
    this.animate()
  }

  onChange(){
    const texture = this.pmremGenerator.fromScene( this.skyEnv ).texture;
    this.scene.environment = texture;
    this.directionalLight.position.copy(this.skyEnv.sun.position).multiplyScalar(4500);
    this._renderer.toneMappingExposure = this.skyEnv.exposure;
  }

  animate (timestamp) {
    requestAnimationFrame(this.animate.bind(this))
    this._renderer.render(this.scene, this._camera)
  }
}

export default Main
