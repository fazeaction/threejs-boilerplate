/*
https://github.com/spite/relooper/tree/main/shaders
*/

const shader = `
float smootherstep(float edge0, float edge1, float x) {
  x = clamp((x - edge0)/(edge1 - edge0), 0.0, 1.0);
  return x*x*x*(x*(x*6. - 15.) + 10.);
}
`;

export { shader };
