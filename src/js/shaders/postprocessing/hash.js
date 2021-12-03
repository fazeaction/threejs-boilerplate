/*
https://github.com/spite/relooper/tree/main/shaders
*/

const shader = `
vec2 hash( vec2 p ) {
	p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}`;

export { shader };
