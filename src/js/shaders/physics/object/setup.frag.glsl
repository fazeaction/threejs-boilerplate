precision highp float;
precision highp int;

//run on each particle, write to A particle pos/vel tex

uniform sampler2D u_posTex;
uniform sampler2D u_velTex;
uniform sampler2D u_forceTex;
uniform sampler2D u_bodyPosTex;
uniform sampler2D u_bodyRotTex;
uniform sampler2D u_relPosTex;
uniform sampler2D u_linearMomentumTex;
uniform sampler2D u_angularMomentumTex;
uniform int u_particleSide;
uniform int u_bodySide;
uniform float u_time;
uniform int u_scene;

in vec2 v_uv;
out vec4 outColor[4];

vec4 quat_from_axis_angle(vec3 axis, float angle) {
  vec4 qr;
  float half_angle = (angle * 0.5) * 3.14159 / 180.0;
  qr.x = axis.x * sin(half_angle);
  qr.y = axis.y * sin(half_angle);
  qr.z = axis.z * sin(half_angle);
  qr.w = cos(half_angle);
  return qr;
}

vec4 quat_conj(vec4 q) {
  return vec4(-q.x, -q.y, -q.z, q.w);
}

vec4 quat_mult(vec4 q1, vec4 q2) {
  vec4 qr;
  qr.x = (q1.w * q2.x) + (q1.x * q2.w) + (q1.y * q2.z) - (q1.z * q2.y);
  qr.y = (q1.w * q2.y) - (q1.x * q2.z) + (q1.y * q2.w) + (q1.z * q2.x);
  qr.z = (q1.w * q2.z) + (q1.x * q2.y) - (q1.y * q2.x) + (q1.z * q2.w);
  qr.w = (q1.w * q2.w) - (q1.x * q2.x) - (q1.y * q2.y) - (q1.z * q2.z);
  return qr;
}

vec3 rotate_pos(vec3 pos, vec4 q) {
    return quat_mult(quat_mult(q, vec4(pos, 0.0)), quat_conj(q)).xyz;
}

vec2 getUV(int idx, int side) {
    float v = float(idx / side) / float(side);
    float u = float(idx - (idx / side) * side) / float(side);
    return vec2(u, v);
}

// Calculate the position and velocity of each rigid body particle in world space
void main() {
    vec4 posTexel = texture(u_posTex, v_uv);
    vec4 velTexel = texture(u_velTex, v_uv);
    vec4 forceTexel = texture(u_forceTex, v_uv);
    vec4 relPosTexel = texture(u_relPosTex, v_uv);
    int index = int(relPosTexel.w);
    if (index > -1) {
        vec2 uv = getUV(index, u_bodySide);
        vec4 bodyPos = texture(u_bodyPosTex, uv);
        vec4 bodyRot = texture(u_bodyRotTex, uv);
        vec4 linearMomentumTexel = texture(u_linearMomentumTex, uv);
        vec3 linearMomentum = linearMomentumTexel.xyz;
        float mass = posTexel.w;
        float numParticles = linearMomentumTexel.w;
        vec3 linearVel = linearMomentum / (numParticles * mass);
        vec3 angularMomentum = texture(u_angularMomentumTex, uv).xyz;

        vec3 currRelPos = rotate_pos(relPosTexel.xyz, bodyRot);
        vec3 pos = bodyPos.xyz + currRelPos;
        if (u_scene == 3) {
            pos += vec3(0.7 * sin(u_time/2.0), 0.0, 0.0);
        }
        vec3 vel = linearVel + cross(angularMomentum, currRelPos);
        outColor[0] = vec4(pos, mass);
        outColor[1] = vec4(vel, 1.0);
        outColor[2] = forceTexel;
        outColor[3] = relPosTexel;
    }
    else {
        float y = (v_uv.y - 0.5 / float(u_particleSide)) * float(u_particleSide);
        float x = (v_uv.x - 0.5 / float(u_particleSide)) * float(u_particleSide);
        int index = int(y * float(u_particleSide) + x);

        if (u_scene == 1 && int(velTexel.w) == 0 &&
            abs(u_time * 500.0) > float(u_particleSide*u_particleSide - index)) {
//            float t = clamp(abs(cos(u_time)), 0.5, 1.0) * sign(cos(u_time));
            float t = 0.3 + (cos(u_time * 2.0) + 1.0) * 0.25;
            outColor[0] = vec4(0.29 * t * sin(float(index)),
                1.7,
                0.29 * t * cos(float(index)), posTexel.w);
            outColor[1] = vec4(0.0, 0.0, 0.0, 1.0);
        }
        else {
            outColor[0] = posTexel;
            outColor[1] = velTexel;
        }
        outColor[2] = forceTexel;
        outColor[3] = relPosTexel;
    }
}
