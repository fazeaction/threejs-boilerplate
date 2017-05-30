precision mediump float;

// glslify fancy imports
import noise from 'glsl-noise/simplex/3d';

varying vec2 vUv;

void main () {
  float n = noise(vec3(vUv.xy * 10.0, 1.0));
  n = smoothstep(0.0, 0.1, n);

  // glslify-hex allows for the color strings
  vec3 color = mix(vec3(1.0,0.0,1.0), vec3(0.0,1.0,0.0), n);
  gl_FragColor = vec4(color, 1.0);
}
