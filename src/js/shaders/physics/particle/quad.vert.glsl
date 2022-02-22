#version 300 es
precision highp float;
precision highp int;

in vec2 a_position;

out vec2 v_uv;

void main() {
	gl_Position = vec4(a_position, 0.0, 1.0);
	v_uv = a_position * 0.5 + 0.5;
}
