import {
  Object3D
} from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoughnessMipmapper } from 'three/examples/jsm/utils/RoughnessMipmapper.js';

export class DamagedHelmet extends Object3D {
  constructor(renderer){
    super();
    const roughnessMipmapper = new RoughnessMipmapper( renderer );

    const loader = new GLTFLoader().setPath( 'static/models/gltf/DamagedHelmet/glTF/' );
    loader.load( 'DamagedHelmet.gltf', ( gltf )=> {

      gltf.scene.traverse( function ( child ) {

        if ( child.isMesh ) {
          child.castShadow = true; //default is false
          roughnessMipmapper.generateMipmaps( child.material );

        }

      } );

      roughnessMipmapper.dispose();
      this.add(gltf.scene);

    } );

  }
}
