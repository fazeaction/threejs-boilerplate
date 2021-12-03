uniform float sides;
uniform float angle;
uniform sampler2D tInput;
varying vec2 vUv;

void main() {

  if (sides == 0.0) {

    gl_FragColor = texture2D( tInput, vUv );

  } else {

    // normalize to the center
    vec2 p = vUv - 0.5;
    // cartesian to polar coordinates
    float r = length(p);
    float a = atan(p.y, p.x) + angle;
    // kaleidoscope
    float tau = 2. * 3.1416 ;
    a = mod(a, tau/sides);
    a = abs(a - tau/sides/2.) ;
    // polar to cartesian coordinates
    p = r * vec2(cos(a), sin(a));
    // sample the input texture
    vec4 color = texture2D(tInput, p + 0.5);
    gl_FragColor = color;

  }

}
