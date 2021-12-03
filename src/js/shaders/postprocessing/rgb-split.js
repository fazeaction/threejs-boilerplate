/*
https://github.com/spite/relooper/tree/main/shaders
*/

import { shader as rgb_spectrum } from "./rgb_spectrum.js";

const shader = `

${rgb_spectrum}

const float max_distort = 2.2;
const int num_iter = 12;
const float reci_num_iter_f = 1.0 / float(num_iter);

vec4 rgbSplit(sampler2D map, vec2 uv, vec2 amount) {
  vec4 sumcol = vec4(0.0);
  vec4 sumw = vec4(0.0);

  for ( int i=0; i<num_iter;++i ) {
    float t = float(i) * reci_num_iter_f;
    vec4 w = spectrum_offset( t );
    sumw += w;
    sumcol += w * texture( map, uv+vec2(t*amount) );
  }

  return sumcol / sumw;
}
`;

export { shader };
