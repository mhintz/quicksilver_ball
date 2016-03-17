import {vec3, mat4} from 'gl-matrix';
import worldLightSHD from 'shaders/world_light.frag';
import passThroughSHD from 'shaders/pass_through.vert';
import {$, getWebGLContext, getPixelRatio, deg2Rad, elapsedTime, randRGBInt, flatten2Buffer, flatten2UIntBuffer} from 'util';
import icosphere from 'icosphere';
import makeShader from 'gl-shader';

// Be forewarned: OpenGL LOVES global variables and state
const gl = getWebGLContext(document.getElementById('maincanvas'));
const PI = Math.PI;
const TWO_PI = 2 * Math.PI;

const viewMatrices = {};

const theEarth = postProcessIcoMesh(icosphere(3));
const theMoon = postProcessIcoMesh(icosphere(0));

const earthShader = makeShader(gl, passThroughSHD, worldLightSHD);
const moonShader = makeShader(gl, passThroughSHD, worldLightSHD);

function postProcessIcoMesh(complex) {
  let vertices = complex.positions;
  let faceIndices = complex.cells;

  let expandedPositions = [];
  let normals = [];
  let colors = [];

  faceIndices.forEach((face, idx) => {
    let v0 = vec3.clone(vertices[face[0]]);
    let v1 = vec3.clone(vertices[face[1]]);
    let v2 = vec3.clone(vertices[face[2]]);
    expandedPositions.push(v0, v1, v2);

    let side1 = vec3.sub(vec3.create(), v1, v0);
    let side2 = vec3.sub(vec3.create(), v2, v0);
    let normal = vec3.cross(vec3.create(), side1, side2);

    // normals.push(normal, normal, normal);
    normals.push(v0, v1, v2);

    let c0 = randRGBInt();
    let c1 = randRGBInt();
    let c2 = randRGBInt();
    // Flat color shading, since all vertices have the same color
    // c0 = c1 = c2;
    colors.push(c0, c1, c2);
  });

  for (var idx = 0; idx < normals.length; ++idx) {
    let nrml = normals[idx];
    vec3.normalize(nrml, nrml);
  }

  let numVertexElements = 3;
  let numNormalElements = 3;
  let numColorElements = 4;

  let verticesData = flatten2Buffer(expandedPositions, numVertexElements);
  let normalsData = flatten2Buffer(normals, numNormalElements);
  let colorsData = flatten2UIntBuffer(colors, numColorElements);

  return {
    // Mesh information
    numVertices: expandedPositions.length,
    modelPosition: vec3.create(),
    modelRotationMatrix: mat4.create(),
    modelScale: vec3.fromValues(1, 1, 1),
    // Buffers and buffer information
    verticesBuffer: prepareGLBuffer(verticesData, gl.STATIC_DRAW),
    normalsBuffer: prepareGLBuffer(normalsData, gl.STATIC_DRAW),
    colorsBuffer: prepareGLBuffer(colorsData, gl.STATIC_DRAW),
  };
}

function getModelMatrix(modelMesh) {
  let combinedMatrix = mat4.create();
  mat4.translate(combinedMatrix, combinedMatrix, modelMesh.modelPosition);
  mat4.multiply(combinedMatrix, combinedMatrix, modelMesh.modelRotationMatrix);
  mat4.scale(combinedMatrix, combinedMatrix, modelMesh.modelScale);
  return combinedMatrix;
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
  viewMatrices.cameraPosition = vec3.fromValues(0, 0, 9);
  viewMatrices.cameraTarget = vec3.fromValues(0, 0, 0);
  viewMatrices.cameraUp = vec3.fromValues(0, 1, 0);
  viewMatrices.viewMatrix = mat4.lookAt(mat4.create(), viewMatrices.cameraPosition, viewMatrices.cameraTarget, viewMatrices.cameraUp);

  theMoon.modelScale = vec3.fromValues(0.2, 0.2, 0.2);
}

function draw() {
  // Animation
  theMoon.modelPosition[0] = 3 * Math.cos(0.001 * elapsedTime());
  theMoon.modelPosition[2] = 3 * Math.sin(0.001 * elapsedTime());
  mat4.rotateY(theMoon.modelRotationMatrix, theMoon.modelRotationMatrix, 0.006 * PI);
  mat4.rotateY(theEarth.modelRotationMatrix, theEarth.modelRotationMatrix, -0.003 * PI);

  // Drawing
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Misc variables used below
  let lightPosLoc;
  let projMatLoc;
  let viewMatLoc;
  let modelMatrix;
  let modelMatLoc;
  let modelMatrixIT;
  let modelMatITLoc;
  let posLoc;
  let normLoc;
  let colorLoc;

  let lightPosition = vec3.add(vec3.create(), viewMatrices.cameraPosition, vec3.fromValues(4, 10, 4));

  // Draw the Earth
  earthShader.bind();

  earthShader.uniforms.u_lightWorldPosition = lightPosition;
  earthShader.uniforms.u_projectionMatrix = viewMatrices.projectionMatrix;
  earthShader.uniforms.u_worldViewMatrix = viewMatrices.viewMatrix;

  modelMatrix = getModelMatrix(theEarth);
  earthShader.uniforms.u_modelWorldMatrix = modelMatrix;

  modelMatrixIT = mat4.transpose(mat4.create(), mat4.invert(mat4.create(), modelMatrix));
  earthShader.uniforms.u_modelWorldMatrix_IT = modelMatrixIT;

  gl.bindBuffer(gl.ARRAY_BUFFER, theEarth.verticesBuffer);
  earthShader.attributes.a_position.pointer();

  gl.bindBuffer(gl.ARRAY_BUFFER, theEarth.normalsBuffer);
  earthShader.attributes.a_normal.pointer();

  gl.bindBuffer(gl.ARRAY_BUFFER, theEarth.colorsBuffer);
  earthShader.attributes.a_color.pointer(gl.UNSIGNED_BYTE, true);

  gl.drawArrays(gl.TRIANGLES, 0, theEarth.numVertices);

  // Draw the Moon
  moonShader.bind();

  moonShader.uniforms.u_lightWorldPosition = lightPosition;
  moonShader.uniforms.u_projectionMatrix = viewMatrices.projectionMatrix;
  moonShader.uniforms.u_worldViewMatrix = viewMatrices.viewMatrix;

  modelMatrix = getModelMatrix(theMoon);
  moonShader.uniforms.u_modelWorldMatrix = modelMatrix;

  modelMatrixIT = mat4.transpose(mat4.create(), mat4.invert(mat4.create(), modelMatrix));
  moonShader.uniforms.u_modelWorldMatrix_IT = modelMatrixIT;

  gl.bindBuffer(gl.ARRAY_BUFFER, theMoon.verticesBuffer);
  moonShader.attributes.a_position.pointer();

  gl.bindBuffer(gl.ARRAY_BUFFER, theMoon.normalsBuffer);
  moonShader.attributes.a_normal.pointer();

  gl.bindBuffer(gl.ARRAY_BUFFER, theMoon.colorsBuffer);
  moonShader.attributes.a_color.pointer(gl.UNSIGNED_BYTE, true);

  gl.drawArrays(gl.TRIANGLES, 0, theMoon.numVertices);
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
