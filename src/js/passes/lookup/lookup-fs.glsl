#define LUT_FLIP_Y

in vec2 vUv;
out vec4 outColor;

uniform vec2 resolution;
uniform sampler2D tDiffuse;
uniform sampler2D uLookup;

vec4 lookup(in vec4 textureColor, in sampler2D lookupTable) {


	textureColor = clamp(textureColor, 0.0, 1.0);

    float blueColor = textureColor.b * 63.0;

    vec2 quad1;
    quad1.y = floor(floor(blueColor) / 8.0);
    quad1.x = floor(blueColor) - (quad1.y * 8.0);

    vec2 quad2;
    quad2.y = floor(ceil(blueColor) / 8.0);
    quad2.x = ceil(blueColor) - (quad2.y * 8.0);

    vec2 texPos1;
    texPos1.x = (quad1.x * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * textureColor.r);
    texPos1.y = (quad1.y * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * textureColor.g);

 	#ifdef LUT_FLIP_Y
 	    texPos1.y = 1.0-texPos1.y;
 	#endif


    vec2 texPos2;
    texPos2.x = (quad2.x * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * textureColor.r);
    texPos2.y = (quad2.y * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * textureColor.g);

    #ifdef LUT_FLIP_Y
       	texPos2.y = 1.0-texPos2.y;
    #endif


    vec4 newColor1 = texture(lookupTable, texPos1);
    vec4 newColor2 = texture(lookupTable, texPos2);

    vec4 newColor = mix(newColor1, newColor2, fract(blueColor));
    return newColor;
}



void main() {

	vec4 color = texture(tDiffuse, vUv);

  outColor = lookup(color, uLookup);

}
