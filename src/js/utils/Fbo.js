import {
  WebGLRenderTarget,
  ClampToEdgeWrapping,
  LinearFilter,
  RGBAFormat,
  UnsignedByteType,
  WebGLMultisampleRenderTarget,
} from "three";

const defaultOptions = {
  wrapS: ClampToEdgeWrapping,
  wrapT: ClampToEdgeWrapping,
  minFilter: LinearFilter,
  magFilter: LinearFilter,
  format: RGBAFormat,
  type: UnsignedByteType,
  stencilBuffer: false,
  depthBuffer: true,
}

export class Fbo {
  constructor (w, h, options = {}, antialiased = false) {
    const rt = antialiased? WebGLMultisampleRenderTarget : WebGLRenderTarget;
    return new rt(w, h, {defaultOptions, ...options});
  }
}
