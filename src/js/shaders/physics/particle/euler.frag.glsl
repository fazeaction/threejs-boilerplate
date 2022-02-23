precision highp float;
precision highp int;

uniform sampler2D u_posTex;
uniform sampler2D u_velTex;
uniform sampler2D u_forceTex;
uniform sampler2D u_relPosTex;
uniform float u_dt;

in vec2 v_uv;
out vec4 outColor[4];

void main() {
    vec4 posTexel = texture(u_posTex, v_uv);
    vec4 velTexel = texture(u_velTex, v_uv);
    vec4 forceTexel = texture(u_forceTex, v_uv);
    vec4 relPosTexel = texture(u_relPosTex, v_uv);
    int index = int(relPosTexel.w);
    int isActive = int(velTexel.w);
//    int isActive = 1;
    if (index == -1 && isActive == 1) {
        vec3 pos = posTexel.xyz;
        vec3 vel = velTexel.xyz;
        vec3 force = forceTexel.xyz;
        float mass = posTexel.w;

        vec3 newPos = pos + vel * u_dt;
        vec3 newVel = vel + (force / mass) * u_dt;

        //Update position and velocity
        outColor[0] = vec4(newPos, mass);
        outColor[1] = vec4(newVel, velTexel.w);
        outColor[2] = forceTexel;
        outColor[3] = relPosTexel;
    }
    else {
        outColor[0] = posTexel;
        outColor[1] = velTexel;
        outColor[2] = forceTexel;
        outColor[3] = relPosTexel;
    }
}
