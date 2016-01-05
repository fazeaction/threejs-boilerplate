import THREE from 'three'
import AbstractApplication from 'scripts/views/AbstractApplication'
import shaderVert from 'shaders/custom.vert'
import shaderFrag from 'shaders/custom.frag'

class Main extends AbstractApplication {
    constructor(){

        super();

        var texture = THREE.ImageUtils.loadTexture( 'textures/crate.gif' );

        var geometry = new THREE.BoxGeometry( 200, 200, 200 );
        var material = new THREE.MeshBasicMaterial( { map: texture } );

        var material2 = new THREE.ShaderMaterial({
            vertexShader: shaderVert,
            fragmentShader: shaderFrag
        });


        this._mesh = new THREE.Mesh( geometry, material2 );
        this._scene.add( this._mesh );

    }

}
export default Main;