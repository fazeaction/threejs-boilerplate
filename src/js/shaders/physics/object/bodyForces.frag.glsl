precision highp float;
precision highp int;

uniform sampler2D u_posTex;
uniform sampler2D u_forceTex;
uniform sampler2D u_bodyPosTex;
uniform sampler2D u_bodyRotTex;
uniform sampler2D u_bodyForceTex;
uniform sampler2D u_bodyTorqueTex;
uniform sampler2D u_linearMomentumTex;
uniform sampler2D u_angularMomentumTex;
uniform int u_particleSide;

in vec2 v_uv;
layout(location = 0) out vec4 gBodyPosTexel;
layout(location = 1) out vec4 gBodyRotTexel;
layout(location = 2) out vec4 gTotalForce;
layout(location = 3) out vec4 gTotalTorque;
layout(location = 4) out vec4 gLinearMomentumTexel;
layout(location = 5) out vec4 gAngularMomentumTexel;

vec2 getUV(int idx, int side) {
    float v = float(idx / side) / float(side);
    float u = float(idx - (idx / side) * side) / float(side);
    return vec2(u, v);
}

void main() {
    vec4 bodyPosTexel = texture(u_bodyPosTex, v_uv);
    vec4 linearMomentumTexel = texture(u_linearMomentumTex, v_uv);
    vec3 bodyPos = bodyPosTexel.xyz;
    float startIndex = bodyPosTexel.w;
    float numParticles = linearMomentumTexel.w;

    vec3 totalForce = vec3(0.0);
    vec3 totalTorque = vec3(0.0);
    for (int i = 0; i < 1048576; i++) {
        if (i < int(startIndex))
            continue;
        if (i == int(startIndex + numParticles))
            break;

        vec2 uv = getUV(i, u_particleSide);
        vec3 pos = texture(u_posTex, uv).xyz;
        vec3 force = texture(u_forceTex, uv).xyz;
        totalForce += force;
        vec3 rel_pos = pos - bodyPos;
        totalTorque += cross(rel_pos, force);
    }

    gBodyPosTexel = bodyPosTexel;
    gBodyRotTexel = texture(u_bodyRotTex, v_uv);
//    gTotalForce = texture(u_bodyForceTex, v_uv);
//    gTotalTorque = texture(u_bodyTorqueTex, v_uv);
    gTotalForce = vec4(totalForce, 1.0);
    gTotalTorque = vec4(totalTorque, 1.0);
    gLinearMomentumTexel = linearMomentumTexel;
    gAngularMomentumTexel = texture(u_angularMomentumTex, v_uv);
}
