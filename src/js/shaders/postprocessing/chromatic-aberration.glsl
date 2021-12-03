/*
https://github.com/spite/relooper/tree/main/shaders
*/

import { shader as rgb_spectrum } from "./rgb_spectrum.js";
#pragma glslify: noise = require('shaders/postprocessing/rgb_spectrum')

const shader = `
vec2 barrelDistortion(vec2 coord, float amt) {
  vec2 cc = coord - 0.5;
  float dist = dot(cc, cc);
  return coord + cc * dist * amt;
}

${rgb_spectrum}

const float max_distort = 2.2;
const int num_iter = 12;
const float reci_num_iter_f = 1.0 / float(num_iter);
vec4 chromaticAberration(sampler2D inputTexture, vec2 uv, float amount) {

  vec4 sumcol = vec4(0.0);
  vec4 sumw = vec4(0.0);
  for ( int i=0; i<num_iter;++i )
  {
    float t = float(i) * reci_num_iter_f;
    vec4 w = spectrum_offset( t );
    sumw += w;
    sumcol += w * texture2D( inputTexture, barrelDistortion(uv, amount * max_distort*t ));
  }

  return sumcol / sumw;
}
`;

export { shader };
