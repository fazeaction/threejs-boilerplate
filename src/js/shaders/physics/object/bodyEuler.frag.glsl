precision highp float;
precision highp int;

//run on each rigidbody

uniform sampler2D u_posTex;
uniform sampler2D u_bodyPosTex;
uniform sampler2D u_bodyRotTex;
uniform sampler2D u_bodyForceTex;
uniform sampler2D u_bodyTorqueTex;
uniform sampler2D u_linearMomentumTex;
uniform sampler2D u_angularMomentumTex;
uniform int u_particleSide;
uniform float u_diameter;
uniform float u_dt;

out vec4 outColor[6];
in vec2 v_uv;

const float EPSILON = 0.0000001;

vec2 getUV(int idx, int side) {
    float v = float(idx / side) / float(side);
    float u = float(idx - (idx / side) * side) / float(side);
    return vec2(u, v);
}

mat3 rot_from_quat(vec4 q) {
  return mat3(
    1.0-2.0*q.y*q.y-2.0*q.z*q.z, 2.0*q.x*q.y+2.0*q.w*q.z, 2.0*q.x*q.z-2.0*q.w*q.y,
    2.0*q.x*q.y+2.0*q.w*q.z, 1.0-2.0*q.x*q.x-2.0*q.z*q.z, 2.0*q.y*q.z+2.0*q.w*q.x,
    2.0*q.x*q.z+2.0*q.w*q.y, 2.0*q.y*q.z-2.0*q.w*q.x, 1.0-2.0*q.x*q.x-2.0*q.y*q.y
  );
}

vec4 quat_mult(vec4 q1, vec4 q2) {
   vec4 qr;
   qr.x = (q1.w * q2.x) + (q1.x * q2.w) + (q1.y * q2.z) - (q1.z * q2.y);
   qr.y = (q1.w * q2.y) - (q1.x * q2.z) + (q1.y * q2.w) + (q1.z * q2.x);
   qr.z = (q1.w * q2.z) + (q1.x * q2.y) - (q1.y * q2.x) + (q1.z * q2.w);
   qr.w = (q1.w * q2.w) - (q1.x * q2.x) - (q1.y * q2.y) - (q1.z * q2.z);
   return qr;
 }

mat3 transposeMat(mat3 m) {
  return mat3(m[0][0], m[1][0], m[2][0],
              m[0][1], m[1][1], m[2][1],
              m[0][2], m[1][2], m[2][2]);
}

void main() {
    vec3 bodyPos = texture(u_bodyPosTex, v_uv).xyz;
    vec4 bodyRot = texture(u_bodyRotTex, v_uv);
    vec4 bodyForce = texture(u_bodyForceTex, v_uv);
    vec4 bodyTorque = texture(u_bodyTorqueTex, v_uv);
    vec3 linearMomentum = texture(u_linearMomentumTex, v_uv).xyz;
    vec3 angularMomentum = texture(u_angularMomentumTex, v_uv).xyz;
    float bodyMass = texture(u_angularMomentumTex, v_uv).w;
    float startIndex = texture(u_bodyPosTex, v_uv).w;
    float numParticles = texture(u_linearMomentumTex, v_uv).w;

    float mass = texture(u_posTex, getUV(int(startIndex), u_particleSide)).w;
    //update position
    vec3 linearVel = linearMomentum / (numParticles * mass);
    vec3 newPos = bodyPos + linearVel * u_dt;
    outColor[0] = vec4(newPos, startIndex);

    //update rotation
    //use cube moment of inertia for now - 6/(m*s^2)
    float inverseMomentComponent = 6.0/((numParticles * mass) * (4.0 * u_diameter * u_diameter));
    mat3 inverseMomentOfInertia = mat3(
        inverseMomentComponent, 0.0, 0.0,
        0.0, inverseMomentComponent, 0.0,
        0.0, 0.0, inverseMomentComponent
    );
    mat3 bodyRotMatrix = rot_from_quat(normalize(bodyRot));
    mat3 inverseInertiaTensor = bodyRotMatrix * inverseMomentOfInertia * transposeMat(bodyRotMatrix);
    vec3 angularVelocity = inverseInertiaTensor * angularMomentum;
    vec3 theta = angularVelocity * u_dt / 2.0;
    float angle = length(theta);
    float s;
    vec4 deltaQuat;
    if (angle * angle * angle * angle / 24.0 < EPSILON) {
        deltaQuat.w = 1.0 - angle * angle / 2.0;
        s = 1.0 - angle * angle / 6.0;
    }
    else {
        deltaQuat.w = cos(angle);
        s = sin(angle) / angle;
    }
    deltaQuat.xyz = theta * s;
    outColor[1] = quat_mult(deltaQuat, bodyRot);

    outColor[2] = bodyForce;
    outColor[3] = bodyTorque;

    //update linear velocity
    linearMomentum += bodyForce.xyz * u_dt;
    outColor[4] = vec4(linearMomentum, numParticles);

    //update angular momentum
    angularMomentum *= 0.9; //damping
    angularMomentum += bodyTorque.xyz * u_dt;
    outColor[5] = vec4(angularMomentum, 0.0);
}
