// from https://github.com/mattdesl/lwjgl-basics/blob/master/test/res/shadertut/lesson3.frag

uniform sampler2D tInput;
varying vec2 vUv;

uniform vec3 color;
uniform float amount;

void main() {
  vec4 texColor = texture2D(tInput, vUv);

  float gray = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));

  vec3 sepiaColor = vec3(gray) * color;

  texColor.rgb = mix(texColor.rgb, vec3(sepiaColor), amount);

  gl_FragColor = texColor;
}
