import * as THREE from 'three'
import 'scripts/controls/VRControls'
import 'scripts/effects/VREffect'
import 'webvr-polyfill'
import WebVRManager from 'webvr-boilerplate'

class AbstractVRApplication{
    constructor(){
        this._camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
        this._camera.position.z = 400;

        this._controls = new THREE.VRControls( this._camera );

        this._scene = new THREE.Scene();

        this._renderer = new THREE.WebGLRenderer();
        this._renderer.setPixelRatio( window.devicePixelRatio );
        this._renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this._renderer.domElement );


        this._effect = new THREE.VREffect(this._renderer);
        this._effect.setSize(window.innerWidth, window.innerHeight);

        this._manager = new WebVRManager(this._renderer, this._effect, {hideButton: false});

        window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
        this.animate();

    }

    get renderer(){

        return this._renderer;

    }

    get camera(){

        return this._camera;

    }

    get scene(){

        return this._scene;

    }


    onWindowResize() {

        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize( window.innerWidth, window.innerHeight );

    }

    animate(timestamp) {
        requestAnimationFrame( this.animate.bind(this) );
        this._controls.update();
        this._manager.render(this._scene, this._camera, timestamp);

    }


}
export default AbstractVRApplication;