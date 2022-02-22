import {
  PerspectiveCamera,
  DataTexture,
  WebGLMultipleRenderTargets,
  RGBAFormat,
  NearestFilter,
  RawShaderMaterial,
  FloatType,
  Mesh,
  Vector3,
  Matrix4,
  OrthographicCamera,
  BufferGeometry,
  Scene,
  Points,
  BufferAttribute,
  Sphere,
  GreaterDepth,
  EqualStencilFunc,
  KeepStencilOp, IncrementStencilOp,
  GLSL3, WebGLRenderTarget, MeshBasicMaterial, PlaneGeometry, LessDepth
} from 'three'
import AbstractApplication from 'views/AbstractApplication'
import {GPUComputationRenderer} from 'three/examples/jsm/misc/GPUComputationRenderer'
import passThrough from 'shaders/physics/passThrough.vert.glsl'
import initFBOFrag from 'shaders/physics/particle/initfbo.frag.glsl'
import particleQuadVert from 'shaders/physics/particle/quad.vert.glsl'
import particleForcesFrag from 'shaders/physics/particle/forces.frag.glsl'
import particleVert from 'shaders/physics/particle/particle.vert.glsl'
import particleFrag from 'shaders/physics/particle/particle.frag.glsl'
import particleEulerFrag from 'shaders/physics/particle/euler.frag.glsl'
import objectBodyEulerFrag from 'shaders/physics/object/bodyEuler.frag.glsl'
import objectBodyForcesFrag from 'shaders/physics/object/bodyForces.frag.glsl'
import particleRk2Frag from 'shaders/physics/particle/rk2.frag.glsl'
import objectBodyRk2Frag from 'shaders/physics/object/bodyRK2.frag.glsl'
import objectSetupFrag from 'shaders/physics/object/setup.frag.glsl'
import objectAmbientVert from 'shaders/physics/object/ambient.vert.glsl'
import objectAmbientFrag from 'shaders/physics/object/ambient.frag.glsl'
import gridVert from 'shaders/physics/grid.vert.glsl'
import gridFrag from 'shaders/physics/grid.frag.glsl'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {greaterThan} from 'three/examples/jsm/renderers/nodes/ShaderNode'

class Main extends AbstractApplication {
  constructor () {
    super()
    this.cameraMat = new Matrix4()
    this.temp = new Vector3()
    this.cfg = {
      pingPong: true,
      scene: 0
    }



    const gl = this.renderer.getContext()
    gl.enable(gl.BLEND)
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

    this._camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
    this._camera.position.set(0, 3, 3.5)
    this._controls = new OrbitControls(this._camera, this._renderer.domElement)
    this._controls.enableDamping = true
    this._controls.enableZoom = true
    this._controls.target.set(0.0, 0.4, 0.0)
    this._controls.rotateSpeed = 0.3
    this._controls.zoomSpeed = 1.0
    this._controls.panSpeed = 2.0

    this.initBuffers()
    this.particleSetup()
    this.setupShaderPrograms()
    this.dummyCamera = new OrthographicCamera()
    // this.sceneDisplayParticles = new Scene()
    this.sceneGridParticles = new Scene()
    this.geometry = new BufferGeometry()
    this.geometry.setAttribute('position', new BufferAttribute(new Float32Array(new Array(this.numParticles[this.sceneIndex]).fill(0)), 1))
    this.geometry.computeBoundingSphere = () => {}
    this.geometry.boundingSphere = new Sphere()
    this.geometry.boundingSphere.radius = 100000
    // this.sceneDisplayParticles.add(new Points(this.geometry, this.shader_display_particles))
    this.sceneGridParticles.add(new Points(this.geometry, this.progGrid))


    console.log(this.fboA)
    const m = new MeshBasicMaterial(({
      map: this.fboA.texture[0]
    }))
    this.scene.add(new Mesh(new PlaneGeometry(4, 4), m))
    console.log(  this.renderer.state)
    this.animate()
  }

  initBuffers () {
    this.numParticles = []
    this.particleSideLength = []
    this.particlePositions = []
    this.particleVelocities = []
    this.forces = []
    this.indices = []
    this.intIndices = []
    this.particleSize = []
    this.bound = []
    this.gridBound = []
    this.k = []
    this.kT = []
    this.kBound = []
    this.n = []
    this.nBound = []
    this.u = []
    this.rigidBodiesEnabled = []
    this.rigidBodiesStatic = []
    this.bodyParticleMass = []
    this.numBodies = []
    this.bodySideLength = []
    this.bodyPositions = []
    this.bodyOrientations = []
    this.bodyForces = []
    this.bodyTorques = []
    this.relativePositions = []
    this.linearMomenta = []
    this.angularMomenta = []
  }

  setupShaderPrograms () {
    this.progPhysics = new RawShaderMaterial({
      uniforms: {
        u_posTex: {value: null},
        u_velTex: {value: null},
        u_relPosTex: {value: null},
        u_particleSideLength: {value: null},
        u_diameter: {value: null},
        u_dt: {value: null},
        u_bound: {value: null},
        u_scene: {value: null},

        //Physics coefficients
        u_k: {value: null},
        u_kT: {value: null},
        u_kBody: {value: null},
        u_kBound: {value: null},
        u_n: {value: null},
        u_nBody: {value: null},
        u_nBound: {value: null},
        u_u: {value: null},

        // Grid uniforms
        u_gridTex: {value: null},
        u_gridSideLength: {value: null},
        u_gridNumCellsPerSide: {value: null},
        u_gridTexSize: {value: null},
        u_gridTexTileDimensions: {value: null},
        u_gridCellSize: {value: null}
      },
      vertexShader: particleQuadVert,
      fragmentShader: particleForcesFrag,
      glslVersion: GLSL3
    })

    // Load particle rendering shader
    this.progParticle = new RawShaderMaterial({
      uniforms: {
        u_cameraMat: {value: null},
        u_cameraPos: {value: null},
        u_fovy: {value: null},
        u_posTex: {value: null},
        u_relPosTex: {value: null},
        u_bodyPosTex: {value: null},
        u_particleSideLength: {value: null},
        u_bodySideLength: {value: null},
        u_diameter: {value: null},
        u_nearPlaneHeight: {value: null}
      },
      vertexShader: particleVert,
      fragmentShader: particleFrag,
      glslVersion: GLSL3
    })

    // Load particle update shader
    this.progEuler = new RawShaderMaterial({
      uniforms: {
        u_posTex: {value: null},
        u_velTex: {value: null},
        u_forceTex: {value: null},
        u_relPosTex: {value: null},
        u_dt: {value: null}
      },
      vertexShader: particleQuadVert,
      fragmentShader: particleEulerFrag,
      glslVersion: GLSL3
    })

    // Load body update shader
    this.progBodyEuler = new RawShaderMaterial({
      uniforms: {
        u_posTex: {value: null},
        u_bodyPosTex: {value: null},
        u_bodyRotTex: {value: null},
        u_bodyForceTex: {value: null},
        u_bodyTorqueTex: {value: null},
        u_linearMomentumTex: {value: null},
        u_angularMomentumTex: {value: null},
        u_particleSideLength: {value: null},
        u_diameter: {value: null},
        u_dt: {value: null}
      },
      vertexShader: particleQuadVert,
      fragmentShader: objectBodyEulerFrag,
      glslVersion: GLSL3
    })

    // Load body update shader
    this.progBodyForces = new RawShaderMaterial({
      uniforms: {
        u_posTex: {value: null},
        u_forceTex: {value: null},
        u_bodyPosTex: {value: null},
        u_bodyRotTex: {value: null},
        u_bodyForceTex: {value: null},
        u_bodyTorqueTex: {value: null},
        u_linearMomentumTex: {value: null},
        u_angularMomentumTex: {value: null},
        u_particleSideLength: {value: null}
      },
      vertexShader: particleQuadVert,
      fragmentShader: objectBodyForcesFrag,
      glslVersion: GLSL3
    })

    // Load particle update shader
    this.progRK2 = new RawShaderMaterial({
      uniforms: {
        u_posTex: {value: null},
        u_velTex1: {value: null},
        u_forceTex1: {value: null},
        u_velTex2: {value: null},
        u_forceTex2: {value: null},
        u_relPosTex: {value: null},
        u_diameter: {value: null},
        u_dt: {value: null}
      },
      vertexShader: particleQuadVert,
      fragmentShader: particleRk2Frag,
      glslVersion: GLSL3
    })

    // Load body update shader
    this.progBodyRK2 = new RawShaderMaterial({
      uniforms: {
        u_posTex: {value: null},
        u_bodyPosTex: {value: null},
        u_bodyRotTex: {value: null},
        u_forceTex_1: {value: null},
        u_forceTex_2: {value: null},
        u_torqueTex_1: {value: null},
        u_torqueTex_2: {value: null},
        u_linearMomentumTex_1: {value: null},
        u_linearMomentumTex_2: {value: null},
        u_angularMomentumTex_1: {value: null},
        u_angularMomentumTex_2: {value: null},
        u_particleSideLength: {value: null},
        u_diameter: {value: null},
        u_dt: {value: null}
      },
      vertexShader: particleQuadVert,
      fragmentShader: objectBodyRk2Frag,
      glslVersion: GLSL3
    })

// Load rigid body particle setup shader
    this.progSetup = new RawShaderMaterial({
      uniforms: {
        u_posTex: {value: null},
        u_velTex: {value: null},
        u_forceTex: {value: null},
        u_bodyPosTex: {value: null},
        u_bodyRotTex: {value: null},
        u_relPosTex: {value: null},
        u_linearMomentumTex: {value: null},
        u_angularMomentumTex: {value: null},
        u_particleSideLength: {value: null},
        u_bodySide: {value: null},
        u_time: {value: null},
        u_scene: {value: null}
      },
      vertexShader: particleQuadVert,
      fragmentShader: objectSetupFrag,
      glslVersion: GLSL3
    })

    // Load rigid body particle setup shader
    this.progAmbient = new RawShaderMaterial({
      uniforms: {
        // Retrieve the uniform and attribute locations
        u_cameraMat: {value: null},
        u_posTex: {value: null}
      },
      vertexShader: objectAmbientVert,
      fragmentShader: objectAmbientFrag,
      glslVersion: GLSL3
    })

    // Load ambient shader for grid generation
    this.progGrid = new RawShaderMaterial({
      uniforms: {
        // Retrieve the uniform and attribute locations
        u_posTex: {value: null},
        u_posTexSize: {value: this.particleSideLength[this.sceneIndex]},
        u_gridSideLength: {value: this.gridBound[this.sceneIndex] * 2.},
        u_gridNumCellsPerSide: {value: this.gridInfo.numCellsPerSide},
        u_gridTexSize: {value: this.gridInfo.gridTexWidth},
        u_gridTexTileDimensions: {value: this.gridInfo.gridTexTileDimensions},
        u_gridCellSize: {value: this.gridInfo.gridCellSize}
      },
      vertexShader: gridVert,
      fragmentShader: gridFrag,
      glslVersion: GLSL3
    })
  }

  particleSetup () {
    this.sceneIndex = 0
    this.initParticleData(this.sceneIndex)
    this.initRigidBodyData(this.sceneIndex)
    this.setupAllBuffers()

    this.toReset = false
  }

  initParticleData (sceneIndex) {
    const exp = 12
    if (exp % 2 != 0) {
      throw new Error('Texture side is not a power of two!')
    }
    this.numParticles[sceneIndex] = Math.pow(2, exp)
    this.particleSideLength[sceneIndex] = Math.sqrt(this.numParticles[sceneIndex])
    // Initialize particle positions
    const positions = []

    const particleMass = 1.0
    for (let i = 0; i < this.numParticles[sceneIndex]; i++) {
      positions.push(Math.random() * 1.0 - 0.5,
        Math.random() * 1.0 + 0.0,
        Math.random() * 1.0 - 0.5,
        particleMass)
    }
    this.particlePositions[sceneIndex] = positions

    // Initialize particle velocities
    const velocities = []
    const velBounds = {
      min: -0.2,
      max: 0.2
    }
    //velocities.push(1.0, 0.0, 0.0, 1.0);
    for (let i = 0; i < this.numParticles[sceneIndex]; i++) {
      velocities.push(Math.random() * (velBounds.max - velBounds.min) + velBounds.min,
        Math.random() * (velBounds.max - velBounds.min) + velBounds.min,
        Math.random() * (velBounds.max - velBounds.min) + velBounds.min, 1.0)
    }
    this.particleVelocities[sceneIndex] = velocities

    // Initialize particle forces
    const forces = []
    for (let i = 0; i < this.numParticles[sceneIndex]; i++) {
      forces.push(0.0, 0.0, 0.0, 1.0)
    }
    this.forces[sceneIndex] = forces

    // Initialize particle indices
    const indices = []
    for (let i = 0; i < this.numParticles[sceneIndex]; i++) {
      indices[i] = i
    }

    /*const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(indices), gl.STATIC_DRAW);
    R.indices[sceneIndex] = indexBuffer;*/
    this.indices[sceneIndex] = indices

    this.timeStep = 0.01

    this.particleSize[sceneIndex] = .1
    this.bound[sceneIndex] = 0.5
    this.gridBound[sceneIndex] = this.bound[sceneIndex] * 1.1

    this.k[sceneIndex] = 800.0
    this.kT[sceneIndex] = 5.0
    this.kBound[sceneIndex] = 2000.0
    this.n[sceneIndex] = 8.0
    this.nBound[sceneIndex] = 40.0
    this.u[sceneIndex] = 0.4

    this.GPU = new GPUComputationRenderer(this.particleSideLength[this.sceneIndex], this.particleSideLength[this.sceneIndex], this.renderer)
  }

  initRigidBodyData (sceneIndex) {
    // Relative particle positions (cube for now) and rigid body index
    const relativePositions = Array(this.numParticles[sceneIndex] * 4).fill(-1.0)
    this.relativePositions[sceneIndex] = relativePositions
  }

  setupAllBuffers () {
    this.setupBuffers('A')
    this.setupBuffers('RK2_A')
    this.setupBuffers('RK2_B')
    this.setupBuffers('RK2_C')
    this.setupBuffers('B')

    this.generateGrid('A')
    this.generateGrid('B')
  }

  setupBuffers (id) {
    const scene = this.sceneIndex
    const w = this.particleSideLength[scene]
    const h = this.particleSideLength[scene]
    console.log(w, h)
    this['fbo' + id] = new WebGLMultipleRenderTargets(w, h, 4)
    const fbo = this['fbo' + id]
    for (let i = 0; i < fbo.texture.length; i++) {

      fbo.texture[i].minFilter = NearestFilter
      fbo.texture[i].magFilter = NearestFilter
      fbo.texture[i].internalFormat = 'RGBA32F'
      fbo.texture[i].format = RGBAFormat
      fbo.texture[i].type = FloatType
      fbo.texture[i].generateMipmaps = false
    }

    console.log(this.particlePositions[scene])
    // Particle positions
    const particlePosTex = new DataTexture(new Float32Array(this.particlePositions[scene]), w, h, RGBAFormat, FloatType)
    particlePosTex.minFilter = NearestFilter
    particlePosTex.magFilter = NearestFilter
    particlePosTex.internalFormat = 'RGBA32F'
    particlePosTex.generateMipmaps = false
    particlePosTex.needsUpdate = true
    console.log(particlePosTex)

    // Particle velocities
    const particleVelTex = new DataTexture(new Float32Array(this.particleVelocities[scene]), w, h, RGBAFormat, FloatType)
    particleVelTex.minFilter = NearestFilter
    particleVelTex.magFilter = NearestFilter
    particleVelTex.internalFormat = 'RGBA32F'
    particleVelTex.generateMipmaps = false

    // Particle forces
    const forceTex = new DataTexture(new Float32Array(this.forces[scene]), w, h, RGBAFormat, FloatType)
    forceTex.minFilter = NearestFilter
    forceTex.magFilter = NearestFilter
    forceTex.internalFormat = 'RGBA32F'
    forceTex.generateMipmaps = false

    // Can't attach different dimension texture to the bodyFBO
    const relativePosTex = new DataTexture(new Float32Array(this.relativePositions[scene]), w, h, RGBAFormat, FloatType)
    relativePosTex.minFilter = NearestFilter
    relativePosTex.magFilter = NearestFilter
    relativePosTex.internalFormat = 'RGBA32F'
    relativePosTex.generateMipmaps = false

    this.initFBOFragment = new RawShaderMaterial({
      uniforms: {
        u_posTex: {value: particlePosTex},
        u_velTex: {value: particleVelTex},
        u_forceTex: {value: forceTex},
        u_relPosTex: {value: relativePosTex}
      },
      vertexShader: passThrough,
      fragmentShader: initFBOFrag,
      glslVersion: GLSL3
    })

    this.GPU.doRenderTarget(this.initFBOFragment, this['fbo' + id])

    /*
    // Particle positions
    this["particlePosTex" + id] = fbo.texture[ 0 ]

    // Particle velocities
    this["particleVelTex" + id] = fbo.texture[ 1 ]

    // Particle forces
    this["forceTex" + id] = fbo.texture[ 2 ]

    // Can't attach different dimension texture to the bodyFBO
    this["relativePosTex" + id] = fbo.texture[ 3 ]*/
  }

  generateGrid (id) {

    this.gridInfo = {}
    this.gridInfo.gridCellSize = this.particleSize[this.sceneIndex]
    this.gridInfo.numCellsPerSide = Math.ceil((this.gridBound[this.sceneIndex]) * 2 / this.gridInfo.gridCellSize)

    // gridTexTileDimensions are the dimensions of the flattened out grid texture in terms of individual
    // 2-dimensional "slices." This is necessary for recreating the 3D texture in the shaders
    this.gridInfo.gridTexTileDimensions = Math.ceil(Math.sqrt(this.gridInfo.numCellsPerSide))

    this.gridInfo.gridTexWidth = this.gridInfo.gridTexTileDimensions * this.gridInfo.numCellsPerSide

    console.log('gridTextTileDimensions', this.gridInfo.gridTexTileDimensions)
    console.log('gridTextWidth', this.gridInfo.gridTexWidth)

    // Initialize grid values to 0
    const gridVals = []
    for (let i = 0; i < Math.pow(this.gridInfo.gridTexWidth, 2.); i++) {
      gridVals.push(0.0, 0.0, 0.0, 0.0)
    }

    //this["gridTex" + id] = createAndBindTexture(R["gridFBO" + id],
    //  gl.COLOR_ATTACHMENT0, this.gridInfo.gridTexWidth, this.gridInfo.gridTexWidth, gridVals);

    // Add depth and stencil attachments
    this['gridFBO' + id] = new WebGLRenderTarget(this.gridInfo.gridTexWidth, this.gridInfo.gridTexWidth, {
      type: FloatType,
      stencilBuffer: true
    })
    // this.createAndBindDepthStencilBuffer(this["gridFBO" + id], this.gridInfo.gridTexWidth, this.gridInfo.gridTexWidth);

  }

  createAndBindDepthStencilBuffer (fbo, sideLengthx, sideLengthy) {
    /*this.depthStencil = new WebGLRenderTarget(sideLengthx, sideLengthy, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBFormat,
      stencilBuffer: true
    })
    const depthStencil = gl.createRenderbuffer();

    gl.bindRenderbuffer(gl.RENDERBUFFER, depthStencil);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, sideLengthx, sideLengthy);

    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, depthStencil);

    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);*/
  }

  particleRender () {
    // RK2 Integration
    //pos in A, vel_1 in A
    //force_1 in rk2b, vel_2 in rk2a, force_2 in A

    if (this.cfg.pingPong) {
      this.updateGrid('A', 'A')
      /*calculateForces(state, R.progPhysics, 'A', 'A', 'RK2_B');
      updateEuler(state, 'A', 'RK2_B', 'RK2_A');

      //A has pp1, pv1 - do not write
      //RK2_B has pf1
      //RK2_A has pp2, pv2, pf1
      updateGrid(state, R.progGrid, 'RK2_A', 'RK2_A');
      calculateForces(state, R.progPhysics, 'RK2_A', 'RK2_A', 'RK2_C');
      //RK2_C has pf2
      updateParticlesRK2(state, R.progRK2, 'A', 'A', 'RK2_A', 'RK2_A', 'RK2_C', 'B');*/

    }

    //updateEuler(state, 'A', 'RK2_B', 'B');

    // Render the particles
    // renderParticles(state, R.progParticle);

    //drawModels(state);

    // drawDebug();

    //only ping pong the buffers if not using the rigid body setup shader since
    //the setup shader transfers the particle data from B to A
    if (!this.rigidBodiesEnabled[this.sceneIndex] && this.cfg.pingPong) {
      // this.pingPong('A', 'B')
    }
  };

  swap (property, a, b) {
    var temp = this[property + a]
    this[property + a] = this[property + b]
    this[property + b] = temp
  }

  pingPong (a, b) {
    this.swap('particlePosTex', a, b)
    this.swap('particleVelTex', a, b)
    this.swap('forceTex', a, b)
    this.swap('relativePosTex', a, b)
    this.swap('fbo', a, b)
  }

  updateGrid (source, target) {
    const uniform = this.progGrid.uniforms;
    uniform.u_posTex.value = this['particlePosTex' + source]
    // uniform.u_posTexSize.value = this.particleSideLength[this.sceneIndex]
    // uniform.u_gridSideLength.value = this.gridBound[this.sceneIndex] * 2. // WARNING: R.bound + constant
    // uniform.u_gridNumCellsPerSide.value = this.gridInfo.numCellsPerSide
    // uniform.u_gridTexSize.value = this.gridInfo.gridTexWidth
    // uniform.u_gridTexTileDimensions.value = this.gridInfo.gridTexTileDimensions
    // uniform.u_gridCellSize.value = this.gridInfo.gridCellSize

    /*gl.useProgram(prog.prog)
    gl.disable(gl.BLEND)
    gl.clearColor(0, 0, 0, 0)

    gl.bindFramebuffer(gl.FRAMEBUFFER, R['gridFBO' + target])
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    gl.viewport(0, 0, R.gridInfo.gridTexWidth, R.gridInfo.gridTexWidth)

    // Bind position texture
    bindTextures(prog, [prog.u_posTex], [R['particlePosTex' + source]])

    gl.uniform1i(prog.u_posTexSize, R.particleSideLength[R.scene])
    gl.uniform1f(prog.u_gridSideLength, R.gridBound[R.scene] * 2.) // WARNING: R.bound + constant
    gl.uniform1i(prog.u_gridNumCellsPerSide, R.gridInfo.numCellsPerSide)
    gl.uniform1i(prog.u_gridTexSize, R.gridInfo.gridTexWidth)
    gl.uniform1i(prog.u_gridTexTileDimensions, R.gridInfo.gridTexTileDimensions)
    gl.uniform1f(prog.u_gridCellSize, R.gridInfo.gridCellSize)

    gl.bindBuffer(gl.ARRAY_BUFFER, R.indices[R.scene])
    gl.enableVertexAttribArray(prog.a_idx)
    gl.vertexAttribPointer(prog.a_idx, 1, gl.FLOAT, gl.FALSE, 0, 0)*/
    const currentRenderTarget = this.renderer.getRenderTarget()
    this.renderer.setRenderTarget(this['gridFBO' + target])
    this.renderer.state.buffers.color.setClear(0,0,0,0)

    // 1 Pass
    this.renderer.state.buffers.color.setMask(true, false, false, false)
    this.renderer.state.buffers.depth.setFunc(LessDepth)
    this.renderer.render(this.sceneGridParticles, this.dummyCamera)

    // Set stencil values
    // 4 passes to fit up to 4 particle indices per pixel
    this.renderer.state.buffers.stencil.setTest(true)
    this.renderer.state.buffers.depth.setFunc(GreaterDepth)
    this.renderer.state.buffers.stencil.setFunc(EqualStencilFunc, 0, 0xFF)
    this.renderer.state.buffers.stencil.setOp(KeepStencilOp, KeepStencilOp, IncrementStencilOp)
    this.renderer.render(this.sceneGridParticles, this.dummyCamera)
    // gl.enable(gl.STENCIL_TEST)
    // gl.depthFunc(gl.GREATER)
    // gl.stencilFunc(gl.EQUAL, 0, 0xFF)
    // gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR)

    // 2 Pass
    this.renderer.state.buffers.color.setMask(false, true, false, false)
    this.renderer.state.buffers.stencil.setClear(true)
    this.renderer.render(this.sceneGridParticles, this.dummyCamera)
    // gl.colorMask(false, true, false, false)
    // gl.clear(gl.STENCIL_BUFFER_BIT)
    // gl.drawArrays(gl.POINTS, 0, R.numParticles[R.scene])


    // 3 Pass
    this.renderer.state.buffers.color.setMask(false, false, true, false)
    this.renderer.state.buffers.stencil.setClear(true)
    this.renderer.render(this.sceneGridParticles, this.dummyCamera)
    // gl.colorMask(false, false, true, false)
    // gl.clear(gl.STENCIL_BUFFER_BIT)
    // gl.drawArrays(gl.POINTS, 0, R.numParticles[R.scene])

    // 4 Pass
    this.renderer.state.buffers.color.setMask(false, false, false, true)
    this.renderer.state.buffers.stencil.setClear(true)
    this.renderer.render(this.sceneGridParticles, this.dummyCamera)
    // gl.colorMask(false, false, false, true)
    // gl.clear(gl.STENCIL_BUFFER_BIT)
    // gl.drawArrays(gl.POINTS, 0, R.numParticles[R.scene])


    this.renderer.state.buffers.stencil.setTest(false)
    this.renderer.state.buffers.depth.setFunc(LessDepth)
    this.renderer.state.buffers.color.setMask(true, true, true, true)
    this.renderer.state.buffers.color.setClear(.8, .8, .8, 1)
    // gl.disable(gl.STENCIL_TEST)
    // gl.depthFunc(gl.LESS)
    // gl.colorMask(true, true, true, true)
    // gl.enable(gl.BLEND)
    // gl.clearColor(.8, .8, .8, 1)
    this.renderer.setRenderTarget(currentRenderTarget)

  }

  animate (timestamp) {
    requestAnimationFrame(this.animate.bind(this))
    this._controls.update()
    this.camera.updateMatrixWorld()
    // camera.matrixWorldInverse.getInverse(camera.matrixWorld);
    this.camera.matrixWorldInverse.copy(this.camera.matrixWorld).invert()
    this.cameraMat.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse)
    this.camera.getWorldPosition(this.temp)
    this.particleRender()
    this._renderer.render(this._scene, this._camera)
  }
}

export default Main
