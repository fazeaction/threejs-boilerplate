import {
  DirectionalLight as THREEDirectionalLight
} from 'three';

export class DirectionalLight extends THREEDirectionalLight {
  constructor(color=0xffffff, intensity=1){
    super(color, intensity);
    this.castShadow = true;
    this.shadow.mapSize.width = 512; // default
    this.shadow.mapSize.height = 512; // default
    this.shadow.camera.near = 0.5; // default
    this.shadow.camera.far = 500; // default
  }
}
