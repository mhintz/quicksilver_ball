import {vec3, mat4} from 'gl-matrix';
import worldLightSHD from 'shaders/world_light.frag';
import passThroughSHD from 'shaders/pass_through.vert';
import {$, getWebGLContext, getPixelRatio, deg2Rad, elapsedTime, randNum, randRGBInt, flatten, flatten2Buffer, flatten2UIntBuffer, flatten2IndexBuffer, noise3} from 'util';

import icosphere from 'icosphere';
import makeShader from 'gl-shader';
import makeBuffer from 'gl-buffer';

// Be forewarned: OpenGL LOVES global variables and state
const gl = getWebGLContext(document.getElementById('maincanvas'));
const PI = Math.PI;
const TWO_PI = 2 * Math.PI;

const viewMatrices = {};

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
    modelPosition: vec3.create(),
    modelRotationMatrix: mat4.create(),
    modelScale: vec3.fromValues(1, 1, 1),
    // Buffers and buffer information
    verticesBuffer: makeBuffer(gl, verticesData),
    normalsBuffer: makeBuffer(gl, normalsData),
    colorsBuffer: makeBuffer(gl, colorsData),
    meshIndexes: makeBuffer(gl, indices, gl.ELEMENT_ARRAY_BUFFER)
  };
}

function getModelMatrix(modelMesh) {
  let combinedMatrix = mat4.create();
  mat4.translate(combinedMatrix, combinedMatrix, modelMesh.modelPosition);
  mat4.multiply(combinedMatrix, combinedMatrix, modelMesh.modelRotationMatrix);
  mat4.scale(combinedMatrix, combinedMatrix, modelMesh.modelScale);
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

function draw() {
  // Animation
  mat4.rotateY(theEarthVBO.modelRotationMatrix, theEarthVBO.modelRotationMatrix, -0.003 * PI);
  viewMatrices.noiseOffset += 0.003;

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

  let modelMatrix = getModelMatrix(theEarthVBO);
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
