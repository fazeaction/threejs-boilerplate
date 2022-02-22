#version 300 es

precision highp float;
precision highp int;

uniform sampler2D u_posTex;
uniform sampler2D u_velTex1;
uniform sampler2D u_forceTex1;
uniform sampler2D u_velTex2;
uniform sampler2D u_forceTex2;
uniform sampler2D u_relPosTex;
uniform float u_diameter;
uniform float u_dt;

layout(location = 0) out vec4 gPosTexel;
layout(location = 1) out vec4 gVelTexel_1;
layout(location = 2) out vec4 gForceTexel_1;
layout(location = 3) out vec4 gRelPosTexel;
in vec2 v_uv;

void main() {
    vec4 posTexel = texture(u_posTex, v_uv);
    vec4 velTexel_1 = texture(u_velTex1, v_uv);
    vec4 velTexel_2 = texture(u_velTex2, v_uv);
    vec4 forceTexel_1 = texture(u_forceTex1, v_uv);
    vec4 forceTexel_2 = texture(u_forceTex2, v_uv);
    vec4 relPosTexel = texture(u_relPosTex, v_uv);
    int index = int(texture(u_relPosTex, v_uv).w);
    int isActive = int(velTexel_1.w);
//    int isActive = 1;
    if (index == -1 && isActive == 1) {
        vec3 pos = posTexel.xyz;
        vec3 vel_1 = velTexel_1.xyz;
        vec3 force_1 = forceTexel_1.xyz;
        vec3 vel_2 = velTexel_2.xyz;
        vec3 force_2 = forceTexel_2.xyz;
        float mass = posTexel.w;

        vec3 newPos = pos + ((u_dt / 2.0) * (vel_1 + vel_2));
        vec3 newVel = vel_1 + ((u_dt / 2.0) * (force_1/mass + force_2/mass));

    	//Update position and velocity
        gPosTexel = vec4(newPos, mass);
        gVelTexel_1 = vec4(newVel, velTexel_1.w);
        gForceTexel_1 = texture(u_forceTex1, v_uv);
        gRelPosTexel = relPosTexel;
    }
    else {
        gPosTexel = posTexel;
        gVelTexel_1 = velTexel_1;
        gForceTexel_1 = forceTexel_1;
        gRelPosTexel = relPosTexel;
    }
}
