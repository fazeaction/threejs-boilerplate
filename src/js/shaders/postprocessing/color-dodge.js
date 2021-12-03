/*
https://github.com/spite/relooper/tree/main/shaders
*/

const shader = `
vec4 colorDodge(vec4 base, vec4 blend) {
  vec4 color = vec4( blend / ( 1.-base) );
  return color;
}`;

export { shader };
