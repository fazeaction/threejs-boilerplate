import * as THREE from 'three'
import dat from 'dat-gui'
import WAGNER from '@superguigui/wagner/'
import AbstractApplication from 'scripts/views/AbstractApplication'
import BoxBlurPass from '@superguigui/wagner/src/passes/box-blur/BoxBlurPass'
import FXAAPass from '@superguigui/wagner/src/passes/fxaa/FXAAPass'
import ZoomBlurPassfrom from '@superguigui/wagner/src/passes/zoom-blur/ZoomBlurPass'
import MultiPassBloomPass from '@superguigui/wagner/src/passes/bloom/MultiPassBloomPass'

class Main extends AbstractApplication {

    constructor() {

        super();
        this.cubes = [];

        this.params = {
            usePostProcessing: true,
            useFXAA: true,
            useBlur: false,
            useBloom: true
        };

        const light = new THREE.PointLight(0xFFFFFF, 1);
        light.position.copy(this._camera.position);
        this._scene.add(light);

        this.material = new THREE.MeshPhongMaterial({color: 0x3a9ceb});
        let c;
        for (let i = 0; i < 500; i++) {
            c = this.addCube();
            this.cubes.push(c);
            this._scene.add(c);
        }
        //c.position.set(0, 0, 50);

        this.initPostprocessing();
        this.initGui();

        this.animate();

    }

    addCube() {
        let cube = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), this.material);
        cube.position.set(
            Math.random() * 600 - 300,
            Math.random() * 600 - 300,
            Math.random() * -500
        );
        cube.rotation.set(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
        );
        return cube;
    }

    initPostprocessing() {
        this._renderer.autoClearColor = true;
        this.composer = new WAGNER.Composer(this._renderer);
        this.fxaaPass = new FXAAPass();
        this.boxBlurPass = new BoxBlurPass(3, 3);
        this.bloomPass = new MultiPassBloomPass({
            blurAmount: 2,
            applyZoomBlur: true
        });
    }

    initGui() {
        const gui = new dat.GUI();
        gui.add(this.params, 'usePostProcessing');
        gui.add(this.params, 'useFXAA');
        gui.add(this.params, 'useBlur');
        gui.add(this.params, 'useBloom');
        return gui;
    }

    animate() {
        super.animate();

        for (let i = 0; i < this.cubes.length; i++) {
            this.cubes[i].rotation.y += 0.01 + ((i - this.cubes.length) * 0.00001);
            this.cubes[i].rotation.x += 0.01 + ((i - this.cubes.length) * 0.00001);
        }

        if (this.params.usePostProcessing) {
            this.composer.reset();
            this.composer.render(this._scene, this._camera);
            if (this.params.useFXAA) this.composer.pass(this.fxaaPass);
            if (this.params.useBlur) this.composer.pass(this.boxBlurPass);
            if (this.params.useBloom) this.composer.pass(this.bloomPass);
            this.composer.toScreen();
        }
        else {
            this._renderer.render(this._scene, this._camera);
        }



    }

}
export default Main;