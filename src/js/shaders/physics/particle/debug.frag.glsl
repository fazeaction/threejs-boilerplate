#version 300 es

precision highp float;
precision highp int;

uniform sampler2D u_posTex;
uniform sampler2D u_velTex;
uniform sampler2D u_forceTex;
uniform sampler2D u_gridTex;
uniform sampler2D u_bodyPosTex;
uniform sampler2D u_bodyRotTex;
uniform sampler2D u_linearMomentumTex;
uniform sampler2D u_angularMomentumTex;
uniform sampler2D u_relPosTex;
// uniform sampler2D u_depth0;
// uniform sampler2D u_depth1;
// uniform sampler2D u_voxel;
uniform sampler2D u_bodyForceTex;
uniform sampler2D u_bodyTorqueTex;

in vec2 v_uv;
out vec4 outColor;

float rand(float f){
    vec2 co = vec2(f);
    return clamp(fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453), 0.1, 0.7);
}

void main() {
    float num_tex = 4.0;

    if (v_uv.y < 0.5) {
        if (v_uv.x < 1./num_tex) {
            vec4 pos = texture(u_posTex, vec2(v_uv.x * num_tex, v_uv.y * 2.0));
            outColor = pos;
        } else if (v_uv.x > 1./num_tex && v_uv.x < 2./num_tex) {
            vec4 vel = texture(u_velTex, vec2(v_uv.x * num_tex - 1.0, v_uv.y * 2.0));
            outColor = abs(vel);
        } else if (v_uv.x > 2./num_tex && v_uv.x < 3./num_tex) {
            vec4 force = texture(u_forceTex, vec2(v_uv.x * num_tex - 2.0, v_uv.y * 2.0));
            outColor = abs(force);
        } else if (v_uv.x > 3./num_tex && v_uv.x < 4./num_tex) {
            vec4 grid = texture(u_gridTex, vec2(v_uv.x * num_tex - 3.0, v_uv.y * 2.0));
            outColor = vec4(grid.rgb * .005, 1);
//            vec4 relPos = texture(u_relPosTex, vec2(v_uv.x * num_tex - 3.0, v_uv.y * 2.0));
//            vec3 color = vec3(rand(relPos.w), rand(relPos.w+1.0), rand(relPos.w+2.0));
//            gl_FragColor = vec4(vec3(rand(relPos.w), rand(relPos.w+1.0), rand(relPos.w+2.0)), 1.0);
        } else if (v_uv.x > 4./num_tex && v_uv.x < 5./num_tex) {
        //     vec4 depth = texture(u_depth0, vec2(v_uv.x * num_tex - 4.0, v_uv.y * 2.0));
        //     gl_FragColor = vec4(depth.xyz, 1);
        // } else if (v_uv.x > 5./num_tex) {
            // vec4 voxel = texture(u_voxel, vec2(v_uv.x * num_tex - 5.0, v_uv.y * 2.0));
            // gl_FragColor = voxel;
//            vec4 relPos = texture(u_relPosTex, vec2(v_uv.x * num_tex - 4.0, v_uv.y * 2.0));
//            gl_FragColor = vec4(vec3((relPos.w + 1.0)), 1.0);
        }
    }
//    else {
//        if (v_uv.x < 1./num_tex) {
//            vec4 bodyPos = texture(u_bodyPosTex, vec2(v_uv.x * num_tex, v_uv.y * 2.0 - 1.0));
//            gl_FragColor = vec4(abs(bodyPos.xyz), 1.0);
////            gl_FragColor = vec4(vec3(bodyPos.w) / 36.0, 1.0);
//        } else if (v_uv.x > 1./num_tex && v_uv.x < 2./num_tex) {
//            vec4 bodyRot = texture(u_bodyRotTex, vec2(v_uv.x * num_tex - 1.0, v_uv.y * 2.0 - 1.0));
//            gl_FragColor = bodyRot;
//        } else if (v_uv.x > 2./num_tex && v_uv.x < 3./num_tex) {
//            vec4 vel = texture(u_linearMomentumTex, vec2(v_uv.x * num_tex - 2.0, v_uv.y * 2.0 - 1.0));
//            gl_FragColor = vec4(abs(vel).xyz, 1.0);
//
////            vec4 torque = texture(u_bodyTorqueTex, vec2(v_uv.x * num_tex - 2.0, v_uv.y * 2.0 - 1.0));
////            gl_FragColor = vec4(abs(torque).xyz, 1.0);
////        } else if (v_uv.x > 3./num_tex) {
////            vec4 momentum = texture(u_angularMomentumTex, vec2(v_uv.x * num_tex - 3.0, v_uv.y * 2.0 - 1.0));
////            gl_FragColor = vec4(abs(momentum).xyz, 1.0);
//
//            vec4 relPos = texture(u_relPosTex, vec2(v_uv.x * num_tex - 3.0, v_uv.y * 2.0 - 1.0));
//            gl_FragColor = vec4(abs(relPos.xyz), 1.0);
////            gl_FragColor = vec4(vec3((relPos.w+1.0)/4.0), 1.0);
//
////            vec4 pos = texture(u_posTex, vec2(v_uv.x * num_tex - 3.0, v_uv.y * 2.0 - 1.0));
////            gl_FragColor = pos;
//
////            vec4 force = texture(u_bodyForceTex, vec2(v_uv.x * num_tex - 3.0, v_uv.y * 2.0 - 1.0));
////            gl_FragColor = vec4(abs(force.xyz), 1.0);
//        }
//    }

}
