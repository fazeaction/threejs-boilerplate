import * as THREE from 'three'
import AbstractVRApplication from 'scripts/views/AbstractVRApplication'

const glslify = require('glslify')
const shaderVert = glslify('./../shaders/custom.vert')
const shaderFrag = glslify('./../shaders/custom.frag')
const noiseMaterial = require('materials/noise')

class Main extends AbstractVRApplication {
    constructor(){

        super();

        var texture = new THREE.TextureLoader().load( 'textures/crate.gif' );

        var geometry = new THREE.BoxGeometry( 200, 200, 200 );
        var material = new THREE.MeshBasicMaterial( { map: texture } );

        var material2 = new THREE.ShaderMaterial({
            vertexShader: shaderVert,
            fragmentShader: shaderFrag
        });
        this._mesh = new THREE.Mesh( geometry, material2);//noiseMaterial );
        this._mesh.position.set(0,0,-300);
        //const mat1 = noiseMaterial();
        //this._mesh = new THREE.Mesh( geometry, mat1 );

        this._scene.add( this._mesh );

        this.animate();

    }

}
export default Main;