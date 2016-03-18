import {vec3, mat4} from 'gl-matrix';
import worldLightSHD from 'shaders/world_light.frag';
import passThroughSHD from 'shaders/pass_through.vert';
import {$, getWebGLContext, getPixelRatio, deg2Rad, elapsedTime, randNum, randRGBInt, flatten, flatten2Buffer, flatten2UIntBuffer, flatten2IndexBuffer, noise3} from 'util';

import icosphere from 'icosphere';
import makeShader from 'gl-shader';
import makeBuffer from 'gl-buffer';

// Be forewarned: OpenGL LOVES global variables and state
const canvas = document.getElementById('maincanvas');
const gl = getWebGLContext(canvas);
const PI = Math.PI;
const TWO_PI = 2 * Math.PI;

const state = new (function State(canvas) {
  this.isTap = false;
  this.isDown = false;
  this.listeners = [];

  this.down = (x, y) => {
    this.isTap = true;
    this.isDown = true;
    this.fire('down', x, y);
  }

  this.move = (x, y) => {
    if (this.isDown) {
      this.isTap = false;
      this.fire('move', x, y);
    }
  }

  this.up = (x, y) => {
    this.isDown = false;
    if (this.isTap) {
      this.isTap = false;
      this.fire('tap', x, y);
    }
    this.fire('up', x, y);
  }

  this.listen = (name, fn) => {
    this.listeners.push({
      evt: name,
      fn: fn
    })
  }

  this.fire = (name, ...args) => {
    this.listeners.forEach((item) => {
      if (item.evt === name) {
        item.fn.apply(null, args);
      }
    });
  }

  canvas.addEventListener('mousedown', (e) => this.down(e.pageX, e.pageY))
  canvas.addEventListener('mouseup', (e) => this.up(e.pageX, e.pageY))
  canvas.addEventListener('mousemove', (e) => this.move(e.pageX, e.pageY))
  canvas.addEventListener('touchstart', (e) => {
    let {pageX, pageY} = e.touches[0];
    this.down(pageX, pageY);
  });
  canvas.addEventListener('touchend', (e) => {
    let {pageX, pageY} = e.touches[0];
    this.up(pageX, pageY);
  })
  canvas.addEventListener('touchmove', (e) => {
    let {pageX, pageY} = e.touches[0];
    this.move(pageX, pageY);
  })
})(canvas);

state.listen('tap', (x, y) => {
  let force = vec3.sub(vec3.create(), viewMatrices.cameraTarget, viewMatrices.cameraPosition);
  vec3.normalize(force, force);
  vec3.scale(force, force, 10);
  applyForce(force);
})

state.listen('move', (x, y) => {

})

state.listen('up', (x, y) => {

})

const viewMatrices = {};
const modelNode = {
  position: vec3.create(),
  velocity: vec3.create(),
  acceleration: vec3.create(),
  mass: 20,
  spring: 0.3,
  damping: 0.5,
  rotation: mat4.create(),
  scale: vec3.fromValues(1, 1, 1),
};

const theEarth = postProcessIcoMesh(icosphere(4));
const theEarthVBO = buildVboStruct(gl, theEarth);

const earthShader = makeShader(gl, passThroughSHD, worldLightSHD);

function postProcessIcoMesh(complex) {
  let vertices = complex.positions;
  let faceIndices = complex.cells;

  let expandedPositions = [];
  let normals = vertices.map(() => vec3.create());
  let colors = vertices.map(() => randRGBInt());

  faceIndices.forEach((face, idx) => {
    let [i0, i1, i2] = face;

    let v0 = vertices[i0];
    let v1 = vertices[i1];
    let v2 = vertices[i2];

    let side1 = vec3.sub(vec3.create(), v1, v0);
    let side2 = vec3.sub(vec3.create(), v2, v0);
    let faceNormal = vec3.cross(vec3.create(), side1, side2);

    let n1 = normals[i0];
    let n2 = normals[i1];
    let n3 = normals[i2];

    vec3.add(n1, n1, faceNormal);
    vec3.add(n2, n2, faceNormal);
    vec3.add(n3, n3, faceNormal);
  });

  normals.forEach((n) => vec3.normalize(n, n));

  return {
    vertices, normals, colors,
    indices: faceIndices
  };
}

function buildVboStruct(gl, mesh) {
  let verticesData = flatten2Buffer(mesh.vertices, 3);
  let normalsData = flatten2Buffer(mesh.normals, 3);
  let colorsData = flatten2UIntBuffer(mesh.colors, 4);

  let indices = flatten2IndexBuffer(mesh.indices, 3);

  return {
    // Mesh information
    numVertices: indices.length,
    // Buffers and buffer information
    verticesBuffer: makeBuffer(gl, verticesData),
    normalsBuffer: makeBuffer(gl, normalsData),
    colorsBuffer: makeBuffer(gl, colorsData),
    meshIndexes: makeBuffer(gl, indices, gl.ELEMENT_ARRAY_BUFFER)
  };
}

function getModelMatrix(node) {
  let combinedMatrix = mat4.create();
  mat4.translate(combinedMatrix, combinedMatrix, node.position);
  mat4.multiply(combinedMatrix, combinedMatrix, node.rotation);
  mat4.scale(combinedMatrix, combinedMatrix, node.scale);
  return combinedMatrix;
}

function getOffsets(mesh, offsetX) {
  return mesh.vertices.map((v, idx) => {
    return vec3.scale(vec3.create(), mesh.normals[idx], noise3(3.2 * (v[0] + offsetX), 3.2 * v[1], 3.2 * v[2]) * 0.09);
  });
}

function setup() {
  let innerWidth = window.innerWidth;
  let innerHeight = window.innerHeight;
  let pixelRatio = getPixelRatio();
  let canvasWidth = innerWidth * pixelRatio;
  let canvasHeight = innerHeight * pixelRatio;

  gl.canvas.width = canvasWidth;
  gl.canvas.height = canvasHeight;
  gl.canvas.style.width = innerWidth + 'px';
  gl.canvas.style.height = innerHeight + 'px';
  gl.viewport(0, 0, canvasWidth, canvasHeight);

  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
  gl.frontFace(gl.CCW);

  viewMatrices.projectionMatrix = mat4.perspective(mat4.create(), deg2Rad(25), canvasWidth / canvasHeight, 0.01, 50);
  viewMatrices.cameraPosition = vec3.fromValues(0, 0, 6);
  viewMatrices.cameraTarget = vec3.fromValues(0, 0, 0);
  viewMatrices.cameraUp = vec3.fromValues(0, 1, 0);
  viewMatrices.viewMatrix = mat4.lookAt(mat4.create(), viewMatrices.cameraPosition, viewMatrices.cameraTarget, viewMatrices.cameraUp);

  viewMatrices.noiseOffset = 0.0;
}

function applyForce(forceVec) {
  let accel = vec3.scale(forceVec, forceVec, 1 / modelNode.mass);
  vec3.add(modelNode.acceleration, modelNode.acceleration, accel);
}

function velocityInDir(velvec, dirvec) {
  // dot(v, normalize(dirvec)) * normalize(dirvec)
  let normdir = vec3.normalize(vec3.create(), dirvec);
  let dirmag = vec3.dot(velvec, normdir);
  return vec3.scale(normdir, normdir, dirmag);
}

function draw() {
  // Animation
  mat4.rotateY(modelNode.rotation, modelNode.rotation, -0.003 * PI);
  viewMatrices.noiseOffset += 0.003;

  let origin = vec3.fromValues(0, 0, 0);
  let toOrigin = vec3.sub(vec3.create(), origin, modelNode.position);
  let force = vec3.scale(vec3.create(), toOrigin, modelNode.spring);
  let velocityToOrigin = velocityInDir(modelNode.velocity, toOrigin);
  let damping = vec3.scale(velocityToOrigin, velocityToOrigin, modelNode.damping);
  vec3.sub(force, force, damping);

  applyForce(force);

  vec3.add(modelNode.velocity, modelNode.velocity, modelNode.acceleration);
  vec3.add(modelNode.position, modelNode.position, modelNode.velocity);
  vec3.scale(modelNode.acceleration, modelNode.acceleration, 0);

  let offsets = getOffsets(theEarth, viewMatrices.noiseOffset);
  let offsetBuf = makeBuffer(gl, flatten2Buffer(offsets, 3));

  // Drawing
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  let lightPosition = vec3.add(vec3.create(), viewMatrices.cameraPosition, vec3.fromValues(4, 10, 4));

  // Draw the Earth
  earthShader.bind();

  earthShader.uniforms.u_lightWorldPosition = lightPosition;
  // earthShader.uniforms.u_lightWorldPosition = viewMatrices.cameraPosition;
  earthShader.uniforms.u_projectionMatrix = viewMatrices.projectionMatrix;
  earthShader.uniforms.u_worldViewMatrix = viewMatrices.viewMatrix;

  let modelMatrix = getModelMatrix(modelNode);
  earthShader.uniforms.u_modelWorldMatrix = modelMatrix;

  let modelMatrixIT = mat4.transpose(mat4.create(), mat4.invert(mat4.create(), modelMatrix));
  earthShader.uniforms.u_modelWorldMatrix_IT = modelMatrixIT;

  theEarthVBO.verticesBuffer.bind();
  earthShader.attributes.a_position.pointer();

  theEarthVBO.normalsBuffer.bind();
  earthShader.attributes.a_normal.pointer();

  theEarthVBO.colorsBuffer.bind();
  earthShader.attributes.a_color.pointer(gl.UNSIGNED_BYTE, true);

  offsetBuf.bind();
  earthShader.attributes.a_offset.pointer();

  theEarthVBO.meshIndexes.bind();

  gl.drawElements(gl.TRIANGLES, theEarthVBO.numVertices, gl.UNSIGNED_SHORT, 0);
}

function prepareGLBuffer(bufferData, bufferUsage) {
  let bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, bufferData, bufferUsage);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return bufferId;
}

let loop = () => { draw(), requestAnimationFrame(loop); }

// Setup once, then infinite draw
setup();
loop();
