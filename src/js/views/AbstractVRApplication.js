import 'three'
import 'three/examples/js/controls/VRControls'
import 'three/examples/js/effects/VREffect'
import 'webvr-polyfill'
import * as webvrui from 'webvr-ui'


class AbstractVRApplication{
    constructor(){

        this._camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10 );

        this._controls = new THREE.VRControls( this._camera );

        this._scene = new THREE.Scene();
        this._scene.add(this._camera);

        this._renderer = new THREE.WebGLRenderer();
        this._renderer.setPixelRatio( window.devicePixelRatio );
        this._renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this._renderer.domElement );


        const uiVR = `<div id="ui">
                        <div id="vr-button"></div>
                        <a id="magic-window" href="#">Try it without a headset</a>
                      </div>`
        document.body.insertAdjacentHTML( 'beforeend', uiVR );

        const uiOptions = {
            color: 'black',
            background: 'white',
            corners: 'square'
        };

        this._vrButton = new webvrui.EnterVRButton(this._renderer.domElement, uiOptions);
        this._vrButton.on('exit', () => {
            this._camera.quaternion.set(0, 0, 0, 1);
            this._camera.position.set(0, this._controls.userHeight, 0);
        });
        this._vrButton.on('hide', function() {
            document.getElementById('ui').style.display = 'none';
        });
        this._vrButton.on('show', function() {
            document.getElementById('ui').style.display = 'inherit';
        });
        document.getElementById('vr-button').appendChild(this._vrButton.domElement);
        document.getElementById('magic-window').addEventListener('click', () => {
            this._vrButton.requestEnterFullscreen();
        });


        this._effect = new THREE.VREffect(this._renderer);
        this._effect.setSize(window.innerWidth, window.innerHeight);

        window.addEventListener( 'resize', this.onWindowResize.bind(this), false );

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

    get effect(){

        return this._effect;

    }

    get controls(){

        return this._controls;

    }


    onWindowResize() {

        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize( window.innerWidth, window.innerHeight );

    }

    animate(timestamp) {
        this._effect.requestAnimationFrame( this.animate.bind(this) );
        this._controls.update();
        this._effect.render(this._scene, this._camera);

    }


}
export default AbstractVRApplication;