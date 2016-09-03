import * as THREE from 'three'
import AbstractApplication from 'scripts/views/AbstractApplication'
const glslify = require('glslify')
const shaderVert = glslify('./../shaders/custom.vert')
const shaderFrag = glslify('./../shaders/custom.frag')

class Main extends AbstractApplication {
    constructor(){

        super();

        var texture = new THREE.TextureLoader().load( 'textures/crate.gif' );

        var geometry = new THREE.BoxGeometry( 200, 200, 200 );
        var material = new THREE.MeshBasicMaterial( { map: texture } );

        var material2 = new THREE.ShaderMaterial({
            vertexShader: shaderVert,
            fragmentShader: shaderFrag
        });


        this._mesh = new THREE.Mesh( geometry, material2 );
        this._scene.add( this._mesh );

        this.animate();

    }

}
export default Main;