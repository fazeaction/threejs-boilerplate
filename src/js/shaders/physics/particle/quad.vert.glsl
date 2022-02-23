precision highp float;
precision highp int;

in vec3 position;

out vec2 v_uv;

void main() {
	gl_Position = vec4(position, 1.0);
	v_uv = vec2(position.xy) * 0.5 + 0.5;
}
