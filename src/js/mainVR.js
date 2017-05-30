// forked from https://threejs.org/examples/?q=vr#webvr_cubes

import 'three'
import AbstractVRApplication from 'views/AbstractVRApplication'
import WEBVR from 'three/examples/js/vr/WebVR'
import shaderVert from 'shaders/custom.vert'
import shaderFrag from 'shaders/custom.frag'
//import noiseMaterial from 'js/materials/noise'

class Main extends AbstractVRApplication {
    constructor(){

        super();

        this.clock = new THREE.Clock();
        this.isMouseDown = false;
        this.INTERSECTED = null;

        this.crosshair = new THREE.Mesh(
            new THREE.RingGeometry( 0.02, 0.04, 32 ),
            new THREE.MeshBasicMaterial( {
                color: 0xffffff,
                opacity: 0.5,
                transparent: true
            } )
        );
        this.crosshair.position.z = - 2;
        this.camera.add( this.crosshair );

        this.room = new THREE.Mesh(
            new THREE.BoxGeometry( 6, 6, 6, 8, 8, 8 ),
            new THREE.MeshBasicMaterial( { color: 0x404040, wireframe: true } )
        );

        this.scene.add( this.room );

        this.scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

        const light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 ).normalize();
        this.scene.add( light );

        const geometry = new THREE.BoxGeometry( 0.15, 0.15, 0.15 );

        for ( let i = 0; i < 200; i ++ ) {

            const object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

            object.position.x = Math.random() * 4 - 2;
            object.position.y = Math.random() * 4 - 2;
            object.position.z = Math.random() * 4 - 2;

            object.rotation.x = Math.random() * 2 * Math.PI;
            object.rotation.y = Math.random() * 2 * Math.PI;
            object.rotation.z = Math.random() * 2 * Math.PI;

            object.scale.x = Math.random() + 0.5;
            object.scale.y = Math.random() + 0.5;
            object.scale.z = Math.random() + 0.5;

            object.userData.velocity = new THREE.Vector3();
            object.userData.velocity.x = Math.random() * 0.01 - 0.005;
            object.userData.velocity.y = Math.random() * 0.01 - 0.005;
            object.userData.velocity.z = Math.random() * 0.01 - 0.005;

            this.room.add( object );

        }

        this.raycaster = new THREE.Raycaster();

        this.renderer.setClearColor( 0x505050 );
        this.renderer.sortObjects = false;

        this.renderer.domElement.addEventListener( 'mousedown', this.onMouseDown.bind(this), false );
        this.renderer.domElement.addEventListener( 'mouseup', this.onMouseUp.bind(this), false );
        this.renderer.domElement.addEventListener( 'touchstart', this.onMouseDown.bind(this), false );
        this.renderer.domElement.addEventListener( 'touchend', this.onMouseUp.bind(this), false );

        this.animate()

    }

    onMouseDown() {

        this.isMouseDown = true;

    }

    onMouseUp() {

        this.isMouseDown = false;

    }

    onWindowResize() {

        super.onWindowResize();
        this.effect.setSize( window.innerWidth, window.innerHeight );

    }

    animate() {

        this.effect.requestAnimationFrame( this.animate.bind(this) );
        this.render();

    }

    render() {

        const delta = this.clock.getDelta() * 60;

        if ( this.isMouseDown === true ) {

            const cube = this.room.children[ 0 ];
            this.room.remove( cube );

            cube.position.set( 0, 0, - 0.75 );
            cube.position.applyQuaternion( this.camera.quaternion );
            cube.userData.velocity.x = ( Math.random() - 0.5 ) * 0.02 * delta;
            cube.userData.velocity.y = ( Math.random() - 0.5 ) * 0.02 * delta;
            cube.userData.velocity.z = ( Math.random() * 0.01 - 0.05 ) * delta;
            cube.userData.velocity.applyQuaternion( this.camera.quaternion );
            this.room.add( cube );

        }

        this.raycaster.setFromCamera( { x: 0, y: 0 }, this.camera );

        const intersects = this.raycaster.intersectObjects( this.room.children );

        if ( intersects.length > 0 ) {

            if ( this.INTERSECTED != intersects[ 0 ].object ) {

                if ( this.INTERSECTED ) this.INTERSECTED.material.emissive.setHex( this.INTERSECTED.currentHex );

                this.INTERSECTED = intersects[ 0 ].object;
                this.INTERSECTED.currentHex = this.INTERSECTED.material.emissive.getHex();
                this.INTERSECTED.material.emissive.setHex( 0xff0000 );

            }

        } else {

            if ( this.INTERSECTED ) this.INTERSECTED.material.emissive.setHex( this.INTERSECTED.currentHex );

            this.INTERSECTED = undefined;

        }

        // Keep cubes inside room

        for ( let i = 0; i < this.room.children.length; i ++ ) {

            const cube = this.room.children[ i ];

            cube.userData.velocity.multiplyScalar( 1 - ( 0.001 * delta ) );

            cube.position.add( cube.userData.velocity );

            if ( cube.position.x < - 3 || cube.position.x > 3 ) {

                cube.position.x = THREE.Math.clamp( cube.position.x, - 3, 3 );
                cube.userData.velocity.x = - cube.userData.velocity.x;

            }

            if ( cube.position.y < - 3 || cube.position.y > 3 ) {

                cube.position.y = THREE.Math.clamp( cube.position.y, - 3, 3 );
                cube.userData.velocity.y = - cube.userData.velocity.y;

            }

            if ( cube.position.z < - 3 || cube.position.z > 3 ) {

                cube.position.z = THREE.Math.clamp( cube.position.z, - 3, 3 );
                cube.userData.velocity.z = - cube.userData.velocity.z;

            }

            cube.rotation.x += cube.userData.velocity.x * 2 * delta;
            cube.rotation.y += cube.userData.velocity.y * 2 * delta;
            cube.rotation.z += cube.userData.velocity.z * 2 * delta;

        }

        this.controls.update();
        this.effect.render(this.scene, this.camera);

    }

}
export default Main;