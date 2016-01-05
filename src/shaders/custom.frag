import noise from 'glsl-noise/simplex/2d'

void main() {

  float brightness = noise(gl_FragCoord.xx);

    //gl_FragColor = vec4(vec3(brightness), 1.0);
    gl_FragColor = vec4(vec3(1.0,0.0,0.0), 0.0);

}