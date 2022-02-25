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
      gForce = vec4(p_pos, 1.0);
      if (length(p_pos - pos) < 0.001)
      continue;
      vec3 p_vel = texture(u_velTex, uv).xyz;

      vec3 rel_pos = p_pos - pos;
      vec3 rel_vel = p_vel - vel;
      if (length(rel_pos) < u_diameter) {
        int rb_idx = int(texture(u_relPosTex, uv));
        /*if (rb_idx > -1) {
          k = u_kBody;
          n = u_nBody;
        }*/
        spring_total += -k * (u_diameter - length(rel_pos)) * normalize(rel_pos);
        damping_total += n * rel_vel;
      }
    }
  }

  vec3 force = spring_total + damping_total + shear_total;
  vec3 force2 = spring_total;// + damping_total + shear_total;
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
    // gForce = texture(u_relPosTex, v_uv); //force output
  }
  else {
    gForce = vec4(0.0, 0.0, 0.0, 1.0);
  }
  gRelPosTexel = relPosTexel;
}
