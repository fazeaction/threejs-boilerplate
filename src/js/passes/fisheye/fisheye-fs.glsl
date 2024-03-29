// http://github.prideout.net/barrel-distortion/

in vec2 vUv;
out vec4 outColor;
uniform sampler2D tDiffuse;
uniform float power;

const float PI = 3.1415926535;

vec2 Distort(vec2 p)
{
	float theta  = atan(p.y, p.x);
	float radius = length(p);
	radius = pow(radius, power);
	p.x = radius * cos(theta);
	p.y = radius * sin(theta);
	return 0.5 * (p + 1.0);
}

void main() {

	vec2 xy = 2.0 * vUv.xy - 1.0;
	vec2 uv;
	float d = length(xy);

	if (d < 1.0){
		uv = Distort(xy);
	} else {
		uv = vUv.xy;
	}

	vec4 color = texture(tDiffuse, uv);

  outColor = color;

}
