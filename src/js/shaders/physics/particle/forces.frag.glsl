#version 300 es

precision highp float;
precision highp int;

uniform sampler2D u_posTex;
uniform sampler2D u_velTex;
uniform sampler2D u_gridTex;
uniform sampler2D u_relPosTex;

uniform int u_particleSide;
uniform float u_diameter;
uniform float u_dt;
uniform float u_bound;
uniform int u_scene;

// Spring coefficients
uniform float u_k;
uniform float u_kT;
uniform float u_kBody;
uniform float u_kBound;

// Damping coefficient
uniform float u_n;
uniform float u_nBody;
uniform float u_nBound;

// Friction coefficient
uniform float u_u;

// Grid uniforms
uniform float u_gridSideLength;
uniform int u_gridNumCellsPerSide;
uniform int u_gridTexSize;
uniform int u_gridTexTileDimensions;
uniform float u_gridCellSize;

in vec2 v_uv;
layout(location = 0) out vec4 gPosTexel;
layout(location = 1) out vec4 gVelTexel;
layout(location = 2) out vec4 gForce;
layout(location = 3) out vec4 gRelPosTexel;


const float EPSILON = 0.0000001;

vec2 uvFrom3D(vec3 pos) {
    float u = pos.x + float(u_gridNumCellsPerSide) * (pos.z - float(u_gridTexTileDimensions) * floor(pos.z / float(u_gridTexTileDimensions)));

    float v = pos.y + float(u_gridNumCellsPerSide) * floor(pos.z / float(u_gridTexTileDimensions));

    return (floor(vec2(u, v)) + .5) / float(u_gridTexSize);
}

vec2 getUV(int idx, int side) {
    float v = float(idx / side) / float(side);
    float u = float(idx - (idx / side) * side) / float(side);
    return vec2(u, v);
}

void main() {
    vec4 posTexel = texture(u_posTex, v_uv);
    vec4 velTexel = texture(u_velTex, v_uv);
    vec4 relPosTexel = texture(u_relPosTex, v_uv);
    int index = int(relPosTexel.w);

    float mass = posTexel.w;

    // Spring coefficient
    float k = u_k;
    float k_t = u_kT;
    float bounds_k = u_kBound;

    // Damping coefficient
    float n = u_n;
    float bounds_n = u_nBound;
    // Friction coefficient
    float u = u_u;

    vec3 spring_total = vec3(0.0);
    vec3 damping_total = vec3(0.0);
    vec3 shear_total = vec3(0.0);
    vec3 pos = posTexel.xyz;
    vec3 vel = velTexel.xyz;

    // Just using naive for now for consistency across different machines
    if (true) {
         // Naive loop through all particles
         // Hack because WebGL cannot compare loop index to non-constant expression
         // Maximum of 1024x1024 = 1048576 for now
         for (int i = 0; i < 1048576; i++) {
             if (i == u_particleSide * u_particleSide)
                 break;

             vec2 uv = getUV(i, u_particleSide);

             vec3 p_pos = texture(u_posTex, uv).xyz;
             if (length(p_pos - pos) < 0.001)
                 continue;
             vec3 p_vel = texture(u_velTex, uv).xyz;

             vec3 rel_pos = p_pos - pos;
             vec3 rel_vel = p_vel - vel;
             if (length(rel_pos) < u_diameter) {
                 int rb_idx = int(texture(u_relPosTex, uv));
                 if (rb_idx > -1) {
                     k = u_kBody;
                     n = u_nBody;
                 }
                 spring_total += -k * (u_diameter - length(rel_pos)) * normalize(rel_pos);
                 damping_total += n * rel_vel;
             }
         }
    }
    else {
        //////////
        // GRID //
        //////////
        // Loop through 27 cells in grid
        vec3 voxelIndex = (vec3(pos) - vec3(-u_gridSideLength / 2., -u_gridSideLength / 2., -u_gridSideLength / 2.)) / u_gridCellSize;
        voxelIndex = floor(voxelIndex);
        for (int i = -1; i < 2; i++) {
            for (int i2 = -1; i2 < 2; i2++) {
                for (int i3 = -1; i3 < 2; i3++) {
                    vec3 neighborVoxelIndex = voxelIndex + vec3(i, i2, i3);
                    if (neighborVoxelIndex.x < 0. || neighborVoxelIndex.y < 0. || neighborVoxelIndex.z < 0.) {
                        continue;
                    }
                    if (neighborVoxelIndex.x >= float(u_gridNumCellsPerSide) || neighborVoxelIndex.y >= float(u_gridNumCellsPerSide) ||
                        neighborVoxelIndex.z >= float(u_gridNumCellsPerSide)) {
                            continue;
                    }

                    vec2 neighborGridUV = uvFrom3D(neighborVoxelIndex);

                    vec4 p_idx = texture(u_gridTex, neighborGridUV);
                    for (int c = 0; c < 4; c++) {
                        if (p_idx[c] == 0.) {
                            continue;
                        }
                        vec2 uv;
                        // Kind of hacky - setting particle with index 0.0 to 0.5
                        if (abs(p_idx[c] - .5) < EPSILON) {
                            uv = getUV(0, u_particleSide);
                        } else {
                            uv = getUV(int(p_idx[c]), u_particleSide);
                        }

                        vec3 p_pos = texture(u_posTex, uv).xyz;
                        int rb_idx = int(texture(u_relPosTex, uv));

                        if (length(p_pos - pos) < 0.0001 || (rb_idx > -1 && rb_idx == index))
                            continue;
                        vec3 p_vel = texture(u_velTex, uv).xyz;

                        vec3 rel_pos = p_pos - pos;
                        if (length(rel_pos) < u_diameter) {
                            if (rb_idx > -1) {
                                k = u_kBody;
                                n = u_nBody;
                            }
                            spring_total += -k * (u_diameter - length(rel_pos)) * normalize(rel_pos);
    //                        if (rb_idx > -1) {
    //                            spring_total.y += 10.0;
    //                        }

                            vec3 rel_vel = p_vel - vel;
                            damping_total += n * rel_vel;

    //                        vec3 rel_vel_tangent = rel_vel - dot(rel_vel, normalize(rel_pos)) * normalize(rel_pos);
    //                        shear_total += k_t * rel_vel_tangent;
                        }
                    }
                }
            }
        }
        // END GRID
    }

    vec3 force = spring_total + damping_total + shear_total;
    force.y -= 9.8 * mass;

    //Predict next position
    vec3 newPos = pos + vel * u_dt;

    //Boundary conditions
    vec3 dir = normalize(vel);
//    bool applyFriction = false;
    if (newPos.y < u_diameter / 2.0) {
        force.y += 9.8 * mass;
        force.y += bounds_k * (u_diameter / 2.0 - newPos.y) * 1.0;
        force.y -= bounds_n * vel.y;
        //friction = u*n = u*m*g opposite the direction of movement along the ground
        force += -1.0 * normalize(vec3(dir.x, 0, dir.z)) * u * 9.8 * mass;
    }
    if (abs(newPos.x) > u_bound) {
        force.x += bounds_k * (u_bound - abs(newPos.x)) * sign(newPos.x);
        force.x -= bounds_n * vel.x;
    }
    if (abs(newPos.z) > u_bound) {
        force.z += bounds_k * (u_bound - abs(newPos.z)) * sign(newPos.z);
        force.z -= bounds_n * vel.z;
    }

    // reduce popping
    force = clamp(force, -100.0, 100.0);

    gPosTexel = posTexel;
    gVelTexel = velTexel;
    if (int(velTexel.w) == 1) {
        gForce = vec4(force, 1.0); //force output
    }
    else {
        gForce = vec4(0.0, 0.0, 0.0, 1.0);
    }
    gRelPosTexel = relPosTexel;
}
