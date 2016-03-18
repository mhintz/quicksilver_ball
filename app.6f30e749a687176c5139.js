/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!*****************!*\
  !*** multi app ***!
  \*****************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(/*! /Users/markhintz/Code/quicksilver_ball/src/index */1);


/***/ },
/* 1 */
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _glMatrix = __webpack_require__(/*! gl-matrix */ 2);

	var _world_light = __webpack_require__(/*! shaders/world_light.frag */ 3);

	var _world_light2 = _interopRequireDefault(_world_light);

	var _pass_through = __webpack_require__(/*! shaders/pass_through.vert */ 4);

	var _pass_through2 = _interopRequireDefault(_pass_through);

	var _util = __webpack_require__(/*! util */ 5);

	var _icosphere = __webpack_require__(/*! icosphere */ 7);

	var _icosphere2 = _interopRequireDefault(_icosphere);

	var _glShader = __webpack_require__(/*! gl-shader */ 8);

	var _glShader2 = _interopRequireDefault(_glShader);

	var _glBuffer = __webpack_require__(/*! gl-buffer */ 34);

	var _glBuffer2 = _interopRequireDefault(_glBuffer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// Be forewarned: OpenGL LOVES global variables and state
	var canvas = document.getElementById('maincanvas');
	var gl = (0, _util.getWebGLContext)(canvas);
	var ext = gl.getExtension("OES_standard_derivatives");
	console.log(ext);
	var PI = Math.PI;
	var TWO_PI = 2 * Math.PI;

	var state = new function State(canvas) {
	  var _this = this;

	  this.isTap = false;
	  this.isDown = false;
	  this.listeners = [];

	  this.down = function (x, y) {
	    _this.isTap = true;
	    _this.isDown = true;
	    _this.fire('down', x, y);
	  };

	  this.move = function (x, y) {
	    if (_this.isDown) {
	      _this.isTap = false;
	      _this.fire('move', x, y);
	    }
	  };

	  this.up = function (x, y) {
	    _this.isDown = false;
	    if (_this.isTap) {
	      _this.isTap = false;
	      _this.fire('tap', x, y);
	    }
	    _this.fire('up', x, y);
	  };

	  this.listen = function (name, fn) {
	    _this.listeners.push({
	      evt: name,
	      fn: fn
	    });
	  };

	  this.fire = function (name) {
	    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      args[_key - 1] = arguments[_key];
	    }

	    _this.listeners.forEach(function (item) {
	      if (item.evt === name) {
	        item.fn.apply(null, args);
	      }
	    });
	  };

	  canvas.addEventListener('mousedown', function (e) {
	    return _this.down(e.pageX, e.pageY);
	  });
	  canvas.addEventListener('mouseup', function (e) {
	    return _this.up(e.pageX, e.pageY);
	  });
	  canvas.addEventListener('mousemove', function (e) {
	    return _this.move(e.pageX, e.pageY);
	  });
	  canvas.addEventListener('touchstart', function (e) {
	    var _e$touches$ = e.touches[0];
	    var pageX = _e$touches$.pageX;
	    var pageY = _e$touches$.pageY;

	    _this.down(pageX, pageY);
	  });
	  canvas.addEventListener('touchend', function (e) {
	    var _e$touches$2 = e.touches[0];
	    var pageX = _e$touches$2.pageX;
	    var pageY = _e$touches$2.pageY;

	    _this.up(pageX, pageY);
	  });
	  canvas.addEventListener('touchmove', function (e) {
	    var _e$touches$3 = e.touches[0];
	    var pageX = _e$touches$3.pageX;
	    var pageY = _e$touches$3.pageY;

	    _this.move(pageX, pageY);
	  });
	}(canvas);

	state.listen('tap', function (x, y) {
	  var force = _glMatrix.vec3.sub(_glMatrix.vec3.create(), viewMatrices.cameraTarget, viewMatrices.cameraPosition);
	  _glMatrix.vec3.normalize(force, force);
	  _glMatrix.vec3.scale(force, force, 20);
	  applyForce(force);
	});

	state.listen('move', function (x, y) {
	  x /= window.innerWidth;y /= window.innerHeight;
	  var center = _glMatrix.vec3.fromValues(0.5, 0.5, 0);
	  var movement = _glMatrix.vec3.sub(_glMatrix.vec3.create(), _glMatrix.vec3.fromValues(x, y, 0), center);
	  movement = _glMatrix.vec3.mul(movement, movement, _glMatrix.vec3.fromValues(1, -1, 0));
	  applyOffset(_glMatrix.vec3.scale(movement, movement, 0.3));

	  var angle = _glMatrix.vec3.length(movement);
	  // Flip the movement vector perpendicular
	  var rotationaxis = _glMatrix.vec3.fromValues(movement[1], -movement[0], 0);
	  applyRotationForce(angle, rotationaxis);
	});

	state.listen('up', function (x, y) {});

	var viewMatrices = {};
	var modelNode = {
	  position: _glMatrix.vec3.create(),
	  rotation: _glMatrix.mat4.create(),
	  scale: _glMatrix.vec3.fromValues(1, 1, 1),
	  velocity: _glMatrix.vec3.create(),
	  acceleration: _glMatrix.vec3.create(),
	  mass: 20,
	  spring: 0.3,
	  damping: 0.5,
	  friction: 0.9,
	  angularVelocity: _glMatrix.vec3.create()
	};

	var theEarth = postProcessIcoMesh((0, _icosphere2.default)(5));
	var theEarthVBO = buildVboStruct(gl, theEarth);

	var earthShader = (0, _glShader2.default)(gl, _pass_through2.default, _world_light2.default);

	function postProcessIcoMesh(complex) {
	  var vertices = complex.positions;
	  var faceIndices = complex.cells;

	  var expandedPositions = [];
	  var normals = vertices.map(function () {
	    return _glMatrix.vec3.create();
	  });
	  var colors = vertices.map(function () {
	    return (0, _util.randRGBInt)();
	  });

	  faceIndices.forEach(function (face, idx) {
	    var _face = _slicedToArray(face, 3);

	    var i0 = _face[0];
	    var i1 = _face[1];
	    var i2 = _face[2];


	    var v0 = vertices[i0];
	    var v1 = vertices[i1];
	    var v2 = vertices[i2];

	    var side1 = _glMatrix.vec3.sub(_glMatrix.vec3.create(), v1, v0);
	    var side2 = _glMatrix.vec3.sub(_glMatrix.vec3.create(), v2, v0);
	    var faceNormal = _glMatrix.vec3.cross(_glMatrix.vec3.create(), side1, side2);

	    var n1 = normals[i0];
	    var n2 = normals[i1];
	    var n3 = normals[i2];

	    _glMatrix.vec3.add(n1, n1, faceNormal);
	    _glMatrix.vec3.add(n2, n2, faceNormal);
	    _glMatrix.vec3.add(n3, n3, faceNormal);
	  });

	  normals.forEach(function (n) {
	    return _glMatrix.vec3.normalize(n, n);
	  });

	  return {
	    vertices: vertices, normals: normals, colors: colors,
	    indices: faceIndices
	  };
	}

	function buildVboStruct(gl, mesh) {
	  var verticesData = (0, _util.flatten2Buffer)(mesh.vertices, 3);
	  var normalsData = (0, _util.flatten2Buffer)(mesh.normals, 3);
	  var colorsData = (0, _util.flatten2UIntBuffer)(mesh.colors, 4);

	  var indices = (0, _util.flatten2IndexBuffer)(mesh.indices, 3);

	  return {
	    // Mesh information
	    numVertices: indices.length,
	    // Buffers and buffer information
	    verticesBuffer: (0, _glBuffer2.default)(gl, verticesData),
	    normalsBuffer: (0, _glBuffer2.default)(gl, normalsData),
	    colorsBuffer: (0, _glBuffer2.default)(gl, colorsData),
	    meshIndexes: (0, _glBuffer2.default)(gl, indices, gl.ELEMENT_ARRAY_BUFFER)
	  };
	}

	function getModelMatrix(node) {
	  var combinedMatrix = _glMatrix.mat4.create();
	  _glMatrix.mat4.translate(combinedMatrix, combinedMatrix, node.position);
	  _glMatrix.mat4.multiply(combinedMatrix, combinedMatrix, node.rotation);
	  _glMatrix.mat4.scale(combinedMatrix, combinedMatrix, node.scale);
	  return combinedMatrix;
	}

	function getOffsets(mesh, offsetX) {
	  var offsetDistance = 2.8;
	  var offsetStrength = 0.16;
	  return mesh.vertices.map(function (v, idx) {
	    return _glMatrix.vec3.scale(_glMatrix.vec3.create(), mesh.normals[idx], (0, _util.noise3)(offsetDistance * (v[0] + offsetX), offsetDistance * v[1], offsetDistance * v[2]) * offsetStrength);
	  });
	}

	function setViewportSize() {
	  var innerWidth = window.innerWidth;
	  var innerHeight = window.innerHeight;
	  var pixelRatio = (0, _util.getPixelRatio)();
	  var canvasWidth = innerWidth * pixelRatio;
	  var canvasHeight = innerHeight * pixelRatio;

	  canvas.width = canvasWidth;
	  canvas.height = canvasHeight;
	  canvas.style.width = innerWidth + 'px';
	  canvas.style.height = innerHeight + 'px';
	  gl.viewport(0, 0, canvasWidth, canvasHeight);

	  viewMatrices.projectionMatrix = _glMatrix.mat4.perspective(_glMatrix.mat4.create(), (0, _util.deg2Rad)(25), canvasWidth / canvasHeight, 0.01, 50);
	}

	window.onresize = setViewportSize;

	function setup() {
	  setViewportSize();

	  gl.clearColor(0, 0, 0, 1);
	  gl.enable(gl.CULL_FACE);
	  gl.enable(gl.DEPTH_TEST);
	  gl.frontFace(gl.CCW);

	  viewMatrices.cameraPosition = _glMatrix.vec3.fromValues(0, 0, 6);
	  viewMatrices.cameraTarget = _glMatrix.vec3.fromValues(0, 0, 0);
	  viewMatrices.cameraUp = _glMatrix.vec3.fromValues(0, 1, 0);
	  viewMatrices.viewMatrix = _glMatrix.mat4.lookAt(_glMatrix.mat4.create(), viewMatrices.cameraPosition, viewMatrices.cameraTarget, viewMatrices.cameraUp);

	  viewMatrices.noiseOffset = 0.0;
	}

	function applyForce(forceVec) {
	  var accel = _glMatrix.vec3.scale(forceVec, forceVec, 1 / modelNode.mass);
	  _glMatrix.vec3.add(modelNode.acceleration, modelNode.acceleration, accel);
	}

	function velocityInDir(velvec, dirvec) {
	  // dot(v, normalize(dirvec)) * normalize(dirvec)
	  var normdir = _glMatrix.vec3.normalize(_glMatrix.vec3.create(), dirvec);
	  var dirmag = _glMatrix.vec3.dot(velvec, normdir);
	  return _glMatrix.vec3.scale(normdir, normdir, dirmag);
	}

	function applyOffset(offsetVec) {
	  _glMatrix.vec3.add(modelNode.position, modelNode.position, offsetVec);
	}

	function applyRotationForce(angle, rotAxis) {}

	function draw() {
	  // Animation
	  _glMatrix.mat4.rotateY(modelNode.rotation, modelNode.rotation, -0.001 * PI);
	  viewMatrices.noiseOffset += 0.003;

	  var origin = _glMatrix.vec3.fromValues(0, 0, 0);
	  var toOrigin = _glMatrix.vec3.sub(_glMatrix.vec3.create(), origin, modelNode.position);
	  var force = _glMatrix.vec3.scale(_glMatrix.vec3.create(), toOrigin, modelNode.spring);
	  var velocityToOrigin = velocityInDir(modelNode.velocity, toOrigin);
	  var damping = _glMatrix.vec3.scale(velocityToOrigin, velocityToOrigin, modelNode.damping);
	  _glMatrix.vec3.sub(force, force, damping);

	  applyForce(force);

	  _glMatrix.vec3.add(modelNode.velocity, modelNode.velocity, modelNode.acceleration);
	  _glMatrix.vec3.add(modelNode.position, modelNode.position, modelNode.velocity);
	  _glMatrix.vec3.scale(modelNode.position, modelNode.position, modelNode.friction);
	  _glMatrix.vec3.scale(modelNode.acceleration, modelNode.acceleration, 0);

	  var offsets = getOffsets(theEarth, viewMatrices.noiseOffset);
	  var offsetBuf = (0, _glBuffer2.default)(gl, (0, _util.flatten2Buffer)(offsets, 3));

	  // Drawing
	  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	  var lightPosition = _glMatrix.vec3.add(_glMatrix.vec3.create(), viewMatrices.cameraPosition, _glMatrix.vec3.fromValues(4, 10, 4));

	  // Draw the Earth
	  earthShader.bind();

	  earthShader.uniforms.u_lightWorldPosition = lightPosition;
	  // earthShader.uniforms.u_lightWorldPosition = viewMatrices.cameraPosition;
	  earthShader.uniforms.u_projectionMatrix = viewMatrices.projectionMatrix;
	  earthShader.uniforms.u_worldViewMatrix = viewMatrices.viewMatrix;

	  var modelMatrix = getModelMatrix(modelNode);
	  earthShader.uniforms.u_modelWorldMatrix = modelMatrix;

	  var modelMatrixIT = _glMatrix.mat4.transpose(_glMatrix.mat4.create(), _glMatrix.mat4.invert(_glMatrix.mat4.create(), modelMatrix));
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
	  var bufferId = gl.createBuffer();
	  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
	  gl.bufferData(gl.ARRAY_BUFFER, bufferData, bufferUsage);
	  gl.bindBuffer(gl.ARRAY_BUFFER, null);
	  return bufferId;
	}

	var loop = function loop() {
	  draw(), requestAnimationFrame(loop);
	};

	// Setup once, then infinite draw
	setup();
	loop();

/***/ },
/* 2 */
/*!*******************************************!*\
  !*** ./~/gl-matrix/dist/gl-matrix-min.js ***!
  \*******************************************/
/***/ function(module, exports) {

	"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	/**
	 * @fileoverview gl-matrix - High performance matrix and vector operations
	 * @author Brandon Jones
	 * @author Colin MacKenzie IV
	 * @version 2.3.2
	 */

	/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE. */

	!function (t, a) {
	  if ("object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "object" == (typeof module === "undefined" ? "undefined" : _typeof(module))) module.exports = a();else if ("function" == typeof define && define.amd) define([], a);else {
	    var n = a();for (var r in n) {
	      ("object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) ? exports : t)[r] = n[r];
	    }
	  }
	}(undefined, function () {
	  return function (t) {
	    function a(r) {
	      if (n[r]) return n[r].exports;var o = n[r] = { exports: {}, id: r, loaded: !1 };return t[r].call(o.exports, o, o.exports, a), o.loaded = !0, o.exports;
	    }var n = {};return a.m = t, a.c = n, a.p = "", a(0);
	  }([function (t, a, n) {
	    a.glMatrix = n(1), a.mat2 = n(2), a.mat2d = n(3), a.mat3 = n(4), a.mat4 = n(5), a.quat = n(6), a.vec2 = n(9), a.vec3 = n(7), a.vec4 = n(8);
	  }, function (t, a) {
	    var n = {};n.EPSILON = 1e-6, n.ARRAY_TYPE = "undefined" != typeof Float32Array ? Float32Array : Array, n.RANDOM = Math.random, n.ENABLE_SIMD = !1, n.SIMD_AVAILABLE = n.ARRAY_TYPE === Float32Array && "SIMD" in this, n.USE_SIMD = n.ENABLE_SIMD && n.SIMD_AVAILABLE, n.setMatrixArrayType = function (t) {
	      n.ARRAY_TYPE = t;
	    };var r = Math.PI / 180;n.toRadian = function (t) {
	      return t * r;
	    }, n.equals = function (t, a) {
	      return Math.abs(t - a) <= n.EPSILON * Math.max(1, Math.abs(t), Math.abs(a));
	    }, t.exports = n;
	  }, function (t, a, n) {
	    var r = n(1),
	        o = {};o.create = function () {
	      var t = new r.ARRAY_TYPE(4);return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t;
	    }, o.clone = function (t) {
	      var a = new r.ARRAY_TYPE(4);return a[0] = t[0], a[1] = t[1], a[2] = t[2], a[3] = t[3], a;
	    }, o.copy = function (t, a) {
	      return t[0] = a[0], t[1] = a[1], t[2] = a[2], t[3] = a[3], t;
	    }, o.identity = function (t) {
	      return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t;
	    }, o.fromValues = function (t, a, n, o) {
	      var u = new r.ARRAY_TYPE(4);return u[0] = t, u[1] = a, u[2] = n, u[3] = o, u;
	    }, o.set = function (t, a, n, r, o) {
	      return t[0] = a, t[1] = n, t[2] = r, t[3] = o, t;
	    }, o.transpose = function (t, a) {
	      if (t === a) {
	        var n = a[1];t[1] = a[2], t[2] = n;
	      } else t[0] = a[0], t[1] = a[2], t[2] = a[1], t[3] = a[3];return t;
	    }, o.invert = function (t, a) {
	      var n = a[0],
	          r = a[1],
	          o = a[2],
	          u = a[3],
	          l = n * u - o * r;return l ? (l = 1 / l, t[0] = u * l, t[1] = -r * l, t[2] = -o * l, t[3] = n * l, t) : null;
	    }, o.adjoint = function (t, a) {
	      var n = a[0];return t[0] = a[3], t[1] = -a[1], t[2] = -a[2], t[3] = n, t;
	    }, o.determinant = function (t) {
	      return t[0] * t[3] - t[2] * t[1];
	    }, o.multiply = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          u = a[2],
	          l = a[3],
	          e = n[0],
	          M = n[1],
	          s = n[2],
	          i = n[3];return t[0] = r * e + u * M, t[1] = o * e + l * M, t[2] = r * s + u * i, t[3] = o * s + l * i, t;
	    }, o.mul = o.multiply, o.rotate = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          u = a[2],
	          l = a[3],
	          e = Math.sin(n),
	          M = Math.cos(n);return t[0] = r * M + u * e, t[1] = o * M + l * e, t[2] = r * -e + u * M, t[3] = o * -e + l * M, t;
	    }, o.scale = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          u = a[2],
	          l = a[3],
	          e = n[0],
	          M = n[1];return t[0] = r * e, t[1] = o * e, t[2] = u * M, t[3] = l * M, t;
	    }, o.fromRotation = function (t, a) {
	      var n = Math.sin(a),
	          r = Math.cos(a);return t[0] = r, t[1] = n, t[2] = -n, t[3] = r, t;
	    }, o.fromScaling = function (t, a) {
	      return t[0] = a[0], t[1] = 0, t[2] = 0, t[3] = a[1], t;
	    }, o.str = function (t) {
	      return "mat2(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")";
	    }, o.frob = function (t) {
	      return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2));
	    }, o.LDU = function (t, a, n, r) {
	      return t[2] = r[2] / r[0], n[0] = r[0], n[1] = r[1], n[3] = r[3] - t[2] * n[1], [t, a, n];
	    }, o.add = function (t, a, n) {
	      return t[0] = a[0] + n[0], t[1] = a[1] + n[1], t[2] = a[2] + n[2], t[3] = a[3] + n[3], t;
	    }, o.subtract = function (t, a, n) {
	      return t[0] = a[0] - n[0], t[1] = a[1] - n[1], t[2] = a[2] - n[2], t[3] = a[3] - n[3], t;
	    }, o.sub = o.subtract, o.exactEquals = function (t, a) {
	      return t[0] === a[0] && t[1] === a[1] && t[2] === a[2] && t[3] === a[3];
	    }, o.equals = function (t, a) {
	      var n = t[0],
	          o = t[1],
	          u = t[2],
	          l = t[3],
	          e = a[0],
	          M = a[1],
	          s = a[2],
	          i = a[3];return Math.abs(n - e) <= r.EPSILON * Math.max(1, Math.abs(n), Math.abs(e)) && Math.abs(o - M) <= r.EPSILON * Math.max(1, Math.abs(o), Math.abs(M)) && Math.abs(u - s) <= r.EPSILON * Math.max(1, Math.abs(u), Math.abs(s)) && Math.abs(l - i) <= r.EPSILON * Math.max(1, Math.abs(l), Math.abs(i));
	    }, o.multiplyScalar = function (t, a, n) {
	      return t[0] = a[0] * n, t[1] = a[1] * n, t[2] = a[2] * n, t[3] = a[3] * n, t;
	    }, o.multiplyScalarAndAdd = function (t, a, n, r) {
	      return t[0] = a[0] + n[0] * r, t[1] = a[1] + n[1] * r, t[2] = a[2] + n[2] * r, t[3] = a[3] + n[3] * r, t;
	    }, t.exports = o;
	  }, function (t, a, n) {
	    var r = n(1),
	        o = {};o.create = function () {
	      var t = new r.ARRAY_TYPE(6);return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t[4] = 0, t[5] = 0, t;
	    }, o.clone = function (t) {
	      var a = new r.ARRAY_TYPE(6);return a[0] = t[0], a[1] = t[1], a[2] = t[2], a[3] = t[3], a[4] = t[4], a[5] = t[5], a;
	    }, o.copy = function (t, a) {
	      return t[0] = a[0], t[1] = a[1], t[2] = a[2], t[3] = a[3], t[4] = a[4], t[5] = a[5], t;
	    }, o.identity = function (t) {
	      return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t[4] = 0, t[5] = 0, t;
	    }, o.fromValues = function (t, a, n, o, u, l) {
	      var e = new r.ARRAY_TYPE(6);return e[0] = t, e[1] = a, e[2] = n, e[3] = o, e[4] = u, e[5] = l, e;
	    }, o.set = function (t, a, n, r, o, u, l) {
	      return t[0] = a, t[1] = n, t[2] = r, t[3] = o, t[4] = u, t[5] = l, t;
	    }, o.invert = function (t, a) {
	      var n = a[0],
	          r = a[1],
	          o = a[2],
	          u = a[3],
	          l = a[4],
	          e = a[5],
	          M = n * u - r * o;return M ? (M = 1 / M, t[0] = u * M, t[1] = -r * M, t[2] = -o * M, t[3] = n * M, t[4] = (o * e - u * l) * M, t[5] = (r * l - n * e) * M, t) : null;
	    }, o.determinant = function (t) {
	      return t[0] * t[3] - t[1] * t[2];
	    }, o.multiply = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          u = a[2],
	          l = a[3],
	          e = a[4],
	          M = a[5],
	          s = n[0],
	          i = n[1],
	          c = n[2],
	          h = n[3],
	          S = n[4],
	          I = n[5];return t[0] = r * s + u * i, t[1] = o * s + l * i, t[2] = r * c + u * h, t[3] = o * c + l * h, t[4] = r * S + u * I + e, t[5] = o * S + l * I + M, t;
	    }, o.mul = o.multiply, o.rotate = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          u = a[2],
	          l = a[3],
	          e = a[4],
	          M = a[5],
	          s = Math.sin(n),
	          i = Math.cos(n);return t[0] = r * i + u * s, t[1] = o * i + l * s, t[2] = r * -s + u * i, t[3] = o * -s + l * i, t[4] = e, t[5] = M, t;
	    }, o.scale = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          u = a[2],
	          l = a[3],
	          e = a[4],
	          M = a[5],
	          s = n[0],
	          i = n[1];return t[0] = r * s, t[1] = o * s, t[2] = u * i, t[3] = l * i, t[4] = e, t[5] = M, t;
	    }, o.translate = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          u = a[2],
	          l = a[3],
	          e = a[4],
	          M = a[5],
	          s = n[0],
	          i = n[1];return t[0] = r, t[1] = o, t[2] = u, t[3] = l, t[4] = r * s + u * i + e, t[5] = o * s + l * i + M, t;
	    }, o.fromRotation = function (t, a) {
	      var n = Math.sin(a),
	          r = Math.cos(a);return t[0] = r, t[1] = n, t[2] = -n, t[3] = r, t[4] = 0, t[5] = 0, t;
	    }, o.fromScaling = function (t, a) {
	      return t[0] = a[0], t[1] = 0, t[2] = 0, t[3] = a[1], t[4] = 0, t[5] = 0, t;
	    }, o.fromTranslation = function (t, a) {
	      return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t[4] = a[0], t[5] = a[1], t;
	    }, o.str = function (t) {
	      return "mat2d(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ")";
	    }, o.frob = function (t) {
	      return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2) + Math.pow(t[4], 2) + Math.pow(t[5], 2) + 1);
	    }, o.add = function (t, a, n) {
	      return t[0] = a[0] + n[0], t[1] = a[1] + n[1], t[2] = a[2] + n[2], t[3] = a[3] + n[3], t[4] = a[4] + n[4], t[5] = a[5] + n[5], t;
	    }, o.subtract = function (t, a, n) {
	      return t[0] = a[0] - n[0], t[1] = a[1] - n[1], t[2] = a[2] - n[2], t[3] = a[3] - n[3], t[4] = a[4] - n[4], t[5] = a[5] - n[5], t;
	    }, o.sub = o.subtract, o.multiplyScalar = function (t, a, n) {
	      return t[0] = a[0] * n, t[1] = a[1] * n, t[2] = a[2] * n, t[3] = a[3] * n, t[4] = a[4] * n, t[5] = a[5] * n, t;
	    }, o.multiplyScalarAndAdd = function (t, a, n, r) {
	      return t[0] = a[0] + n[0] * r, t[1] = a[1] + n[1] * r, t[2] = a[2] + n[2] * r, t[3] = a[3] + n[3] * r, t[4] = a[4] + n[4] * r, t[5] = a[5] + n[5] * r, t;
	    }, o.exactEquals = function (t, a) {
	      return t[0] === a[0] && t[1] === a[1] && t[2] === a[2] && t[3] === a[3] && t[4] === a[4] && t[5] === a[5];
	    }, o.equals = function (t, a) {
	      var n = t[0],
	          o = t[1],
	          u = t[2],
	          l = t[3],
	          e = t[4],
	          M = t[5],
	          s = a[0],
	          i = a[1],
	          c = a[2],
	          h = a[3],
	          S = a[4],
	          I = a[5];return Math.abs(n - s) <= r.EPSILON * Math.max(1, Math.abs(n), Math.abs(s)) && Math.abs(o - i) <= r.EPSILON * Math.max(1, Math.abs(o), Math.abs(i)) && Math.abs(u - c) <= r.EPSILON * Math.max(1, Math.abs(u), Math.abs(c)) && Math.abs(l - h) <= r.EPSILON * Math.max(1, Math.abs(l), Math.abs(h)) && Math.abs(e - S) <= r.EPSILON * Math.max(1, Math.abs(e), Math.abs(S)) && Math.abs(M - I) <= r.EPSILON * Math.max(1, Math.abs(M), Math.abs(I));
	    }, t.exports = o;
	  }, function (t, a, n) {
	    var r = n(1),
	        o = {};o.create = function () {
	      var t = new r.ARRAY_TYPE(9);return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t;
	    }, o.fromMat4 = function (t, a) {
	      return t[0] = a[0], t[1] = a[1], t[2] = a[2], t[3] = a[4], t[4] = a[5], t[5] = a[6], t[6] = a[8], t[7] = a[9], t[8] = a[10], t;
	    }, o.clone = function (t) {
	      var a = new r.ARRAY_TYPE(9);return a[0] = t[0], a[1] = t[1], a[2] = t[2], a[3] = t[3], a[4] = t[4], a[5] = t[5], a[6] = t[6], a[7] = t[7], a[8] = t[8], a;
	    }, o.copy = function (t, a) {
	      return t[0] = a[0], t[1] = a[1], t[2] = a[2], t[3] = a[3], t[4] = a[4], t[5] = a[5], t[6] = a[6], t[7] = a[7], t[8] = a[8], t;
	    }, o.fromValues = function (t, a, n, o, u, l, e, M, s) {
	      var i = new r.ARRAY_TYPE(9);return i[0] = t, i[1] = a, i[2] = n, i[3] = o, i[4] = u, i[5] = l, i[6] = e, i[7] = M, i[8] = s, i;
	    }, o.set = function (t, a, n, r, o, u, l, e, M, s) {
	      return t[0] = a, t[1] = n, t[2] = r, t[3] = o, t[4] = u, t[5] = l, t[6] = e, t[7] = M, t[8] = s, t;
	    }, o.identity = function (t) {
	      return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t;
	    }, o.transpose = function (t, a) {
	      if (t === a) {
	        var n = a[1],
	            r = a[2],
	            o = a[5];t[1] = a[3], t[2] = a[6], t[3] = n, t[5] = a[7], t[6] = r, t[7] = o;
	      } else t[0] = a[0], t[1] = a[3], t[2] = a[6], t[3] = a[1], t[4] = a[4], t[5] = a[7], t[6] = a[2], t[7] = a[5], t[8] = a[8];return t;
	    }, o.invert = function (t, a) {
	      var n = a[0],
	          r = a[1],
	          o = a[2],
	          u = a[3],
	          l = a[4],
	          e = a[5],
	          M = a[6],
	          s = a[7],
	          i = a[8],
	          c = i * l - e * s,
	          h = -i * u + e * M,
	          S = s * u - l * M,
	          I = n * c + r * h + o * S;return I ? (I = 1 / I, t[0] = c * I, t[1] = (-i * r + o * s) * I, t[2] = (e * r - o * l) * I, t[3] = h * I, t[4] = (i * n - o * M) * I, t[5] = (-e * n + o * u) * I, t[6] = S * I, t[7] = (-s * n + r * M) * I, t[8] = (l * n - r * u) * I, t) : null;
	    }, o.adjoint = function (t, a) {
	      var n = a[0],
	          r = a[1],
	          o = a[2],
	          u = a[3],
	          l = a[4],
	          e = a[5],
	          M = a[6],
	          s = a[7],
	          i = a[8];return t[0] = l * i - e * s, t[1] = o * s - r * i, t[2] = r * e - o * l, t[3] = e * M - u * i, t[4] = n * i - o * M, t[5] = o * u - n * e, t[6] = u * s - l * M, t[7] = r * M - n * s, t[8] = n * l - r * u, t;
	    }, o.determinant = function (t) {
	      var a = t[0],
	          n = t[1],
	          r = t[2],
	          o = t[3],
	          u = t[4],
	          l = t[5],
	          e = t[6],
	          M = t[7],
	          s = t[8];return a * (s * u - l * M) + n * (-s * o + l * e) + r * (M * o - u * e);
	    }, o.multiply = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          u = a[2],
	          l = a[3],
	          e = a[4],
	          M = a[5],
	          s = a[6],
	          i = a[7],
	          c = a[8],
	          h = n[0],
	          S = n[1],
	          I = n[2],
	          f = n[3],
	          x = n[4],
	          D = n[5],
	          F = n[6],
	          m = n[7],
	          d = n[8];return t[0] = h * r + S * l + I * s, t[1] = h * o + S * e + I * i, t[2] = h * u + S * M + I * c, t[3] = f * r + x * l + D * s, t[4] = f * o + x * e + D * i, t[5] = f * u + x * M + D * c, t[6] = F * r + m * l + d * s, t[7] = F * o + m * e + d * i, t[8] = F * u + m * M + d * c, t;
	    }, o.mul = o.multiply, o.translate = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          u = a[2],
	          l = a[3],
	          e = a[4],
	          M = a[5],
	          s = a[6],
	          i = a[7],
	          c = a[8],
	          h = n[0],
	          S = n[1];return t[0] = r, t[1] = o, t[2] = u, t[3] = l, t[4] = e, t[5] = M, t[6] = h * r + S * l + s, t[7] = h * o + S * e + i, t[8] = h * u + S * M + c, t;
	    }, o.rotate = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          u = a[2],
	          l = a[3],
	          e = a[4],
	          M = a[5],
	          s = a[6],
	          i = a[7],
	          c = a[8],
	          h = Math.sin(n),
	          S = Math.cos(n);return t[0] = S * r + h * l, t[1] = S * o + h * e, t[2] = S * u + h * M, t[3] = S * l - h * r, t[4] = S * e - h * o, t[5] = S * M - h * u, t[6] = s, t[7] = i, t[8] = c, t;
	    }, o.scale = function (t, a, n) {
	      var r = n[0],
	          o = n[1];return t[0] = r * a[0], t[1] = r * a[1], t[2] = r * a[2], t[3] = o * a[3], t[4] = o * a[4], t[5] = o * a[5], t[6] = a[6], t[7] = a[7], t[8] = a[8], t;
	    }, o.fromTranslation = function (t, a) {
	      return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = a[0], t[7] = a[1], t[8] = 1, t;
	    }, o.fromRotation = function (t, a) {
	      var n = Math.sin(a),
	          r = Math.cos(a);return t[0] = r, t[1] = n, t[2] = 0, t[3] = -n, t[4] = r, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t;
	    }, o.fromScaling = function (t, a) {
	      return t[0] = a[0], t[1] = 0, t[2] = 0, t[3] = 0, t[4] = a[1], t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t;
	    }, o.fromMat2d = function (t, a) {
	      return t[0] = a[0], t[1] = a[1], t[2] = 0, t[3] = a[2], t[4] = a[3], t[5] = 0, t[6] = a[4], t[7] = a[5], t[8] = 1, t;
	    }, o.fromQuat = function (t, a) {
	      var n = a[0],
	          r = a[1],
	          o = a[2],
	          u = a[3],
	          l = n + n,
	          e = r + r,
	          M = o + o,
	          s = n * l,
	          i = r * l,
	          c = r * e,
	          h = o * l,
	          S = o * e,
	          I = o * M,
	          f = u * l,
	          x = u * e,
	          D = u * M;return t[0] = 1 - c - I, t[3] = i - D, t[6] = h + x, t[1] = i + D, t[4] = 1 - s - I, t[7] = S - f, t[2] = h - x, t[5] = S + f, t[8] = 1 - s - c, t;
	    }, o.normalFromMat4 = function (t, a) {
	      var n = a[0],
	          r = a[1],
	          o = a[2],
	          u = a[3],
	          l = a[4],
	          e = a[5],
	          M = a[6],
	          s = a[7],
	          i = a[8],
	          c = a[9],
	          h = a[10],
	          S = a[11],
	          I = a[12],
	          f = a[13],
	          x = a[14],
	          D = a[15],
	          F = n * e - r * l,
	          m = n * M - o * l,
	          d = n * s - u * l,
	          b = r * M - o * e,
	          v = r * s - u * e,
	          z = o * s - u * M,
	          p = i * f - c * I,
	          w = i * x - h * I,
	          E = i * D - S * I,
	          A = c * x - h * f,
	          P = c * D - S * f,
	          L = h * D - S * x,
	          q = F * L - m * P + d * A + b * E - v * w + z * p;return q ? (q = 1 / q, t[0] = (e * L - M * P + s * A) * q, t[1] = (M * E - l * L - s * w) * q, t[2] = (l * P - e * E + s * p) * q, t[3] = (o * P - r * L - u * A) * q, t[4] = (n * L - o * E + u * w) * q, t[5] = (r * E - n * P - u * p) * q, t[6] = (f * z - x * v + D * b) * q, t[7] = (x * d - I * z - D * m) * q, t[8] = (I * v - f * d + D * F) * q, t) : null;
	    }, o.str = function (t) {
	      return "mat3(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ", " + t[6] + ", " + t[7] + ", " + t[8] + ")";
	    }, o.frob = function (t) {
	      return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2) + Math.pow(t[4], 2) + Math.pow(t[5], 2) + Math.pow(t[6], 2) + Math.pow(t[7], 2) + Math.pow(t[8], 2));
	    }, o.add = function (t, a, n) {
	      return t[0] = a[0] + n[0], t[1] = a[1] + n[1], t[2] = a[2] + n[2], t[3] = a[3] + n[3], t[4] = a[4] + n[4], t[5] = a[5] + n[5], t[6] = a[6] + n[6], t[7] = a[7] + n[7], t[8] = a[8] + n[8], t;
	    }, o.subtract = function (t, a, n) {
	      return t[0] = a[0] - n[0], t[1] = a[1] - n[1], t[2] = a[2] - n[2], t[3] = a[3] - n[3], t[4] = a[4] - n[4], t[5] = a[5] - n[5], t[6] = a[6] - n[6], t[7] = a[7] - n[7], t[8] = a[8] - n[8], t;
	    }, o.sub = o.subtract, o.multiplyScalar = function (t, a, n) {
	      return t[0] = a[0] * n, t[1] = a[1] * n, t[2] = a[2] * n, t[3] = a[3] * n, t[4] = a[4] * n, t[5] = a[5] * n, t[6] = a[6] * n, t[7] = a[7] * n, t[8] = a[8] * n, t;
	    }, o.multiplyScalarAndAdd = function (t, a, n, r) {
	      return t[0] = a[0] + n[0] * r, t[1] = a[1] + n[1] * r, t[2] = a[2] + n[2] * r, t[3] = a[3] + n[3] * r, t[4] = a[4] + n[4] * r, t[5] = a[5] + n[5] * r, t[6] = a[6] + n[6] * r, t[7] = a[7] + n[7] * r, t[8] = a[8] + n[8] * r, t;
	    }, o.exactEquals = function (t, a) {
	      return t[0] === a[0] && t[1] === a[1] && t[2] === a[2] && t[3] === a[3] && t[4] === a[4] && t[5] === a[5] && t[6] === a[6] && t[7] === a[7] && t[8] === a[8];
	    }, o.equals = function (t, a) {
	      var n = t[0],
	          o = t[1],
	          u = t[2],
	          l = t[3],
	          e = t[4],
	          M = t[5],
	          s = t[6],
	          i = t[7],
	          c = t[8],
	          h = a[0],
	          S = a[1],
	          I = a[2],
	          f = a[3],
	          x = a[4],
	          D = a[5],
	          F = t[6],
	          m = a[7],
	          d = a[8];return Math.abs(n - h) <= r.EPSILON * Math.max(1, Math.abs(n), Math.abs(h)) && Math.abs(o - S) <= r.EPSILON * Math.max(1, Math.abs(o), Math.abs(S)) && Math.abs(u - I) <= r.EPSILON * Math.max(1, Math.abs(u), Math.abs(I)) && Math.abs(l - f) <= r.EPSILON * Math.max(1, Math.abs(l), Math.abs(f)) && Math.abs(e - x) <= r.EPSILON * Math.max(1, Math.abs(e), Math.abs(x)) && Math.abs(M - D) <= r.EPSILON * Math.max(1, Math.abs(M), Math.abs(D)) && Math.abs(s - F) <= r.EPSILON * Math.max(1, Math.abs(s), Math.abs(F)) && Math.abs(i - m) <= r.EPSILON * Math.max(1, Math.abs(i), Math.abs(m)) && Math.abs(c - d) <= r.EPSILON * Math.max(1, Math.abs(c), Math.abs(d));
	    }, t.exports = o;
	  }, function (t, a, n) {
	    var r = n(1),
	        o = { scalar: {}, SIMD: {} };o.create = function () {
	      var t = new r.ARRAY_TYPE(16);return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t;
	    }, o.clone = function (t) {
	      var a = new r.ARRAY_TYPE(16);return a[0] = t[0], a[1] = t[1], a[2] = t[2], a[3] = t[3], a[4] = t[4], a[5] = t[5], a[6] = t[6], a[7] = t[7], a[8] = t[8], a[9] = t[9], a[10] = t[10], a[11] = t[11], a[12] = t[12], a[13] = t[13], a[14] = t[14], a[15] = t[15], a;
	    }, o.copy = function (t, a) {
	      return t[0] = a[0], t[1] = a[1], t[2] = a[2], t[3] = a[3], t[4] = a[4], t[5] = a[5], t[6] = a[6], t[7] = a[7], t[8] = a[8], t[9] = a[9], t[10] = a[10], t[11] = a[11], t[12] = a[12], t[13] = a[13], t[14] = a[14], t[15] = a[15], t;
	    }, o.fromValues = function (t, a, n, o, u, l, e, M, s, i, c, h, S, I, f, x) {
	      var D = new r.ARRAY_TYPE(16);return D[0] = t, D[1] = a, D[2] = n, D[3] = o, D[4] = u, D[5] = l, D[6] = e, D[7] = M, D[8] = s, D[9] = i, D[10] = c, D[11] = h, D[12] = S, D[13] = I, D[14] = f, D[15] = x, D;
	    }, o.set = function (t, a, n, r, o, u, l, e, M, s, i, c, h, S, I, f, x) {
	      return t[0] = a, t[1] = n, t[2] = r, t[3] = o, t[4] = u, t[5] = l, t[6] = e, t[7] = M, t[8] = s, t[9] = i, t[10] = c, t[11] = h, t[12] = S, t[13] = I, t[14] = f, t[15] = x, t;
	    }, o.identity = function (t) {
	      return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t;
	    }, o.scalar.transpose = function (t, a) {
	      if (t === a) {
	        var n = a[1],
	            r = a[2],
	            o = a[3],
	            u = a[6],
	            l = a[7],
	            e = a[11];t[1] = a[4], t[2] = a[8], t[3] = a[12], t[4] = n, t[6] = a[9], t[7] = a[13], t[8] = r, t[9] = u, t[11] = a[14], t[12] = o, t[13] = l, t[14] = e;
	      } else t[0] = a[0], t[1] = a[4], t[2] = a[8], t[3] = a[12], t[4] = a[1], t[5] = a[5], t[6] = a[9], t[7] = a[13], t[8] = a[2], t[9] = a[6], t[10] = a[10], t[11] = a[14], t[12] = a[3], t[13] = a[7], t[14] = a[11], t[15] = a[15];return t;
	    }, o.SIMD.transpose = function (t, a) {
	      var n, r, o, u, l, e, M, s, i, c;return n = SIMD.Float32x4.load(a, 0), r = SIMD.Float32x4.load(a, 4), o = SIMD.Float32x4.load(a, 8), u = SIMD.Float32x4.load(a, 12), l = SIMD.Float32x4.shuffle(n, r, 0, 1, 4, 5), e = SIMD.Float32x4.shuffle(o, u, 0, 1, 4, 5), M = SIMD.Float32x4.shuffle(l, e, 0, 2, 4, 6), s = SIMD.Float32x4.shuffle(l, e, 1, 3, 5, 7), SIMD.Float32x4.store(t, 0, M), SIMD.Float32x4.store(t, 4, s), l = SIMD.Float32x4.shuffle(n, r, 2, 3, 6, 7), e = SIMD.Float32x4.shuffle(o, u, 2, 3, 6, 7), i = SIMD.Float32x4.shuffle(l, e, 0, 2, 4, 6), c = SIMD.Float32x4.shuffle(l, e, 1, 3, 5, 7), SIMD.Float32x4.store(t, 8, i), SIMD.Float32x4.store(t, 12, c), t;
	    }, o.transpose = r.USE_SIMD ? o.SIMD.transpose : o.scalar.transpose, o.scalar.invert = function (t, a) {
	      var n = a[0],
	          r = a[1],
	          o = a[2],
	          u = a[3],
	          l = a[4],
	          e = a[5],
	          M = a[6],
	          s = a[7],
	          i = a[8],
	          c = a[9],
	          h = a[10],
	          S = a[11],
	          I = a[12],
	          f = a[13],
	          x = a[14],
	          D = a[15],
	          F = n * e - r * l,
	          m = n * M - o * l,
	          d = n * s - u * l,
	          b = r * M - o * e,
	          v = r * s - u * e,
	          z = o * s - u * M,
	          p = i * f - c * I,
	          w = i * x - h * I,
	          E = i * D - S * I,
	          A = c * x - h * f,
	          P = c * D - S * f,
	          L = h * D - S * x,
	          q = F * L - m * P + d * A + b * E - v * w + z * p;return q ? (q = 1 / q, t[0] = (e * L - M * P + s * A) * q, t[1] = (o * P - r * L - u * A) * q, t[2] = (f * z - x * v + D * b) * q, t[3] = (h * v - c * z - S * b) * q, t[4] = (M * E - l * L - s * w) * q, t[5] = (n * L - o * E + u * w) * q, t[6] = (x * d - I * z - D * m) * q, t[7] = (i * z - h * d + S * m) * q, t[8] = (l * P - e * E + s * p) * q, t[9] = (r * E - n * P - u * p) * q, t[10] = (I * v - f * d + D * F) * q, t[11] = (c * d - i * v - S * F) * q, t[12] = (e * w - l * A - M * p) * q, t[13] = (n * A - r * w + o * p) * q, t[14] = (f * m - I * b - x * F) * q, t[15] = (i * b - c * m + h * F) * q, t) : null;
	    }, o.SIMD.invert = function (t, a) {
	      var n,
	          r,
	          o,
	          u,
	          l,
	          e,
	          M,
	          s,
	          i,
	          c,
	          h = SIMD.Float32x4.load(a, 0),
	          S = SIMD.Float32x4.load(a, 4),
	          I = SIMD.Float32x4.load(a, 8),
	          f = SIMD.Float32x4.load(a, 12);return l = SIMD.Float32x4.shuffle(h, S, 0, 1, 4, 5), r = SIMD.Float32x4.shuffle(I, f, 0, 1, 4, 5), n = SIMD.Float32x4.shuffle(l, r, 0, 2, 4, 6), r = SIMD.Float32x4.shuffle(r, l, 1, 3, 5, 7), l = SIMD.Float32x4.shuffle(h, S, 2, 3, 6, 7), u = SIMD.Float32x4.shuffle(I, f, 2, 3, 6, 7), o = SIMD.Float32x4.shuffle(l, u, 0, 2, 4, 6), u = SIMD.Float32x4.shuffle(u, l, 1, 3, 5, 7), l = SIMD.Float32x4.mul(o, u), l = SIMD.Float32x4.swizzle(l, 1, 0, 3, 2), e = SIMD.Float32x4.mul(r, l), M = SIMD.Float32x4.mul(n, l), l = SIMD.Float32x4.swizzle(l, 2, 3, 0, 1), e = SIMD.Float32x4.sub(SIMD.Float32x4.mul(r, l), e), M = SIMD.Float32x4.sub(SIMD.Float32x4.mul(n, l), M), M = SIMD.Float32x4.swizzle(M, 2, 3, 0, 1), l = SIMD.Float32x4.mul(r, o), l = SIMD.Float32x4.swizzle(l, 1, 0, 3, 2), e = SIMD.Float32x4.add(SIMD.Float32x4.mul(u, l), e), i = SIMD.Float32x4.mul(n, l), l = SIMD.Float32x4.swizzle(l, 2, 3, 0, 1), e = SIMD.Float32x4.sub(e, SIMD.Float32x4.mul(u, l)), i = SIMD.Float32x4.sub(SIMD.Float32x4.mul(n, l), i), i = SIMD.Float32x4.swizzle(i, 2, 3, 0, 1), l = SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(r, 2, 3, 0, 1), u), l = SIMD.Float32x4.swizzle(l, 1, 0, 3, 2), o = SIMD.Float32x4.swizzle(o, 2, 3, 0, 1), e = SIMD.Float32x4.add(SIMD.Float32x4.mul(o, l), e), s = SIMD.Float32x4.mul(n, l), l = SIMD.Float32x4.swizzle(l, 2, 3, 0, 1), e = SIMD.Float32x4.sub(e, SIMD.Float32x4.mul(o, l)), s = SIMD.Float32x4.sub(SIMD.Float32x4.mul(n, l), s), s = SIMD.Float32x4.swizzle(s, 2, 3, 0, 1), l = SIMD.Float32x4.mul(n, r), l = SIMD.Float32x4.swizzle(l, 1, 0, 3, 2), s = SIMD.Float32x4.add(SIMD.Float32x4.mul(u, l), s), i = SIMD.Float32x4.sub(SIMD.Float32x4.mul(o, l), i), l = SIMD.Float32x4.swizzle(l, 2, 3, 0, 1), s = SIMD.Float32x4.sub(SIMD.Float32x4.mul(u, l), s), i = SIMD.Float32x4.sub(i, SIMD.Float32x4.mul(o, l)), l = SIMD.Float32x4.mul(n, u), l = SIMD.Float32x4.swizzle(l, 1, 0, 3, 2), M = SIMD.Float32x4.sub(M, SIMD.Float32x4.mul(o, l)), s = SIMD.Float32x4.add(SIMD.Float32x4.mul(r, l), s), l = SIMD.Float32x4.swizzle(l, 2, 3, 0, 1), M = SIMD.Float32x4.add(SIMD.Float32x4.mul(o, l), M), s = SIMD.Float32x4.sub(s, SIMD.Float32x4.mul(r, l)), l = SIMD.Float32x4.mul(n, o), l = SIMD.Float32x4.swizzle(l, 1, 0, 3, 2), M = SIMD.Float32x4.add(SIMD.Float32x4.mul(u, l), M), i = SIMD.Float32x4.sub(i, SIMD.Float32x4.mul(r, l)), l = SIMD.Float32x4.swizzle(l, 2, 3, 0, 1), M = SIMD.Float32x4.sub(M, SIMD.Float32x4.mul(u, l)), i = SIMD.Float32x4.add(SIMD.Float32x4.mul(r, l), i), c = SIMD.Float32x4.mul(n, e), c = SIMD.Float32x4.add(SIMD.Float32x4.swizzle(c, 2, 3, 0, 1), c), c = SIMD.Float32x4.add(SIMD.Float32x4.swizzle(c, 1, 0, 3, 2), c), l = SIMD.Float32x4.reciprocalApproximation(c), c = SIMD.Float32x4.sub(SIMD.Float32x4.add(l, l), SIMD.Float32x4.mul(c, SIMD.Float32x4.mul(l, l))), (c = SIMD.Float32x4.swizzle(c, 0, 0, 0, 0)) ? (SIMD.Float32x4.store(t, 0, SIMD.Float32x4.mul(c, e)), SIMD.Float32x4.store(t, 4, SIMD.Float32x4.mul(c, M)), SIMD.Float32x4.store(t, 8, SIMD.Float32x4.mul(c, s)), SIMD.Float32x4.store(t, 12, SIMD.Float32x4.mul(c, i)), t) : null;
	    }, o.invert = r.USE_SIMD ? o.SIMD.invert : o.scalar.invert, o.scalar.adjoint = function (t, a) {
	      var n = a[0],
	          r = a[1],
	          o = a[2],
	          u = a[3],
	          l = a[4],
	          e = a[5],
	          M = a[6],
	          s = a[7],
	          i = a[8],
	          c = a[9],
	          h = a[10],
	          S = a[11],
	          I = a[12],
	          f = a[13],
	          x = a[14],
	          D = a[15];return t[0] = e * (h * D - S * x) - c * (M * D - s * x) + f * (M * S - s * h), t[1] = -(r * (h * D - S * x) - c * (o * D - u * x) + f * (o * S - u * h)), t[2] = r * (M * D - s * x) - e * (o * D - u * x) + f * (o * s - u * M), t[3] = -(r * (M * S - s * h) - e * (o * S - u * h) + c * (o * s - u * M)), t[4] = -(l * (h * D - S * x) - i * (M * D - s * x) + I * (M * S - s * h)), t[5] = n * (h * D - S * x) - i * (o * D - u * x) + I * (o * S - u * h), t[6] = -(n * (M * D - s * x) - l * (o * D - u * x) + I * (o * s - u * M)), t[7] = n * (M * S - s * h) - l * (o * S - u * h) + i * (o * s - u * M), t[8] = l * (c * D - S * f) - i * (e * D - s * f) + I * (e * S - s * c), t[9] = -(n * (c * D - S * f) - i * (r * D - u * f) + I * (r * S - u * c)), t[10] = n * (e * D - s * f) - l * (r * D - u * f) + I * (r * s - u * e), t[11] = -(n * (e * S - s * c) - l * (r * S - u * c) + i * (r * s - u * e)), t[12] = -(l * (c * x - h * f) - i * (e * x - M * f) + I * (e * h - M * c)), t[13] = n * (c * x - h * f) - i * (r * x - o * f) + I * (r * h - o * c), t[14] = -(n * (e * x - M * f) - l * (r * x - o * f) + I * (r * M - o * e)), t[15] = n * (e * h - M * c) - l * (r * h - o * c) + i * (r * M - o * e), t;
	    }, o.SIMD.adjoint = function (t, a) {
	      var n,
	          r,
	          o,
	          u,
	          l,
	          e,
	          M,
	          s,
	          i,
	          c,
	          h,
	          S,
	          I,
	          n = SIMD.Float32x4.load(a, 0),
	          r = SIMD.Float32x4.load(a, 4),
	          o = SIMD.Float32x4.load(a, 8),
	          u = SIMD.Float32x4.load(a, 12);return i = SIMD.Float32x4.shuffle(n, r, 0, 1, 4, 5), e = SIMD.Float32x4.shuffle(o, u, 0, 1, 4, 5), l = SIMD.Float32x4.shuffle(i, e, 0, 2, 4, 6), e = SIMD.Float32x4.shuffle(e, i, 1, 3, 5, 7), i = SIMD.Float32x4.shuffle(n, r, 2, 3, 6, 7), s = SIMD.Float32x4.shuffle(o, u, 2, 3, 6, 7), M = SIMD.Float32x4.shuffle(i, s, 0, 2, 4, 6), s = SIMD.Float32x4.shuffle(s, i, 1, 3, 5, 7), i = SIMD.Float32x4.mul(M, s), i = SIMD.Float32x4.swizzle(i, 1, 0, 3, 2), c = SIMD.Float32x4.mul(e, i), h = SIMD.Float32x4.mul(l, i), i = SIMD.Float32x4.swizzle(i, 2, 3, 0, 1), c = SIMD.Float32x4.sub(SIMD.Float32x4.mul(e, i), c), h = SIMD.Float32x4.sub(SIMD.Float32x4.mul(l, i), h), h = SIMD.Float32x4.swizzle(h, 2, 3, 0, 1), i = SIMD.Float32x4.mul(e, M), i = SIMD.Float32x4.swizzle(i, 1, 0, 3, 2), c = SIMD.Float32x4.add(SIMD.Float32x4.mul(s, i), c), I = SIMD.Float32x4.mul(l, i), i = SIMD.Float32x4.swizzle(i, 2, 3, 0, 1), c = SIMD.Float32x4.sub(c, SIMD.Float32x4.mul(s, i)), I = SIMD.Float32x4.sub(SIMD.Float32x4.mul(l, i), I), I = SIMD.Float32x4.swizzle(I, 2, 3, 0, 1), i = SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(e, 2, 3, 0, 1), s), i = SIMD.Float32x4.swizzle(i, 1, 0, 3, 2), M = SIMD.Float32x4.swizzle(M, 2, 3, 0, 1), c = SIMD.Float32x4.add(SIMD.Float32x4.mul(M, i), c), S = SIMD.Float32x4.mul(l, i), i = SIMD.Float32x4.swizzle(i, 2, 3, 0, 1), c = SIMD.Float32x4.sub(c, SIMD.Float32x4.mul(M, i)), S = SIMD.Float32x4.sub(SIMD.Float32x4.mul(l, i), S), S = SIMD.Float32x4.swizzle(S, 2, 3, 0, 1), i = SIMD.Float32x4.mul(l, e), i = SIMD.Float32x4.swizzle(i, 1, 0, 3, 2), S = SIMD.Float32x4.add(SIMD.Float32x4.mul(s, i), S), I = SIMD.Float32x4.sub(SIMD.Float32x4.mul(M, i), I), i = SIMD.Float32x4.swizzle(i, 2, 3, 0, 1), S = SIMD.Float32x4.sub(SIMD.Float32x4.mul(s, i), S), I = SIMD.Float32x4.sub(I, SIMD.Float32x4.mul(M, i)), i = SIMD.Float32x4.mul(l, s), i = SIMD.Float32x4.swizzle(i, 1, 0, 3, 2), h = SIMD.Float32x4.sub(h, SIMD.Float32x4.mul(M, i)), S = SIMD.Float32x4.add(SIMD.Float32x4.mul(e, i), S), i = SIMD.Float32x4.swizzle(i, 2, 3, 0, 1), h = SIMD.Float32x4.add(SIMD.Float32x4.mul(M, i), h), S = SIMD.Float32x4.sub(S, SIMD.Float32x4.mul(e, i)), i = SIMD.Float32x4.mul(l, M), i = SIMD.Float32x4.swizzle(i, 1, 0, 3, 2), h = SIMD.Float32x4.add(SIMD.Float32x4.mul(s, i), h), I = SIMD.Float32x4.sub(I, SIMD.Float32x4.mul(e, i)), i = SIMD.Float32x4.swizzle(i, 2, 3, 0, 1), h = SIMD.Float32x4.sub(h, SIMD.Float32x4.mul(s, i)), I = SIMD.Float32x4.add(SIMD.Float32x4.mul(e, i), I), SIMD.Float32x4.store(t, 0, c), SIMD.Float32x4.store(t, 4, h), SIMD.Float32x4.store(t, 8, S), SIMD.Float32x4.store(t, 12, I), t;
	    }, o.adjoint = r.USE_SIMD ? o.SIMD.adjoint : o.scalar.adjoint, o.determinant = function (t) {
	      var a = t[0],
	          n = t[1],
	          r = t[2],
	          o = t[3],
	          u = t[4],
	          l = t[5],
	          e = t[6],
	          M = t[7],
	          s = t[8],
	          i = t[9],
	          c = t[10],
	          h = t[11],
	          S = t[12],
	          I = t[13],
	          f = t[14],
	          x = t[15],
	          D = a * l - n * u,
	          F = a * e - r * u,
	          m = a * M - o * u,
	          d = n * e - r * l,
	          b = n * M - o * l,
	          v = r * M - o * e,
	          z = s * I - i * S,
	          p = s * f - c * S,
	          w = s * x - h * S,
	          E = i * f - c * I,
	          A = i * x - h * I,
	          P = c * x - h * f;return D * P - F * A + m * E + d * w - b * p + v * z;
	    }, o.SIMD.multiply = function (t, a, n) {
	      var r = SIMD.Float32x4.load(a, 0),
	          o = SIMD.Float32x4.load(a, 4),
	          u = SIMD.Float32x4.load(a, 8),
	          l = SIMD.Float32x4.load(a, 12),
	          e = SIMD.Float32x4.load(n, 0),
	          M = SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(e, 0, 0, 0, 0), r), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(e, 1, 1, 1, 1), o), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(e, 2, 2, 2, 2), u), SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(e, 3, 3, 3, 3), l))));SIMD.Float32x4.store(t, 0, M);var s = SIMD.Float32x4.load(n, 4),
	          i = SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(s, 0, 0, 0, 0), r), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(s, 1, 1, 1, 1), o), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(s, 2, 2, 2, 2), u), SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(s, 3, 3, 3, 3), l))));SIMD.Float32x4.store(t, 4, i);var c = SIMD.Float32x4.load(n, 8),
	          h = SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(c, 0, 0, 0, 0), r), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(c, 1, 1, 1, 1), o), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(c, 2, 2, 2, 2), u), SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(c, 3, 3, 3, 3), l))));SIMD.Float32x4.store(t, 8, h);var S = SIMD.Float32x4.load(n, 12),
	          I = SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(S, 0, 0, 0, 0), r), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(S, 1, 1, 1, 1), o), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(S, 2, 2, 2, 2), u), SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(S, 3, 3, 3, 3), l))));return SIMD.Float32x4.store(t, 12, I), t;
	    }, o.scalar.multiply = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          u = a[2],
	          l = a[3],
	          e = a[4],
	          M = a[5],
	          s = a[6],
	          i = a[7],
	          c = a[8],
	          h = a[9],
	          S = a[10],
	          I = a[11],
	          f = a[12],
	          x = a[13],
	          D = a[14],
	          F = a[15],
	          m = n[0],
	          d = n[1],
	          b = n[2],
	          v = n[3];return t[0] = m * r + d * e + b * c + v * f, t[1] = m * o + d * M + b * h + v * x, t[2] = m * u + d * s + b * S + v * D, t[3] = m * l + d * i + b * I + v * F, m = n[4], d = n[5], b = n[6], v = n[7], t[4] = m * r + d * e + b * c + v * f, t[5] = m * o + d * M + b * h + v * x, t[6] = m * u + d * s + b * S + v * D, t[7] = m * l + d * i + b * I + v * F, m = n[8], d = n[9], b = n[10], v = n[11], t[8] = m * r + d * e + b * c + v * f, t[9] = m * o + d * M + b * h + v * x, t[10] = m * u + d * s + b * S + v * D, t[11] = m * l + d * i + b * I + v * F, m = n[12], d = n[13], b = n[14], v = n[15], t[12] = m * r + d * e + b * c + v * f, t[13] = m * o + d * M + b * h + v * x, t[14] = m * u + d * s + b * S + v * D, t[15] = m * l + d * i + b * I + v * F, t;
	    }, o.multiply = r.USE_SIMD ? o.SIMD.multiply : o.scalar.multiply, o.mul = o.multiply, o.scalar.translate = function (t, a, n) {
	      var r,
	          o,
	          u,
	          l,
	          e,
	          M,
	          s,
	          i,
	          c,
	          h,
	          S,
	          I,
	          f = n[0],
	          x = n[1],
	          D = n[2];return a === t ? (t[12] = a[0] * f + a[4] * x + a[8] * D + a[12], t[13] = a[1] * f + a[5] * x + a[9] * D + a[13], t[14] = a[2] * f + a[6] * x + a[10] * D + a[14], t[15] = a[3] * f + a[7] * x + a[11] * D + a[15]) : (r = a[0], o = a[1], u = a[2], l = a[3], e = a[4], M = a[5], s = a[6], i = a[7], c = a[8], h = a[9], S = a[10], I = a[11], t[0] = r, t[1] = o, t[2] = u, t[3] = l, t[4] = e, t[5] = M, t[6] = s, t[7] = i, t[8] = c, t[9] = h, t[10] = S, t[11] = I, t[12] = r * f + e * x + c * D + a[12], t[13] = o * f + M * x + h * D + a[13], t[14] = u * f + s * x + S * D + a[14], t[15] = l * f + i * x + I * D + a[15]), t;
	    }, o.SIMD.translate = function (t, a, n) {
	      var r = SIMD.Float32x4.load(a, 0),
	          o = SIMD.Float32x4.load(a, 4),
	          u = SIMD.Float32x4.load(a, 8),
	          l = SIMD.Float32x4.load(a, 12),
	          e = SIMD.Float32x4(n[0], n[1], n[2], 0);a !== t && (t[0] = a[0], t[1] = a[1], t[2] = a[2], t[3] = a[3], t[4] = a[4], t[5] = a[5], t[6] = a[6], t[7] = a[7], t[8] = a[8], t[9] = a[9], t[10] = a[10], t[11] = a[11]), r = SIMD.Float32x4.mul(r, SIMD.Float32x4.swizzle(e, 0, 0, 0, 0)), o = SIMD.Float32x4.mul(o, SIMD.Float32x4.swizzle(e, 1, 1, 1, 1)), u = SIMD.Float32x4.mul(u, SIMD.Float32x4.swizzle(e, 2, 2, 2, 2));var M = SIMD.Float32x4.add(r, SIMD.Float32x4.add(o, SIMD.Float32x4.add(u, l)));return SIMD.Float32x4.store(t, 12, M), t;
	    }, o.translate = r.USE_SIMD ? o.SIMD.translate : o.scalar.translate, o.scalar.scale = function (t, a, n) {
	      var r = n[0],
	          o = n[1],
	          u = n[2];return t[0] = a[0] * r, t[1] = a[1] * r, t[2] = a[2] * r, t[3] = a[3] * r, t[4] = a[4] * o, t[5] = a[5] * o, t[6] = a[6] * o, t[7] = a[7] * o, t[8] = a[8] * u, t[9] = a[9] * u, t[10] = a[10] * u, t[11] = a[11] * u, t[12] = a[12], t[13] = a[13], t[14] = a[14], t[15] = a[15], t;
	    }, o.SIMD.scale = function (t, a, n) {
	      var r,
	          o,
	          u,
	          l = SIMD.Float32x4(n[0], n[1], n[2], 0);return r = SIMD.Float32x4.load(a, 0), SIMD.Float32x4.store(t, 0, SIMD.Float32x4.mul(r, SIMD.Float32x4.swizzle(l, 0, 0, 0, 0))), o = SIMD.Float32x4.load(a, 4), SIMD.Float32x4.store(t, 4, SIMD.Float32x4.mul(o, SIMD.Float32x4.swizzle(l, 1, 1, 1, 1))), u = SIMD.Float32x4.load(a, 8), SIMD.Float32x4.store(t, 8, SIMD.Float32x4.mul(u, SIMD.Float32x4.swizzle(l, 2, 2, 2, 2))), t[12] = a[12], t[13] = a[13], t[14] = a[14], t[15] = a[15], t;
	    }, o.scale = r.USE_SIMD ? o.SIMD.scale : o.scalar.scale, o.rotate = function (t, a, n, o) {
	      var u,
	          l,
	          e,
	          M,
	          s,
	          i,
	          c,
	          h,
	          S,
	          I,
	          f,
	          x,
	          D,
	          F,
	          m,
	          d,
	          b,
	          v,
	          z,
	          p,
	          w,
	          E,
	          A,
	          P,
	          L = o[0],
	          q = o[1],
	          R = o[2],
	          N = Math.sqrt(L * L + q * q + R * R);return Math.abs(N) < r.EPSILON ? null : (N = 1 / N, L *= N, q *= N, R *= N, u = Math.sin(n), l = Math.cos(n), e = 1 - l, M = a[0], s = a[1], i = a[2], c = a[3], h = a[4], S = a[5], I = a[6], f = a[7], x = a[8], D = a[9], F = a[10], m = a[11], d = L * L * e + l, b = q * L * e + R * u, v = R * L * e - q * u, z = L * q * e - R * u, p = q * q * e + l, w = R * q * e + L * u, E = L * R * e + q * u, A = q * R * e - L * u, P = R * R * e + l, t[0] = M * d + h * b + x * v, t[1] = s * d + S * b + D * v, t[2] = i * d + I * b + F * v, t[3] = c * d + f * b + m * v, t[4] = M * z + h * p + x * w, t[5] = s * z + S * p + D * w, t[6] = i * z + I * p + F * w, t[7] = c * z + f * p + m * w, t[8] = M * E + h * A + x * P, t[9] = s * E + S * A + D * P, t[10] = i * E + I * A + F * P, t[11] = c * E + f * A + m * P, a !== t && (t[12] = a[12], t[13] = a[13], t[14] = a[14], t[15] = a[15]), t);
	    }, o.scalar.rotateX = function (t, a, n) {
	      var r = Math.sin(n),
	          o = Math.cos(n),
	          u = a[4],
	          l = a[5],
	          e = a[6],
	          M = a[7],
	          s = a[8],
	          i = a[9],
	          c = a[10],
	          h = a[11];return a !== t && (t[0] = a[0], t[1] = a[1], t[2] = a[2], t[3] = a[3], t[12] = a[12], t[13] = a[13], t[14] = a[14], t[15] = a[15]), t[4] = u * o + s * r, t[5] = l * o + i * r, t[6] = e * o + c * r, t[7] = M * o + h * r, t[8] = s * o - u * r, t[9] = i * o - l * r, t[10] = c * o - e * r, t[11] = h * o - M * r, t;
	    }, o.SIMD.rotateX = function (t, a, n) {
	      var r = SIMD.Float32x4.splat(Math.sin(n)),
	          o = SIMD.Float32x4.splat(Math.cos(n));a !== t && (t[0] = a[0], t[1] = a[1], t[2] = a[2], t[3] = a[3], t[12] = a[12], t[13] = a[13], t[14] = a[14], t[15] = a[15]);var u = SIMD.Float32x4.load(a, 4),
	          l = SIMD.Float32x4.load(a, 8);return SIMD.Float32x4.store(t, 4, SIMD.Float32x4.add(SIMD.Float32x4.mul(u, o), SIMD.Float32x4.mul(l, r))), SIMD.Float32x4.store(t, 8, SIMD.Float32x4.sub(SIMD.Float32x4.mul(l, o), SIMD.Float32x4.mul(u, r))), t;
	    }, o.rotateX = r.USE_SIMD ? o.SIMD.rotateX : o.scalar.rotateX, o.scalar.rotateY = function (t, a, n) {
	      var r = Math.sin(n),
	          o = Math.cos(n),
	          u = a[0],
	          l = a[1],
	          e = a[2],
	          M = a[3],
	          s = a[8],
	          i = a[9],
	          c = a[10],
	          h = a[11];return a !== t && (t[4] = a[4], t[5] = a[5], t[6] = a[6], t[7] = a[7], t[12] = a[12], t[13] = a[13], t[14] = a[14], t[15] = a[15]), t[0] = u * o - s * r, t[1] = l * o - i * r, t[2] = e * o - c * r, t[3] = M * o - h * r, t[8] = u * r + s * o, t[9] = l * r + i * o, t[10] = e * r + c * o, t[11] = M * r + h * o, t;
	    }, o.SIMD.rotateY = function (t, a, n) {
	      var r = SIMD.Float32x4.splat(Math.sin(n)),
	          o = SIMD.Float32x4.splat(Math.cos(n));a !== t && (t[4] = a[4], t[5] = a[5], t[6] = a[6], t[7] = a[7], t[12] = a[12], t[13] = a[13], t[14] = a[14], t[15] = a[15]);var u = SIMD.Float32x4.load(a, 0),
	          l = SIMD.Float32x4.load(a, 8);return SIMD.Float32x4.store(t, 0, SIMD.Float32x4.sub(SIMD.Float32x4.mul(u, o), SIMD.Float32x4.mul(l, r))), SIMD.Float32x4.store(t, 8, SIMD.Float32x4.add(SIMD.Float32x4.mul(u, r), SIMD.Float32x4.mul(l, o))), t;
	    }, o.rotateY = r.USE_SIMD ? o.SIMD.rotateY : o.scalar.rotateY, o.scalar.rotateZ = function (t, a, n) {
	      var r = Math.sin(n),
	          o = Math.cos(n),
	          u = a[0],
	          l = a[1],
	          e = a[2],
	          M = a[3],
	          s = a[4],
	          i = a[5],
	          c = a[6],
	          h = a[7];return a !== t && (t[8] = a[8], t[9] = a[9], t[10] = a[10], t[11] = a[11], t[12] = a[12], t[13] = a[13], t[14] = a[14], t[15] = a[15]), t[0] = u * o + s * r, t[1] = l * o + i * r, t[2] = e * o + c * r, t[3] = M * o + h * r, t[4] = s * o - u * r, t[5] = i * o - l * r, t[6] = c * o - e * r, t[7] = h * o - M * r, t;
	    }, o.SIMD.rotateZ = function (t, a, n) {
	      var r = SIMD.Float32x4.splat(Math.sin(n)),
	          o = SIMD.Float32x4.splat(Math.cos(n));a !== t && (t[8] = a[8], t[9] = a[9], t[10] = a[10], t[11] = a[11], t[12] = a[12], t[13] = a[13], t[14] = a[14], t[15] = a[15]);var u = SIMD.Float32x4.load(a, 0),
	          l = SIMD.Float32x4.load(a, 4);return SIMD.Float32x4.store(t, 0, SIMD.Float32x4.add(SIMD.Float32x4.mul(u, o), SIMD.Float32x4.mul(l, r))), SIMD.Float32x4.store(t, 4, SIMD.Float32x4.sub(SIMD.Float32x4.mul(l, o), SIMD.Float32x4.mul(u, r))), t;
	    }, o.rotateZ = r.USE_SIMD ? o.SIMD.rotateZ : o.scalar.rotateZ, o.fromTranslation = function (t, a) {
	      return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = a[0], t[13] = a[1], t[14] = a[2], t[15] = 1, t;
	    }, o.fromScaling = function (t, a) {
	      return t[0] = a[0], t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = a[1], t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = a[2], t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t;
	    }, o.fromRotation = function (t, a, n) {
	      var o,
	          u,
	          l,
	          e = n[0],
	          M = n[1],
	          s = n[2],
	          i = Math.sqrt(e * e + M * M + s * s);return Math.abs(i) < r.EPSILON ? null : (i = 1 / i, e *= i, M *= i, s *= i, o = Math.sin(a), u = Math.cos(a), l = 1 - u, t[0] = e * e * l + u, t[1] = M * e * l + s * o, t[2] = s * e * l - M * o, t[3] = 0, t[4] = e * M * l - s * o, t[5] = M * M * l + u, t[6] = s * M * l + e * o, t[7] = 0, t[8] = e * s * l + M * o, t[9] = M * s * l - e * o, t[10] = s * s * l + u, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t);
	    }, o.fromXRotation = function (t, a) {
	      var n = Math.sin(a),
	          r = Math.cos(a);return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = r, t[6] = n, t[7] = 0, t[8] = 0, t[9] = -n, t[10] = r, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t;
	    }, o.fromYRotation = function (t, a) {
	      var n = Math.sin(a),
	          r = Math.cos(a);return t[0] = r, t[1] = 0, t[2] = -n, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = n, t[9] = 0, t[10] = r, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t;
	    }, o.fromZRotation = function (t, a) {
	      var n = Math.sin(a),
	          r = Math.cos(a);return t[0] = r, t[1] = n, t[2] = 0, t[3] = 0, t[4] = -n, t[5] = r, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t;
	    }, o.fromRotationTranslation = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          u = a[2],
	          l = a[3],
	          e = r + r,
	          M = o + o,
	          s = u + u,
	          i = r * e,
	          c = r * M,
	          h = r * s,
	          S = o * M,
	          I = o * s,
	          f = u * s,
	          x = l * e,
	          D = l * M,
	          F = l * s;return t[0] = 1 - (S + f), t[1] = c + F, t[2] = h - D, t[3] = 0, t[4] = c - F, t[5] = 1 - (i + f), t[6] = I + x, t[7] = 0, t[8] = h + D, t[9] = I - x, t[10] = 1 - (i + S), t[11] = 0, t[12] = n[0], t[13] = n[1], t[14] = n[2], t[15] = 1, t;
	    }, o.getTranslation = function (t, a) {
	      return t[0] = a[12], t[1] = a[13], t[2] = a[14], t;
	    }, o.getRotation = function (t, a) {
	      var n = a[0] + a[5] + a[10],
	          r = 0;return n > 0 ? (r = 2 * Math.sqrt(n + 1), t[3] = .25 * r, t[0] = (a[6] - a[9]) / r, t[1] = (a[8] - a[2]) / r, t[2] = (a[1] - a[4]) / r) : a[0] > a[5] & a[0] > a[10] ? (r = 2 * Math.sqrt(1 + a[0] - a[5] - a[10]), t[3] = (a[6] - a[9]) / r, t[0] = .25 * r, t[1] = (a[1] + a[4]) / r, t[2] = (a[8] + a[2]) / r) : a[5] > a[10] ? (r = 2 * Math.sqrt(1 + a[5] - a[0] - a[10]), t[3] = (a[8] - a[2]) / r, t[0] = (a[1] + a[4]) / r, t[1] = .25 * r, t[2] = (a[6] + a[9]) / r) : (r = 2 * Math.sqrt(1 + a[10] - a[0] - a[5]), t[3] = (a[1] - a[4]) / r, t[0] = (a[8] + a[2]) / r, t[1] = (a[6] + a[9]) / r, t[2] = .25 * r), t;
	    }, o.fromRotationTranslationScale = function (t, a, n, r) {
	      var o = a[0],
	          u = a[1],
	          l = a[2],
	          e = a[3],
	          M = o + o,
	          s = u + u,
	          i = l + l,
	          c = o * M,
	          h = o * s,
	          S = o * i,
	          I = u * s,
	          f = u * i,
	          x = l * i,
	          D = e * M,
	          F = e * s,
	          m = e * i,
	          d = r[0],
	          b = r[1],
	          v = r[2];return t[0] = (1 - (I + x)) * d, t[1] = (h + m) * d, t[2] = (S - F) * d, t[3] = 0, t[4] = (h - m) * b, t[5] = (1 - (c + x)) * b, t[6] = (f + D) * b, t[7] = 0, t[8] = (S + F) * v, t[9] = (f - D) * v, t[10] = (1 - (c + I)) * v, t[11] = 0, t[12] = n[0], t[13] = n[1], t[14] = n[2], t[15] = 1, t;
	    }, o.fromRotationTranslationScaleOrigin = function (t, a, n, r, o) {
	      var u = a[0],
	          l = a[1],
	          e = a[2],
	          M = a[3],
	          s = u + u,
	          i = l + l,
	          c = e + e,
	          h = u * s,
	          S = u * i,
	          I = u * c,
	          f = l * i,
	          x = l * c,
	          D = e * c,
	          F = M * s,
	          m = M * i,
	          d = M * c,
	          b = r[0],
	          v = r[1],
	          z = r[2],
	          p = o[0],
	          w = o[1],
	          E = o[2];return t[0] = (1 - (f + D)) * b, t[1] = (S + d) * b, t[2] = (I - m) * b, t[3] = 0, t[4] = (S - d) * v, t[5] = (1 - (h + D)) * v, t[6] = (x + F) * v, t[7] = 0, t[8] = (I + m) * z, t[9] = (x - F) * z, t[10] = (1 - (h + f)) * z, t[11] = 0, t[12] = n[0] + p - (t[0] * p + t[4] * w + t[8] * E), t[13] = n[1] + w - (t[1] * p + t[5] * w + t[9] * E), t[14] = n[2] + E - (t[2] * p + t[6] * w + t[10] * E), t[15] = 1, t;
	    }, o.fromQuat = function (t, a) {
	      var n = a[0],
	          r = a[1],
	          o = a[2],
	          u = a[3],
	          l = n + n,
	          e = r + r,
	          M = o + o,
	          s = n * l,
	          i = r * l,
	          c = r * e,
	          h = o * l,
	          S = o * e,
	          I = o * M,
	          f = u * l,
	          x = u * e,
	          D = u * M;return t[0] = 1 - c - I, t[1] = i + D, t[2] = h - x, t[3] = 0, t[4] = i - D, t[5] = 1 - s - I, t[6] = S + f, t[7] = 0, t[8] = h + x, t[9] = S - f, t[10] = 1 - s - c, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t;
	    }, o.frustum = function (t, a, n, r, o, u, l) {
	      var e = 1 / (n - a),
	          M = 1 / (o - r),
	          s = 1 / (u - l);return t[0] = 2 * u * e, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 2 * u * M, t[6] = 0, t[7] = 0, t[8] = (n + a) * e, t[9] = (o + r) * M, t[10] = (l + u) * s, t[11] = -1, t[12] = 0, t[13] = 0, t[14] = l * u * 2 * s, t[15] = 0, t;
	    }, o.perspective = function (t, a, n, r, o) {
	      var u = 1 / Math.tan(a / 2),
	          l = 1 / (r - o);return t[0] = u / n, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = u, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = (o + r) * l, t[11] = -1, t[12] = 0, t[13] = 0, t[14] = 2 * o * r * l, t[15] = 0, t;
	    }, o.perspectiveFromFieldOfView = function (t, a, n, r) {
	      var o = Math.tan(a.upDegrees * Math.PI / 180),
	          u = Math.tan(a.downDegrees * Math.PI / 180),
	          l = Math.tan(a.leftDegrees * Math.PI / 180),
	          e = Math.tan(a.rightDegrees * Math.PI / 180),
	          M = 2 / (l + e),
	          s = 2 / (o + u);return t[0] = M, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = s, t[6] = 0, t[7] = 0, t[8] = -((l - e) * M * .5), t[9] = (o - u) * s * .5, t[10] = r / (n - r), t[11] = -1, t[12] = 0, t[13] = 0, t[14] = r * n / (n - r), t[15] = 0, t;
	    }, o.ortho = function (t, a, n, r, o, u, l) {
	      var e = 1 / (a - n),
	          M = 1 / (r - o),
	          s = 1 / (u - l);return t[0] = -2 * e, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = -2 * M, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 2 * s, t[11] = 0, t[12] = (a + n) * e, t[13] = (o + r) * M, t[14] = (l + u) * s, t[15] = 1, t;
	    }, o.lookAt = function (t, a, n, u) {
	      var l,
	          e,
	          M,
	          s,
	          i,
	          c,
	          h,
	          S,
	          I,
	          f,
	          x = a[0],
	          D = a[1],
	          F = a[2],
	          m = u[0],
	          d = u[1],
	          b = u[2],
	          v = n[0],
	          z = n[1],
	          p = n[2];return Math.abs(x - v) < r.EPSILON && Math.abs(D - z) < r.EPSILON && Math.abs(F - p) < r.EPSILON ? o.identity(t) : (h = x - v, S = D - z, I = F - p, f = 1 / Math.sqrt(h * h + S * S + I * I), h *= f, S *= f, I *= f, l = d * I - b * S, e = b * h - m * I, M = m * S - d * h, f = Math.sqrt(l * l + e * e + M * M), f ? (f = 1 / f, l *= f, e *= f, M *= f) : (l = 0, e = 0, M = 0), s = S * M - I * e, i = I * l - h * M, c = h * e - S * l, f = Math.sqrt(s * s + i * i + c * c), f ? (f = 1 / f, s *= f, i *= f, c *= f) : (s = 0, i = 0, c = 0), t[0] = l, t[1] = s, t[2] = h, t[3] = 0, t[4] = e, t[5] = i, t[6] = S, t[7] = 0, t[8] = M, t[9] = c, t[10] = I, t[11] = 0, t[12] = -(l * x + e * D + M * F), t[13] = -(s * x + i * D + c * F), t[14] = -(h * x + S * D + I * F), t[15] = 1, t);
	    }, o.str = function (t) {
	      return "mat4(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ", " + t[6] + ", " + t[7] + ", " + t[8] + ", " + t[9] + ", " + t[10] + ", " + t[11] + ", " + t[12] + ", " + t[13] + ", " + t[14] + ", " + t[15] + ")";
	    }, o.frob = function (t) {
	      return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2) + Math.pow(t[4], 2) + Math.pow(t[5], 2) + Math.pow(t[6], 2) + Math.pow(t[7], 2) + Math.pow(t[8], 2) + Math.pow(t[9], 2) + Math.pow(t[10], 2) + Math.pow(t[11], 2) + Math.pow(t[12], 2) + Math.pow(t[13], 2) + Math.pow(t[14], 2) + Math.pow(t[15], 2));
	    }, o.add = function (t, a, n) {
	      return t[0] = a[0] + n[0], t[1] = a[1] + n[1], t[2] = a[2] + n[2], t[3] = a[3] + n[3], t[4] = a[4] + n[4], t[5] = a[5] + n[5], t[6] = a[6] + n[6], t[7] = a[7] + n[7], t[8] = a[8] + n[8], t[9] = a[9] + n[9], t[10] = a[10] + n[10], t[11] = a[11] + n[11], t[12] = a[12] + n[12], t[13] = a[13] + n[13], t[14] = a[14] + n[14], t[15] = a[15] + n[15], t;
	    }, o.subtract = function (t, a, n) {
	      return t[0] = a[0] - n[0], t[1] = a[1] - n[1], t[2] = a[2] - n[2], t[3] = a[3] - n[3], t[4] = a[4] - n[4], t[5] = a[5] - n[5], t[6] = a[6] - n[6], t[7] = a[7] - n[7], t[8] = a[8] - n[8], t[9] = a[9] - n[9], t[10] = a[10] - n[10], t[11] = a[11] - n[11], t[12] = a[12] - n[12], t[13] = a[13] - n[13], t[14] = a[14] - n[14], t[15] = a[15] - n[15], t;
	    }, o.sub = o.subtract, o.multiplyScalar = function (t, a, n) {
	      return t[0] = a[0] * n, t[1] = a[1] * n, t[2] = a[2] * n, t[3] = a[3] * n, t[4] = a[4] * n, t[5] = a[5] * n, t[6] = a[6] * n, t[7] = a[7] * n, t[8] = a[8] * n, t[9] = a[9] * n, t[10] = a[10] * n, t[11] = a[11] * n, t[12] = a[12] * n, t[13] = a[13] * n, t[14] = a[14] * n, t[15] = a[15] * n, t;
	    }, o.multiplyScalarAndAdd = function (t, a, n, r) {
	      return t[0] = a[0] + n[0] * r, t[1] = a[1] + n[1] * r, t[2] = a[2] + n[2] * r, t[3] = a[3] + n[3] * r, t[4] = a[4] + n[4] * r, t[5] = a[5] + n[5] * r, t[6] = a[6] + n[6] * r, t[7] = a[7] + n[7] * r, t[8] = a[8] + n[8] * r, t[9] = a[9] + n[9] * r, t[10] = a[10] + n[10] * r, t[11] = a[11] + n[11] * r, t[12] = a[12] + n[12] * r, t[13] = a[13] + n[13] * r, t[14] = a[14] + n[14] * r, t[15] = a[15] + n[15] * r, t;
	    }, o.exactEquals = function (t, a) {
	      return t[0] === a[0] && t[1] === a[1] && t[2] === a[2] && t[3] === a[3] && t[4] === a[4] && t[5] === a[5] && t[6] === a[6] && t[7] === a[7] && t[8] === a[8] && t[9] === a[9] && t[10] === a[10] && t[11] === a[11] && t[12] === a[12] && t[13] === a[13] && t[14] === a[14] && t[15] === a[15];
	    }, o.equals = function (t, a) {
	      var n = t[0],
	          o = t[1],
	          u = t[2],
	          l = t[3],
	          e = t[4],
	          M = t[5],
	          s = t[6],
	          i = t[7],
	          c = t[8],
	          h = t[9],
	          S = t[10],
	          I = t[11],
	          f = t[12],
	          x = t[13],
	          D = t[14],
	          F = t[15],
	          m = a[0],
	          d = a[1],
	          b = a[2],
	          v = a[3],
	          z = a[4],
	          p = a[5],
	          w = a[6],
	          E = a[7],
	          A = a[8],
	          P = a[9],
	          L = a[10],
	          q = a[11],
	          R = a[12],
	          N = a[13],
	          O = a[14],
	          Y = a[15];return Math.abs(n - m) <= r.EPSILON * Math.max(1, Math.abs(n), Math.abs(m)) && Math.abs(o - d) <= r.EPSILON * Math.max(1, Math.abs(o), Math.abs(d)) && Math.abs(u - b) <= r.EPSILON * Math.max(1, Math.abs(u), Math.abs(b)) && Math.abs(l - v) <= r.EPSILON * Math.max(1, Math.abs(l), Math.abs(v)) && Math.abs(e - z) <= r.EPSILON * Math.max(1, Math.abs(e), Math.abs(z)) && Math.abs(M - p) <= r.EPSILON * Math.max(1, Math.abs(M), Math.abs(p)) && Math.abs(s - w) <= r.EPSILON * Math.max(1, Math.abs(s), Math.abs(w)) && Math.abs(i - E) <= r.EPSILON * Math.max(1, Math.abs(i), Math.abs(E)) && Math.abs(c - A) <= r.EPSILON * Math.max(1, Math.abs(c), Math.abs(A)) && Math.abs(h - P) <= r.EPSILON * Math.max(1, Math.abs(h), Math.abs(P)) && Math.abs(S - L) <= r.EPSILON * Math.max(1, Math.abs(S), Math.abs(L)) && Math.abs(I - q) <= r.EPSILON * Math.max(1, Math.abs(I), Math.abs(q)) && Math.abs(f - R) <= r.EPSILON * Math.max(1, Math.abs(f), Math.abs(R)) && Math.abs(x - N) <= r.EPSILON * Math.max(1, Math.abs(x), Math.abs(N)) && Math.abs(D - O) <= r.EPSILON * Math.max(1, Math.abs(D), Math.abs(O)) && Math.abs(F - Y) <= r.EPSILON * Math.max(1, Math.abs(F), Math.abs(Y));
	    }, t.exports = o;
	  }, function (t, a, n) {
	    var r = n(1),
	        o = n(4),
	        u = n(7),
	        l = n(8),
	        e = {};e.create = function () {
	      var t = new r.ARRAY_TYPE(4);return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 1, t;
	    }, e.rotationTo = function () {
	      var t = u.create(),
	          a = u.fromValues(1, 0, 0),
	          n = u.fromValues(0, 1, 0);return function (r, o, l) {
	        var M = u.dot(o, l);return -.999999 > M ? (u.cross(t, a, o), u.length(t) < 1e-6 && u.cross(t, n, o), u.normalize(t, t), e.setAxisAngle(r, t, Math.PI), r) : M > .999999 ? (r[0] = 0, r[1] = 0, r[2] = 0, r[3] = 1, r) : (u.cross(t, o, l), r[0] = t[0], r[1] = t[1], r[2] = t[2], r[3] = 1 + M, e.normalize(r, r));
	      };
	    }(), e.setAxes = function () {
	      var t = o.create();return function (a, n, r, o) {
	        return t[0] = r[0], t[3] = r[1], t[6] = r[2], t[1] = o[0], t[4] = o[1], t[7] = o[2], t[2] = -n[0], t[5] = -n[1], t[8] = -n[2], e.normalize(a, e.fromMat3(a, t));
	      };
	    }(), e.clone = l.clone, e.fromValues = l.fromValues, e.copy = l.copy, e.set = l.set, e.identity = function (t) {
	      return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 1, t;
	    }, e.setAxisAngle = function (t, a, n) {
	      n = .5 * n;var r = Math.sin(n);return t[0] = r * a[0], t[1] = r * a[1], t[2] = r * a[2], t[3] = Math.cos(n), t;
	    }, e.getAxisAngle = function (t, a) {
	      var n = 2 * Math.acos(a[3]),
	          r = Math.sin(n / 2);return 0 != r ? (t[0] = a[0] / r, t[1] = a[1] / r, t[2] = a[2] / r) : (t[0] = 1, t[1] = 0, t[2] = 0), n;
	    }, e.add = l.add, e.multiply = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          u = a[2],
	          l = a[3],
	          e = n[0],
	          M = n[1],
	          s = n[2],
	          i = n[3];return t[0] = r * i + l * e + o * s - u * M, t[1] = o * i + l * M + u * e - r * s, t[2] = u * i + l * s + r * M - o * e, t[3] = l * i - r * e - o * M - u * s, t;
	    }, e.mul = e.multiply, e.scale = l.scale, e.rotateX = function (t, a, n) {
	      n *= .5;var r = a[0],
	          o = a[1],
	          u = a[2],
	          l = a[3],
	          e = Math.sin(n),
	          M = Math.cos(n);return t[0] = r * M + l * e, t[1] = o * M + u * e, t[2] = u * M - o * e, t[3] = l * M - r * e, t;
	    }, e.rotateY = function (t, a, n) {
	      n *= .5;var r = a[0],
	          o = a[1],
	          u = a[2],
	          l = a[3],
	          e = Math.sin(n),
	          M = Math.cos(n);return t[0] = r * M - u * e, t[1] = o * M + l * e, t[2] = u * M + r * e, t[3] = l * M - o * e, t;
	    }, e.rotateZ = function (t, a, n) {
	      n *= .5;var r = a[0],
	          o = a[1],
	          u = a[2],
	          l = a[3],
	          e = Math.sin(n),
	          M = Math.cos(n);return t[0] = r * M + o * e, t[1] = o * M - r * e, t[2] = u * M + l * e, t[3] = l * M - u * e, t;
	    }, e.calculateW = function (t, a) {
	      var n = a[0],
	          r = a[1],
	          o = a[2];return t[0] = n, t[1] = r, t[2] = o, t[3] = Math.sqrt(Math.abs(1 - n * n - r * r - o * o)), t;
	    }, e.dot = l.dot, e.lerp = l.lerp, e.slerp = function (t, a, n, r) {
	      var o,
	          u,
	          l,
	          e,
	          M,
	          s = a[0],
	          i = a[1],
	          c = a[2],
	          h = a[3],
	          S = n[0],
	          I = n[1],
	          f = n[2],
	          x = n[3];return u = s * S + i * I + c * f + h * x, 0 > u && (u = -u, S = -S, I = -I, f = -f, x = -x), 1 - u > 1e-6 ? (o = Math.acos(u), l = Math.sin(o), e = Math.sin((1 - r) * o) / l, M = Math.sin(r * o) / l) : (e = 1 - r, M = r), t[0] = e * s + M * S, t[1] = e * i + M * I, t[2] = e * c + M * f, t[3] = e * h + M * x, t;
	    }, e.sqlerp = function () {
	      var t = e.create(),
	          a = e.create();return function (n, r, o, u, l, M) {
	        return e.slerp(t, r, l, M), e.slerp(a, o, u, M), e.slerp(n, t, a, 2 * M * (1 - M)), n;
	      };
	    }(), e.invert = function (t, a) {
	      var n = a[0],
	          r = a[1],
	          o = a[2],
	          u = a[3],
	          l = n * n + r * r + o * o + u * u,
	          e = l ? 1 / l : 0;return t[0] = -n * e, t[1] = -r * e, t[2] = -o * e, t[3] = u * e, t;
	    }, e.conjugate = function (t, a) {
	      return t[0] = -a[0], t[1] = -a[1], t[2] = -a[2], t[3] = a[3], t;
	    }, e.length = l.length, e.len = e.length, e.squaredLength = l.squaredLength, e.sqrLen = e.squaredLength, e.normalize = l.normalize, e.fromMat3 = function (t, a) {
	      var n,
	          r = a[0] + a[4] + a[8];if (r > 0) n = Math.sqrt(r + 1), t[3] = .5 * n, n = .5 / n, t[0] = (a[5] - a[7]) * n, t[1] = (a[6] - a[2]) * n, t[2] = (a[1] - a[3]) * n;else {
	        var o = 0;a[4] > a[0] && (o = 1), a[8] > a[3 * o + o] && (o = 2);var u = (o + 1) % 3,
	            l = (o + 2) % 3;n = Math.sqrt(a[3 * o + o] - a[3 * u + u] - a[3 * l + l] + 1), t[o] = .5 * n, n = .5 / n, t[3] = (a[3 * u + l] - a[3 * l + u]) * n, t[u] = (a[3 * u + o] + a[3 * o + u]) * n, t[l] = (a[3 * l + o] + a[3 * o + l]) * n;
	      }return t;
	    }, e.str = function (t) {
	      return "quat(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")";
	    }, e.exactEquals = l.exactEquals, e.equals = l.equals, t.exports = e;
	  }, function (t, a, n) {
	    var r = n(1),
	        o = {};o.create = function () {
	      var t = new r.ARRAY_TYPE(3);return t[0] = 0, t[1] = 0, t[2] = 0, t;
	    }, o.clone = function (t) {
	      var a = new r.ARRAY_TYPE(3);return a[0] = t[0], a[1] = t[1], a[2] = t[2], a;
	    }, o.fromValues = function (t, a, n) {
	      var o = new r.ARRAY_TYPE(3);return o[0] = t, o[1] = a, o[2] = n, o;
	    }, o.copy = function (t, a) {
	      return t[0] = a[0], t[1] = a[1], t[2] = a[2], t;
	    }, o.set = function (t, a, n, r) {
	      return t[0] = a, t[1] = n, t[2] = r, t;
	    }, o.add = function (t, a, n) {
	      return t[0] = a[0] + n[0], t[1] = a[1] + n[1], t[2] = a[2] + n[2], t;
	    }, o.subtract = function (t, a, n) {
	      return t[0] = a[0] - n[0], t[1] = a[1] - n[1], t[2] = a[2] - n[2], t;
	    }, o.sub = o.subtract, o.multiply = function (t, a, n) {
	      return t[0] = a[0] * n[0], t[1] = a[1] * n[1], t[2] = a[2] * n[2], t;
	    }, o.mul = o.multiply, o.divide = function (t, a, n) {
	      return t[0] = a[0] / n[0], t[1] = a[1] / n[1], t[2] = a[2] / n[2], t;
	    }, o.div = o.divide, o.ceil = function (t, a) {
	      return t[0] = Math.ceil(a[0]), t[1] = Math.ceil(a[1]), t[2] = Math.ceil(a[2]), t;
	    }, o.floor = function (t, a) {
	      return t[0] = Math.floor(a[0]), t[1] = Math.floor(a[1]), t[2] = Math.floor(a[2]), t;
	    }, o.min = function (t, a, n) {
	      return t[0] = Math.min(a[0], n[0]), t[1] = Math.min(a[1], n[1]), t[2] = Math.min(a[2], n[2]), t;
	    }, o.max = function (t, a, n) {
	      return t[0] = Math.max(a[0], n[0]), t[1] = Math.max(a[1], n[1]), t[2] = Math.max(a[2], n[2]), t;
	    }, o.round = function (t, a) {
	      return t[0] = Math.round(a[0]), t[1] = Math.round(a[1]), t[2] = Math.round(a[2]), t;
	    }, o.scale = function (t, a, n) {
	      return t[0] = a[0] * n, t[1] = a[1] * n, t[2] = a[2] * n, t;
	    }, o.scaleAndAdd = function (t, a, n, r) {
	      return t[0] = a[0] + n[0] * r, t[1] = a[1] + n[1] * r, t[2] = a[2] + n[2] * r, t;
	    }, o.distance = function (t, a) {
	      var n = a[0] - t[0],
	          r = a[1] - t[1],
	          o = a[2] - t[2];return Math.sqrt(n * n + r * r + o * o);
	    }, o.dist = o.distance, o.squaredDistance = function (t, a) {
	      var n = a[0] - t[0],
	          r = a[1] - t[1],
	          o = a[2] - t[2];return n * n + r * r + o * o;
	    }, o.sqrDist = o.squaredDistance, o.length = function (t) {
	      var a = t[0],
	          n = t[1],
	          r = t[2];return Math.sqrt(a * a + n * n + r * r);
	    }, o.len = o.length, o.squaredLength = function (t) {
	      var a = t[0],
	          n = t[1],
	          r = t[2];return a * a + n * n + r * r;
	    }, o.sqrLen = o.squaredLength, o.negate = function (t, a) {
	      return t[0] = -a[0], t[1] = -a[1], t[2] = -a[2], t;
	    }, o.inverse = function (t, a) {
	      return t[0] = 1 / a[0], t[1] = 1 / a[1], t[2] = 1 / a[2], t;
	    }, o.normalize = function (t, a) {
	      var n = a[0],
	          r = a[1],
	          o = a[2],
	          u = n * n + r * r + o * o;return u > 0 && (u = 1 / Math.sqrt(u), t[0] = a[0] * u, t[1] = a[1] * u, t[2] = a[2] * u), t;
	    }, o.dot = function (t, a) {
	      return t[0] * a[0] + t[1] * a[1] + t[2] * a[2];
	    }, o.cross = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          u = a[2],
	          l = n[0],
	          e = n[1],
	          M = n[2];return t[0] = o * M - u * e, t[1] = u * l - r * M, t[2] = r * e - o * l, t;
	    }, o.lerp = function (t, a, n, r) {
	      var o = a[0],
	          u = a[1],
	          l = a[2];return t[0] = o + r * (n[0] - o), t[1] = u + r * (n[1] - u), t[2] = l + r * (n[2] - l), t;
	    }, o.hermite = function (t, a, n, r, o, u) {
	      var l = u * u,
	          e = l * (2 * u - 3) + 1,
	          M = l * (u - 2) + u,
	          s = l * (u - 1),
	          i = l * (3 - 2 * u);return t[0] = a[0] * e + n[0] * M + r[0] * s + o[0] * i, t[1] = a[1] * e + n[1] * M + r[1] * s + o[1] * i, t[2] = a[2] * e + n[2] * M + r[2] * s + o[2] * i, t;
	    }, o.bezier = function (t, a, n, r, o, u) {
	      var l = 1 - u,
	          e = l * l,
	          M = u * u,
	          s = e * l,
	          i = 3 * u * e,
	          c = 3 * M * l,
	          h = M * u;return t[0] = a[0] * s + n[0] * i + r[0] * c + o[0] * h, t[1] = a[1] * s + n[1] * i + r[1] * c + o[1] * h, t[2] = a[2] * s + n[2] * i + r[2] * c + o[2] * h, t;
	    }, o.random = function (t, a) {
	      a = a || 1;var n = 2 * r.RANDOM() * Math.PI,
	          o = 2 * r.RANDOM() - 1,
	          u = Math.sqrt(1 - o * o) * a;return t[0] = Math.cos(n) * u, t[1] = Math.sin(n) * u, t[2] = o * a, t;
	    }, o.transformMat4 = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          u = a[2],
	          l = n[3] * r + n[7] * o + n[11] * u + n[15];return l = l || 1, t[0] = (n[0] * r + n[4] * o + n[8] * u + n[12]) / l, t[1] = (n[1] * r + n[5] * o + n[9] * u + n[13]) / l, t[2] = (n[2] * r + n[6] * o + n[10] * u + n[14]) / l, t;
	    }, o.transformMat3 = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          u = a[2];return t[0] = r * n[0] + o * n[3] + u * n[6], t[1] = r * n[1] + o * n[4] + u * n[7], t[2] = r * n[2] + o * n[5] + u * n[8], t;
	    }, o.transformQuat = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          u = a[2],
	          l = n[0],
	          e = n[1],
	          M = n[2],
	          s = n[3],
	          i = s * r + e * u - M * o,
	          c = s * o + M * r - l * u,
	          h = s * u + l * o - e * r,
	          S = -l * r - e * o - M * u;return t[0] = i * s + S * -l + c * -M - h * -e, t[1] = c * s + S * -e + h * -l - i * -M, t[2] = h * s + S * -M + i * -e - c * -l, t;
	    }, o.rotateX = function (t, a, n, r) {
	      var o = [],
	          u = [];return o[0] = a[0] - n[0], o[1] = a[1] - n[1], o[2] = a[2] - n[2], u[0] = o[0], u[1] = o[1] * Math.cos(r) - o[2] * Math.sin(r), u[2] = o[1] * Math.sin(r) + o[2] * Math.cos(r), t[0] = u[0] + n[0], t[1] = u[1] + n[1], t[2] = u[2] + n[2], t;
	    }, o.rotateY = function (t, a, n, r) {
	      var o = [],
	          u = [];return o[0] = a[0] - n[0], o[1] = a[1] - n[1], o[2] = a[2] - n[2], u[0] = o[2] * Math.sin(r) + o[0] * Math.cos(r), u[1] = o[1], u[2] = o[2] * Math.cos(r) - o[0] * Math.sin(r), t[0] = u[0] + n[0], t[1] = u[1] + n[1], t[2] = u[2] + n[2], t;
	    }, o.rotateZ = function (t, a, n, r) {
	      var o = [],
	          u = [];return o[0] = a[0] - n[0], o[1] = a[1] - n[1], o[2] = a[2] - n[2], u[0] = o[0] * Math.cos(r) - o[1] * Math.sin(r), u[1] = o[0] * Math.sin(r) + o[1] * Math.cos(r), u[2] = o[2], t[0] = u[0] + n[0], t[1] = u[1] + n[1], t[2] = u[2] + n[2], t;
	    }, o.forEach = function () {
	      var t = o.create();return function (a, n, r, o, u, l) {
	        var e, M;for (n || (n = 3), r || (r = 0), M = o ? Math.min(o * n + r, a.length) : a.length, e = r; M > e; e += n) {
	          t[0] = a[e], t[1] = a[e + 1], t[2] = a[e + 2], u(t, t, l), a[e] = t[0], a[e + 1] = t[1], a[e + 2] = t[2];
	        }return a;
	      };
	    }(), o.angle = function (t, a) {
	      var n = o.fromValues(t[0], t[1], t[2]),
	          r = o.fromValues(a[0], a[1], a[2]);o.normalize(n, n), o.normalize(r, r);var u = o.dot(n, r);return u > 1 ? 0 : Math.acos(u);
	    }, o.str = function (t) {
	      return "vec3(" + t[0] + ", " + t[1] + ", " + t[2] + ")";
	    }, o.exactEquals = function (t, a) {
	      return t[0] === a[0] && t[1] === a[1] && t[2] === a[2];
	    }, o.equals = function (t, a) {
	      var n = t[0],
	          o = t[1],
	          u = t[2],
	          l = a[0],
	          e = a[1],
	          M = a[2];return Math.abs(n - l) <= r.EPSILON * Math.max(1, Math.abs(n), Math.abs(l)) && Math.abs(o - e) <= r.EPSILON * Math.max(1, Math.abs(o), Math.abs(e)) && Math.abs(u - M) <= r.EPSILON * Math.max(1, Math.abs(u), Math.abs(M));
	    }, t.exports = o;
	  }, function (t, a, n) {
	    var r = n(1),
	        o = {};o.create = function () {
	      var t = new r.ARRAY_TYPE(4);return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 0, t;
	    }, o.clone = function (t) {
	      var a = new r.ARRAY_TYPE(4);return a[0] = t[0], a[1] = t[1], a[2] = t[2], a[3] = t[3], a;
	    }, o.fromValues = function (t, a, n, o) {
	      var u = new r.ARRAY_TYPE(4);return u[0] = t, u[1] = a, u[2] = n, u[3] = o, u;
	    }, o.copy = function (t, a) {
	      return t[0] = a[0], t[1] = a[1], t[2] = a[2], t[3] = a[3], t;
	    }, o.set = function (t, a, n, r, o) {
	      return t[0] = a, t[1] = n, t[2] = r, t[3] = o, t;
	    }, o.add = function (t, a, n) {
	      return t[0] = a[0] + n[0], t[1] = a[1] + n[1], t[2] = a[2] + n[2], t[3] = a[3] + n[3], t;
	    }, o.subtract = function (t, a, n) {
	      return t[0] = a[0] - n[0], t[1] = a[1] - n[1], t[2] = a[2] - n[2], t[3] = a[3] - n[3], t;
	    }, o.sub = o.subtract, o.multiply = function (t, a, n) {
	      return t[0] = a[0] * n[0], t[1] = a[1] * n[1], t[2] = a[2] * n[2], t[3] = a[3] * n[3], t;
	    }, o.mul = o.multiply, o.divide = function (t, a, n) {
	      return t[0] = a[0] / n[0], t[1] = a[1] / n[1], t[2] = a[2] / n[2], t[3] = a[3] / n[3], t;
	    }, o.div = o.divide, o.ceil = function (t, a) {
	      return t[0] = Math.ceil(a[0]), t[1] = Math.ceil(a[1]), t[2] = Math.ceil(a[2]), t[3] = Math.ceil(a[3]), t;
	    }, o.floor = function (t, a) {
	      return t[0] = Math.floor(a[0]), t[1] = Math.floor(a[1]), t[2] = Math.floor(a[2]), t[3] = Math.floor(a[3]), t;
	    }, o.min = function (t, a, n) {
	      return t[0] = Math.min(a[0], n[0]), t[1] = Math.min(a[1], n[1]), t[2] = Math.min(a[2], n[2]), t[3] = Math.min(a[3], n[3]), t;
	    }, o.max = function (t, a, n) {
	      return t[0] = Math.max(a[0], n[0]), t[1] = Math.max(a[1], n[1]), t[2] = Math.max(a[2], n[2]), t[3] = Math.max(a[3], n[3]), t;
	    }, o.round = function (t, a) {
	      return t[0] = Math.round(a[0]), t[1] = Math.round(a[1]), t[2] = Math.round(a[2]), t[3] = Math.round(a[3]), t;
	    }, o.scale = function (t, a, n) {
	      return t[0] = a[0] * n, t[1] = a[1] * n, t[2] = a[2] * n, t[3] = a[3] * n, t;
	    }, o.scaleAndAdd = function (t, a, n, r) {
	      return t[0] = a[0] + n[0] * r, t[1] = a[1] + n[1] * r, t[2] = a[2] + n[2] * r, t[3] = a[3] + n[3] * r, t;
	    }, o.distance = function (t, a) {
	      var n = a[0] - t[0],
	          r = a[1] - t[1],
	          o = a[2] - t[2],
	          u = a[3] - t[3];return Math.sqrt(n * n + r * r + o * o + u * u);
	    }, o.dist = o.distance, o.squaredDistance = function (t, a) {
	      var n = a[0] - t[0],
	          r = a[1] - t[1],
	          o = a[2] - t[2],
	          u = a[3] - t[3];return n * n + r * r + o * o + u * u;
	    }, o.sqrDist = o.squaredDistance, o.length = function (t) {
	      var a = t[0],
	          n = t[1],
	          r = t[2],
	          o = t[3];return Math.sqrt(a * a + n * n + r * r + o * o);
	    }, o.len = o.length, o.squaredLength = function (t) {
	      var a = t[0],
	          n = t[1],
	          r = t[2],
	          o = t[3];return a * a + n * n + r * r + o * o;
	    }, o.sqrLen = o.squaredLength, o.negate = function (t, a) {
	      return t[0] = -a[0], t[1] = -a[1], t[2] = -a[2], t[3] = -a[3], t;
	    }, o.inverse = function (t, a) {
	      return t[0] = 1 / a[0], t[1] = 1 / a[1], t[2] = 1 / a[2], t[3] = 1 / a[3], t;
	    }, o.normalize = function (t, a) {
	      var n = a[0],
	          r = a[1],
	          o = a[2],
	          u = a[3],
	          l = n * n + r * r + o * o + u * u;return l > 0 && (l = 1 / Math.sqrt(l), t[0] = n * l, t[1] = r * l, t[2] = o * l, t[3] = u * l), t;
	    }, o.dot = function (t, a) {
	      return t[0] * a[0] + t[1] * a[1] + t[2] * a[2] + t[3] * a[3];
	    }, o.lerp = function (t, a, n, r) {
	      var o = a[0],
	          u = a[1],
	          l = a[2],
	          e = a[3];return t[0] = o + r * (n[0] - o), t[1] = u + r * (n[1] - u), t[2] = l + r * (n[2] - l), t[3] = e + r * (n[3] - e), t;
	    }, o.random = function (t, a) {
	      return a = a || 1, t[0] = r.RANDOM(), t[1] = r.RANDOM(), t[2] = r.RANDOM(), t[3] = r.RANDOM(), o.normalize(t, t), o.scale(t, t, a), t;
	    }, o.transformMat4 = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          u = a[2],
	          l = a[3];return t[0] = n[0] * r + n[4] * o + n[8] * u + n[12] * l, t[1] = n[1] * r + n[5] * o + n[9] * u + n[13] * l, t[2] = n[2] * r + n[6] * o + n[10] * u + n[14] * l, t[3] = n[3] * r + n[7] * o + n[11] * u + n[15] * l, t;
	    }, o.transformQuat = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          u = a[2],
	          l = n[0],
	          e = n[1],
	          M = n[2],
	          s = n[3],
	          i = s * r + e * u - M * o,
	          c = s * o + M * r - l * u,
	          h = s * u + l * o - e * r,
	          S = -l * r - e * o - M * u;return t[0] = i * s + S * -l + c * -M - h * -e, t[1] = c * s + S * -e + h * -l - i * -M, t[2] = h * s + S * -M + i * -e - c * -l, t[3] = a[3], t;
	    }, o.forEach = function () {
	      var t = o.create();return function (a, n, r, o, u, l) {
	        var e, M;for (n || (n = 4), r || (r = 0), M = o ? Math.min(o * n + r, a.length) : a.length, e = r; M > e; e += n) {
	          t[0] = a[e], t[1] = a[e + 1], t[2] = a[e + 2], t[3] = a[e + 3], u(t, t, l), a[e] = t[0], a[e + 1] = t[1], a[e + 2] = t[2], a[e + 3] = t[3];
	        }return a;
	      };
	    }(), o.str = function (t) {
	      return "vec4(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")";
	    }, o.exactEquals = function (t, a) {
	      return t[0] === a[0] && t[1] === a[1] && t[2] === a[2] && t[3] === a[3];
	    }, o.equals = function (t, a) {
	      var n = t[0],
	          o = t[1],
	          u = t[2],
	          l = t[3],
	          e = a[0],
	          M = a[1],
	          s = a[2],
	          i = a[3];return Math.abs(n - e) <= r.EPSILON * Math.max(1, Math.abs(n), Math.abs(e)) && Math.abs(o - M) <= r.EPSILON * Math.max(1, Math.abs(o), Math.abs(M)) && Math.abs(u - s) <= r.EPSILON * Math.max(1, Math.abs(u), Math.abs(s)) && Math.abs(l - i) <= r.EPSILON * Math.max(1, Math.abs(l), Math.abs(i));
	    }, t.exports = o;
	  }, function (t, a, n) {
	    var r = n(1),
	        o = {};o.create = function () {
	      var t = new r.ARRAY_TYPE(2);return t[0] = 0, t[1] = 0, t;
	    }, o.clone = function (t) {
	      var a = new r.ARRAY_TYPE(2);return a[0] = t[0], a[1] = t[1], a;
	    }, o.fromValues = function (t, a) {
	      var n = new r.ARRAY_TYPE(2);return n[0] = t, n[1] = a, n;
	    }, o.copy = function (t, a) {
	      return t[0] = a[0], t[1] = a[1], t;
	    }, o.set = function (t, a, n) {
	      return t[0] = a, t[1] = n, t;
	    }, o.add = function (t, a, n) {
	      return t[0] = a[0] + n[0], t[1] = a[1] + n[1], t;
	    }, o.subtract = function (t, a, n) {
	      return t[0] = a[0] - n[0], t[1] = a[1] - n[1], t;
	    }, o.sub = o.subtract, o.multiply = function (t, a, n) {
	      return t[0] = a[0] * n[0], t[1] = a[1] * n[1], t;
	    }, o.mul = o.multiply, o.divide = function (t, a, n) {
	      return t[0] = a[0] / n[0], t[1] = a[1] / n[1], t;
	    }, o.div = o.divide, o.ceil = function (t, a) {
	      return t[0] = Math.ceil(a[0]), t[1] = Math.ceil(a[1]), t;
	    }, o.floor = function (t, a) {
	      return t[0] = Math.floor(a[0]), t[1] = Math.floor(a[1]), t;
	    }, o.min = function (t, a, n) {
	      return t[0] = Math.min(a[0], n[0]), t[1] = Math.min(a[1], n[1]), t;
	    }, o.max = function (t, a, n) {
	      return t[0] = Math.max(a[0], n[0]), t[1] = Math.max(a[1], n[1]), t;
	    }, o.round = function (t, a) {
	      return t[0] = Math.round(a[0]), t[1] = Math.round(a[1]), t;
	    }, o.scale = function (t, a, n) {
	      return t[0] = a[0] * n, t[1] = a[1] * n, t;
	    }, o.scaleAndAdd = function (t, a, n, r) {
	      return t[0] = a[0] + n[0] * r, t[1] = a[1] + n[1] * r, t;
	    }, o.distance = function (t, a) {
	      var n = a[0] - t[0],
	          r = a[1] - t[1];return Math.sqrt(n * n + r * r);
	    }, o.dist = o.distance, o.squaredDistance = function (t, a) {
	      var n = a[0] - t[0],
	          r = a[1] - t[1];return n * n + r * r;
	    }, o.sqrDist = o.squaredDistance, o.length = function (t) {
	      var a = t[0],
	          n = t[1];return Math.sqrt(a * a + n * n);
	    }, o.len = o.length, o.squaredLength = function (t) {
	      var a = t[0],
	          n = t[1];return a * a + n * n;
	    }, o.sqrLen = o.squaredLength, o.negate = function (t, a) {
	      return t[0] = -a[0], t[1] = -a[1], t;
	    }, o.inverse = function (t, a) {
	      return t[0] = 1 / a[0], t[1] = 1 / a[1], t;
	    }, o.normalize = function (t, a) {
	      var n = a[0],
	          r = a[1],
	          o = n * n + r * r;return o > 0 && (o = 1 / Math.sqrt(o), t[0] = a[0] * o, t[1] = a[1] * o), t;
	    }, o.dot = function (t, a) {
	      return t[0] * a[0] + t[1] * a[1];
	    }, o.cross = function (t, a, n) {
	      var r = a[0] * n[1] - a[1] * n[0];return t[0] = t[1] = 0, t[2] = r, t;
	    }, o.lerp = function (t, a, n, r) {
	      var o = a[0],
	          u = a[1];return t[0] = o + r * (n[0] - o), t[1] = u + r * (n[1] - u), t;
	    }, o.random = function (t, a) {
	      a = a || 1;var n = 2 * r.RANDOM() * Math.PI;return t[0] = Math.cos(n) * a, t[1] = Math.sin(n) * a, t;
	    }, o.transformMat2 = function (t, a, n) {
	      var r = a[0],
	          o = a[1];return t[0] = n[0] * r + n[2] * o, t[1] = n[1] * r + n[3] * o, t;
	    }, o.transformMat2d = function (t, a, n) {
	      var r = a[0],
	          o = a[1];return t[0] = n[0] * r + n[2] * o + n[4], t[1] = n[1] * r + n[3] * o + n[5], t;
	    }, o.transformMat3 = function (t, a, n) {
	      var r = a[0],
	          o = a[1];return t[0] = n[0] * r + n[3] * o + n[6], t[1] = n[1] * r + n[4] * o + n[7], t;
	    }, o.transformMat4 = function (t, a, n) {
	      var r = a[0],
	          o = a[1];return t[0] = n[0] * r + n[4] * o + n[12], t[1] = n[1] * r + n[5] * o + n[13], t;
	    }, o.forEach = function () {
	      var t = o.create();return function (a, n, r, o, u, l) {
	        var e, M;for (n || (n = 2), r || (r = 0), M = o ? Math.min(o * n + r, a.length) : a.length, e = r; M > e; e += n) {
	          t[0] = a[e], t[1] = a[e + 1], u(t, t, l), a[e] = t[0], a[e + 1] = t[1];
	        }return a;
	      };
	    }(), o.str = function (t) {
	      return "vec2(" + t[0] + ", " + t[1] + ")";
	    }, o.exactEquals = function (t, a) {
	      return t[0] === a[0] && t[1] === a[1];
	    }, o.equals = function (t, a) {
	      var n = t[0],
	          o = t[1],
	          u = a[0],
	          l = a[1];return Math.abs(n - u) <= r.EPSILON * Math.max(1, Math.abs(n), Math.abs(u)) && Math.abs(o - l) <= r.EPSILON * Math.max(1, Math.abs(o), Math.abs(l));
	    }, t.exports = o;
	  }]);
	});

/***/ },
/* 3 */
/*!**************************************!*\
  !*** ./src/shaders/world_light.frag ***!
  \**************************************/
/***/ function(module, exports) {

	module.exports = "#extension GL_OES_standard_derivatives : enable\n\nprecision highp float;\n#define GLSLIFY 1\n\nuniform vec3 u_lightWorldPosition;\n\nvarying vec3 v_position;\nvarying vec4 v_camera_position;\nvarying vec3 v_normal;\nvarying vec3 v_world_normal;\nvarying vec3 v_screen_normal;\nvarying vec4 v_color;\n\nstruct Material {\n  vec3 amb;\n  vec3 diff;\n  vec3 spec;\n  float shine;\n};\n\nvoid main() {\n  const Material silver = Material(vec3(0.19225, 0.19225, 0.19225), vec3(0.50754, 0.50754, 0.50754), vec3(0.508273, 0.508273, 0.508273), 0.4 * 1000.0);\n\n  vec3 xvec = dFdx(v_position);\n  vec3 yvec = dFdy(v_position);\n  vec3 face_normal = normalize(cross(xvec, yvec));\n  vec3 base_normal = normalize(v_world_normal);\n  vec3 n_normal = mix(base_normal, face_normal, 0.65);\n\n  vec3 to_light = normalize(u_lightWorldPosition - v_position);\n  vec3 to_cam = normalize(- v_camera_position.xyz);\n\n  float ambient_value = 1.0;\n  float diffuse_value = max(dot(to_light, n_normal), 0.0);\n  float diffuse_dropoff = pow(diffuse_value, 2.0);\n  float spec_highlight = pow(max(dot(normalize(mix(to_light, to_cam, 0.5)), n_normal), 0.0), silver.shine);\n  // gl_FragColor = vec4(clamp(v_world_normal, 0.1, 1.0), 1.0);\n  // gl_FragColor = v_color * vec4(v_world_normal, 1);\n  // gl_FragColor = vec4(v_position, 1.0);\n  // gl_FragColor = vec4(v_world_normal, 1.0);\n  float light_facing = dot(to_light, n_normal);\n  float chroma_clamp = 0.0;\n  if (light_facing > -0.3 && light_facing < -0.05) { chroma_clamp = 1.0; }\n  if (light_facing > 0.9 && light_facing < 0.95) { chroma_clamp = 1.0; }\n  float chroma_value = pow(1.0 - diffuse_value, 2.0);\n  vec3 chroma = abs(v_normal) * 0.20 * chroma_clamp;\n\n  float alpha = v_color.a;\n  vec3 combined_color = silver.amb * ambient_value + silver.diff * diffuse_dropoff + silver.spec * spec_highlight + chroma;\n  gl_FragColor = vec4(combined_color, alpha);\n}\n"

/***/ },
/* 4 */
/*!***************************************!*\
  !*** ./src/shaders/pass_through.vert ***!
  \***************************************/
/***/ function(module, exports) {

	module.exports = "precision highp float;\n#define GLSLIFY 1\n // Not necessary, but makes it explicit\n\nuniform mat4 u_projectionMatrix;\nuniform mat4 u_modelWorldMatrix;\nuniform mat4 u_modelWorldMatrix_IT;\nuniform mat4 u_worldViewMatrix;\n\nattribute vec3 a_position;\nattribute vec3 a_normal;\nattribute vec4 a_color;\nattribute vec3 a_offset;\n\nvarying vec3 v_position;\nvarying vec4 v_camera_position;\nvarying vec3 v_normal;\nvarying vec3 v_world_normal;\nvarying vec3 v_screen_normal;\nvarying vec4 v_color;\n\nvoid main() {\n  vec4 vertexWorldPosition = u_modelWorldMatrix * vec4(a_position + a_offset, 1);\n  // vec4 vertexWorldPosition = u_modelWorldMatrix * vec4(a_position, 1);\n  gl_Position = u_projectionMatrix * u_worldViewMatrix * vertexWorldPosition;\n  v_camera_position = u_worldViewMatrix * vertexWorldPosition;\n  v_position = vertexWorldPosition.xyz;\n  v_normal = a_normal;\n  vec4 norm_world = u_modelWorldMatrix_IT * vec4(a_normal, 1);\n  v_world_normal = norm_world.xyz;\n  v_screen_normal = (u_worldViewMatrix * norm_world).xyz;\n  v_color = a_color;\n}\n"

/***/ },
/* 5 */
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.flatten2IndexBuffer = exports.flatten2UIntBuffer = exports.flatten2Buffer = exports.flatten2 = exports.flatten = exports.randRGBInt = exports.randRGB = exports.randNum = exports.rad2Deg = exports.deg2Rad = exports.getWebGLContext = exports.getPixelRatio = exports.elapsedTime = exports.$ = exports.noise4 = exports.noise3 = exports.noise2 = undefined;

	var _simplexNoise = __webpack_require__(/*! simplex-noise */ 6);

	var _simplexNoise2 = _interopRequireDefault(_simplexNoise);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var simplex = new _simplexNoise2.default();

	var noise2 = exports.noise2 = function noise2(x, y) {
	  return simplex.noise2D(x, y);
	};
	var noise3 = exports.noise3 = function noise3(x, y, z) {
	  return simplex.noise3D(x, y, z);
	};
	var noise4 = exports.noise4 = function noise4(x, y, z, w) {
	  return simplex.noise4D(x, y, z, w);
	};

	// Helper functions - Util
	var $ = exports.$ = function $(id) {
	  return document.getElementById(id);
	};
	var start = Date.now();
	var elapsedTime = exports.elapsedTime = function elapsedTime() {
	  return Date.now() - start;
	};
	var getPixelRatio = exports.getPixelRatio = function getPixelRatio() {
	  return typeof window !== 'undefined' && 'devicePixelRatio' in window && window.devicePixelRatio > 1 ? window.devicePixelRatio : 1;
	};
	var getWebGLContext = exports.getWebGLContext = function getWebGLContext(canvas) {
	  return canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
	};

	// Helper functions - Math
	var deg2Rad = exports.deg2Rad = function deg2Rad(deg) {
	  return Math.PI * deg / 180;
	};
	var rad2Deg = exports.rad2Deg = function rad2Deg(rad) {
	  return 180 * rad / Math.PI;
	};
	var randNum = exports.randNum = function randNum(lo, hi) {
	  if (typeof hi === 'undefined') {
	    if (typeof lo === 'undefined') {
	      lo = 1;
	    }
	    hi = lo;
	    lo = 0;
	  }
	  return lo + (hi - lo) * Math.random();
	};

	// Helper functions - color
	// const pos2HSV =
	var randRGB = exports.randRGB = function randRGB() {
	  return vec4.fromValues(Math.random(), Math.random(), Math.random(), 1);
	};
	var randRGBInt = exports.randRGBInt = function randRGBInt() {
	  return [randNum(255), randNum(255), randNum(255), 255];
	};

	var flatten = exports.flatten = function flatten(arr) {
	  return arr.reduce(function (flat, item) {
	    // Recursively flattens inner contents to handle nested arrays of any dimension
	    return flat.concat(Object.prototype.toString.call(item[0]) === '[object Array]' ? flatten(item) : item);
	  }, []);
	};

	// Helper functions - Arrays / Buffers
	var flatten2 = exports.flatten2 = function flatten2(nested2) {
	  return nested2.reduce(function (chain, item) {
	    return chain.concat(item);
	  }, []);
	};

	var flatten2Buffer = exports.flatten2Buffer = function flatten2Buffer(nestedArr, unitLength) {
	  var buffer = new Float32Array(nestedArr.length * unitLength);
	  nestedArr.forEach(function (unit, idx) {
	    buffer.set(unit, idx * unitLength);
	  });
	  return buffer;
	};

	var flatten2UIntBuffer = exports.flatten2UIntBuffer = function flatten2UIntBuffer(nestedArr, unitLength) {
	  var buffer = new Uint8Array(nestedArr.length * unitLength);
	  nestedArr.forEach(function (unit, idx) {
	    buffer.set(unit, idx * unitLength);
	  });
	  return buffer;
	};

	var flatten2IndexBuffer = exports.flatten2IndexBuffer = function flatten2IndexBuffer(nestedArr, unitLength) {
	  var buffer = new Uint16Array(nestedArr.length * unitLength);
	  nestedArr.forEach(function (unit, idx) {
	    buffer.set(unit, idx * unitLength);
	  });
	  return buffer;
	};

/***/ },
/* 6 */
/*!******************************************!*\
  !*** ./~/simplex-noise/simplex-noise.js ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	/*
	 * A fast javascript implementation of simplex noise by Jonas Wagner
	 *
	 * Based on a speed-improved simplex noise algorithm for 2D, 3D and 4D in Java.
	 * Which is based on example code by Stefan Gustavson (stegu@itn.liu.se).
	 * With Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
	 * Better rank ordering method by Stefan Gustavson in 2012.
	 *
	 *
	 * Copyright (C) 2012 Jonas Wagner
	 *
	 * Permission is hereby granted, free of charge, to any person obtaining
	 * a copy of this software and associated documentation files (the
	 * "Software"), to deal in the Software without restriction, including
	 * without limitation the rights to use, copy, modify, merge, publish,
	 * distribute, sublicense, and/or sell copies of the Software, and to
	 * permit persons to whom the Software is furnished to do so, subject to
	 * the following conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
	 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
	 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	 *
	 */
	(function () {
	    "use strict";

	    var F2 = 0.5 * (Math.sqrt(3.0) - 1.0),
	        G2 = (3.0 - Math.sqrt(3.0)) / 6.0,
	        F3 = 1.0 / 3.0,
	        G3 = 1.0 / 6.0,
	        F4 = (Math.sqrt(5.0) - 1.0) / 4.0,
	        G4 = (5.0 - Math.sqrt(5.0)) / 20.0;

	    function SimplexNoise(random) {
	        if (!random) random = Math.random;
	        this.p = new Uint8Array(256);
	        this.perm = new Uint8Array(512);
	        this.permMod12 = new Uint8Array(512);
	        for (var i = 0; i < 256; i++) {
	            this.p[i] = random() * 256;
	        }
	        for (i = 0; i < 512; i++) {
	            this.perm[i] = this.p[i & 255];
	            this.permMod12[i] = this.perm[i] % 12;
	        }
	    }
	    SimplexNoise.prototype = {
	        grad3: new Float32Array([1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1]),
	        grad4: new Float32Array([0, 1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1, 0, -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1, 1, 0, 1, 1, 1, 0, 1, -1, 1, 0, -1, 1, 1, 0, -1, -1, -1, 0, 1, 1, -1, 0, 1, -1, -1, 0, -1, 1, -1, 0, -1, -1, 1, 1, 0, 1, 1, 1, 0, -1, 1, -1, 0, 1, 1, -1, 0, -1, -1, 1, 0, 1, -1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, -1, 1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1, 0, -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1, 0]),
	        noise2D: function noise2D(xin, yin) {
	            var permMod12 = this.permMod12,
	                perm = this.perm,
	                grad3 = this.grad3;
	            var n0 = 0,
	                n1 = 0,
	                n2 = 0; // Noise contributions from the three corners
	            // Skew the input space to determine which simplex cell we're in
	            var s = (xin + yin) * F2; // Hairy factor for 2D
	            var i = Math.floor(xin + s);
	            var j = Math.floor(yin + s);
	            var t = (i + j) * G2;
	            var X0 = i - t; // Unskew the cell origin back to (x,y) space
	            var Y0 = j - t;
	            var x0 = xin - X0; // The x,y distances from the cell origin
	            var y0 = yin - Y0;
	            // For the 2D case, the simplex shape is an equilateral triangle.
	            // Determine which simplex we are in.
	            var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
	            if (x0 > y0) {
	                i1 = 1;
	                j1 = 0;
	            } // lower triangle, XY order: (0,0)->(1,0)->(1,1)
	            else {
	                    i1 = 0;
	                    j1 = 1;
	                } // upper triangle, YX order: (0,0)->(0,1)->(1,1)
	            // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
	            // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
	            // c = (3-sqrt(3))/6
	            var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
	            var y1 = y0 - j1 + G2;
	            var x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords
	            var y2 = y0 - 1.0 + 2.0 * G2;
	            // Work out the hashed gradient indices of the three simplex corners
	            var ii = i & 255;
	            var jj = j & 255;
	            // Calculate the contribution from the three corners
	            var t0 = 0.5 - x0 * x0 - y0 * y0;
	            if (t0 >= 0) {
	                var gi0 = permMod12[ii + perm[jj]] * 3;
	                t0 *= t0;
	                n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0); // (x,y) of grad3 used for 2D gradient
	            }
	            var t1 = 0.5 - x1 * x1 - y1 * y1;
	            if (t1 >= 0) {
	                var gi1 = permMod12[ii + i1 + perm[jj + j1]] * 3;
	                t1 *= t1;
	                n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1);
	            }
	            var t2 = 0.5 - x2 * x2 - y2 * y2;
	            if (t2 >= 0) {
	                var gi2 = permMod12[ii + 1 + perm[jj + 1]] * 3;
	                t2 *= t2;
	                n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2);
	            }
	            // Add contributions from each corner to get the final noise value.
	            // The result is scaled to return values in the interval [-1,1].
	            return 70.0 * (n0 + n1 + n2);
	        },
	        // 3D simplex noise
	        noise3D: function noise3D(xin, yin, zin) {
	            var permMod12 = this.permMod12,
	                perm = this.perm,
	                grad3 = this.grad3;
	            var n0, n1, n2, n3; // Noise contributions from the four corners
	            // Skew the input space to determine which simplex cell we're in
	            var s = (xin + yin + zin) * F3; // Very nice and simple skew factor for 3D
	            var i = Math.floor(xin + s);
	            var j = Math.floor(yin + s);
	            var k = Math.floor(zin + s);
	            var t = (i + j + k) * G3;
	            var X0 = i - t; // Unskew the cell origin back to (x,y,z) space
	            var Y0 = j - t;
	            var Z0 = k - t;
	            var x0 = xin - X0; // The x,y,z distances from the cell origin
	            var y0 = yin - Y0;
	            var z0 = zin - Z0;
	            // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
	            // Determine which simplex we are in.
	            var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
	            var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
	            if (x0 >= y0) {
	                if (y0 >= z0) {
	                    i1 = 1;
	                    j1 = 0;
	                    k1 = 0;
	                    i2 = 1;
	                    j2 = 1;
	                    k2 = 0;
	                } // X Y Z order
	                else if (x0 >= z0) {
	                        i1 = 1;
	                        j1 = 0;
	                        k1 = 0;
	                        i2 = 1;
	                        j2 = 0;
	                        k2 = 1;
	                    } // X Z Y order
	                    else {
	                            i1 = 0;
	                            j1 = 0;
	                            k1 = 1;
	                            i2 = 1;
	                            j2 = 0;
	                            k2 = 1;
	                        } // Z X Y order
	            } else {
	                    // x0<y0
	                    if (y0 < z0) {
	                        i1 = 0;
	                        j1 = 0;
	                        k1 = 1;
	                        i2 = 0;
	                        j2 = 1;
	                        k2 = 1;
	                    } // Z Y X order
	                    else if (x0 < z0) {
	                            i1 = 0;
	                            j1 = 1;
	                            k1 = 0;
	                            i2 = 0;
	                            j2 = 1;
	                            k2 = 1;
	                        } // Y Z X order
	                        else {
	                                i1 = 0;
	                                j1 = 1;
	                                k1 = 0;
	                                i2 = 1;
	                                j2 = 1;
	                                k2 = 0;
	                            } // Y X Z order
	                }
	            // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
	            // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
	            // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
	            // c = 1/6.
	            var x1 = x0 - i1 + G3; // Offsets for second corner in (x,y,z) coords
	            var y1 = y0 - j1 + G3;
	            var z1 = z0 - k1 + G3;
	            var x2 = x0 - i2 + 2.0 * G3; // Offsets for third corner in (x,y,z) coords
	            var y2 = y0 - j2 + 2.0 * G3;
	            var z2 = z0 - k2 + 2.0 * G3;
	            var x3 = x0 - 1.0 + 3.0 * G3; // Offsets for last corner in (x,y,z) coords
	            var y3 = y0 - 1.0 + 3.0 * G3;
	            var z3 = z0 - 1.0 + 3.0 * G3;
	            // Work out the hashed gradient indices of the four simplex corners
	            var ii = i & 255;
	            var jj = j & 255;
	            var kk = k & 255;
	            // Calculate the contribution from the four corners
	            var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
	            if (t0 < 0) n0 = 0.0;else {
	                var gi0 = permMod12[ii + perm[jj + perm[kk]]] * 3;
	                t0 *= t0;
	                n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0 + grad3[gi0 + 2] * z0);
	            }
	            var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
	            if (t1 < 0) n1 = 0.0;else {
	                var gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3;
	                t1 *= t1;
	                n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1 + grad3[gi1 + 2] * z1);
	            }
	            var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
	            if (t2 < 0) n2 = 0.0;else {
	                var gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3;
	                t2 *= t2;
	                n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2 + grad3[gi2 + 2] * z2);
	            }
	            var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
	            if (t3 < 0) n3 = 0.0;else {
	                var gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3;
	                t3 *= t3;
	                n3 = t3 * t3 * (grad3[gi3] * x3 + grad3[gi3 + 1] * y3 + grad3[gi3 + 2] * z3);
	            }
	            // Add contributions from each corner to get the final noise value.
	            // The result is scaled to stay just inside [-1,1]
	            return 32.0 * (n0 + n1 + n2 + n3);
	        },
	        // 4D simplex noise, better simplex rank ordering method 2012-03-09
	        noise4D: function noise4D(x, y, z, w) {
	            var permMod12 = this.permMod12,
	                perm = this.perm,
	                grad4 = this.grad4;

	            var n0, n1, n2, n3, n4; // Noise contributions from the five corners
	            // Skew the (x,y,z,w) space to determine which cell of 24 simplices we're in
	            var s = (x + y + z + w) * F4; // Factor for 4D skewing
	            var i = Math.floor(x + s);
	            var j = Math.floor(y + s);
	            var k = Math.floor(z + s);
	            var l = Math.floor(w + s);
	            var t = (i + j + k + l) * G4; // Factor for 4D unskewing
	            var X0 = i - t; // Unskew the cell origin back to (x,y,z,w) space
	            var Y0 = j - t;
	            var Z0 = k - t;
	            var W0 = l - t;
	            var x0 = x - X0; // The x,y,z,w distances from the cell origin
	            var y0 = y - Y0;
	            var z0 = z - Z0;
	            var w0 = w - W0;
	            // For the 4D case, the simplex is a 4D shape I won't even try to describe.
	            // To find out which of the 24 possible simplices we're in, we need to
	            // determine the magnitude ordering of x0, y0, z0 and w0.
	            // Six pair-wise comparisons are performed between each possible pair
	            // of the four coordinates, and the results are used to rank the numbers.
	            var rankx = 0;
	            var ranky = 0;
	            var rankz = 0;
	            var rankw = 0;
	            if (x0 > y0) rankx++;else ranky++;
	            if (x0 > z0) rankx++;else rankz++;
	            if (x0 > w0) rankx++;else rankw++;
	            if (y0 > z0) ranky++;else rankz++;
	            if (y0 > w0) ranky++;else rankw++;
	            if (z0 > w0) rankz++;else rankw++;
	            var i1, j1, k1, l1; // The integer offsets for the second simplex corner
	            var i2, j2, k2, l2; // The integer offsets for the third simplex corner
	            var i3, j3, k3, l3; // The integer offsets for the fourth simplex corner
	            // simplex[c] is a 4-vector with the numbers 0, 1, 2 and 3 in some order.
	            // Many values of c will never occur, since e.g. x>y>z>w makes x<z, y<w and x<w
	            // impossible. Only the 24 indices which have non-zero entries make any sense.
	            // We use a thresholding to set the coordinates in turn from the largest magnitude.
	            // Rank 3 denotes the largest coordinate.
	            i1 = rankx >= 3 ? 1 : 0;
	            j1 = ranky >= 3 ? 1 : 0;
	            k1 = rankz >= 3 ? 1 : 0;
	            l1 = rankw >= 3 ? 1 : 0;
	            // Rank 2 denotes the second largest coordinate.
	            i2 = rankx >= 2 ? 1 : 0;
	            j2 = ranky >= 2 ? 1 : 0;
	            k2 = rankz >= 2 ? 1 : 0;
	            l2 = rankw >= 2 ? 1 : 0;
	            // Rank 1 denotes the second smallest coordinate.
	            i3 = rankx >= 1 ? 1 : 0;
	            j3 = ranky >= 1 ? 1 : 0;
	            k3 = rankz >= 1 ? 1 : 0;
	            l3 = rankw >= 1 ? 1 : 0;
	            // The fifth corner has all coordinate offsets = 1, so no need to compute that.
	            var x1 = x0 - i1 + G4; // Offsets for second corner in (x,y,z,w) coords
	            var y1 = y0 - j1 + G4;
	            var z1 = z0 - k1 + G4;
	            var w1 = w0 - l1 + G4;
	            var x2 = x0 - i2 + 2.0 * G4; // Offsets for third corner in (x,y,z,w) coords
	            var y2 = y0 - j2 + 2.0 * G4;
	            var z2 = z0 - k2 + 2.0 * G4;
	            var w2 = w0 - l2 + 2.0 * G4;
	            var x3 = x0 - i3 + 3.0 * G4; // Offsets for fourth corner in (x,y,z,w) coords
	            var y3 = y0 - j3 + 3.0 * G4;
	            var z3 = z0 - k3 + 3.0 * G4;
	            var w3 = w0 - l3 + 3.0 * G4;
	            var x4 = x0 - 1.0 + 4.0 * G4; // Offsets for last corner in (x,y,z,w) coords
	            var y4 = y0 - 1.0 + 4.0 * G4;
	            var z4 = z0 - 1.0 + 4.0 * G4;
	            var w4 = w0 - 1.0 + 4.0 * G4;
	            // Work out the hashed gradient indices of the five simplex corners
	            var ii = i & 255;
	            var jj = j & 255;
	            var kk = k & 255;
	            var ll = l & 255;
	            // Calculate the contribution from the five corners
	            var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
	            if (t0 < 0) n0 = 0.0;else {
	                var gi0 = perm[ii + perm[jj + perm[kk + perm[ll]]]] % 32 * 4;
	                t0 *= t0;
	                n0 = t0 * t0 * (grad4[gi0] * x0 + grad4[gi0 + 1] * y0 + grad4[gi0 + 2] * z0 + grad4[gi0 + 3] * w0);
	            }
	            var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
	            if (t1 < 0) n1 = 0.0;else {
	                var gi1 = perm[ii + i1 + perm[jj + j1 + perm[kk + k1 + perm[ll + l1]]]] % 32 * 4;
	                t1 *= t1;
	                n1 = t1 * t1 * (grad4[gi1] * x1 + grad4[gi1 + 1] * y1 + grad4[gi1 + 2] * z1 + grad4[gi1 + 3] * w1);
	            }
	            var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
	            if (t2 < 0) n2 = 0.0;else {
	                var gi2 = perm[ii + i2 + perm[jj + j2 + perm[kk + k2 + perm[ll + l2]]]] % 32 * 4;
	                t2 *= t2;
	                n2 = t2 * t2 * (grad4[gi2] * x2 + grad4[gi2 + 1] * y2 + grad4[gi2 + 2] * z2 + grad4[gi2 + 3] * w2);
	            }
	            var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
	            if (t3 < 0) n3 = 0.0;else {
	                var gi3 = perm[ii + i3 + perm[jj + j3 + perm[kk + k3 + perm[ll + l3]]]] % 32 * 4;
	                t3 *= t3;
	                n3 = t3 * t3 * (grad4[gi3] * x3 + grad4[gi3 + 1] * y3 + grad4[gi3 + 2] * z3 + grad4[gi3 + 3] * w3);
	            }
	            var t4 = 0.6 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;
	            if (t4 < 0) n4 = 0.0;else {
	                var gi4 = perm[ii + 1 + perm[jj + 1 + perm[kk + 1 + perm[ll + 1]]]] % 32 * 4;
	                t4 *= t4;
	                n4 = t4 * t4 * (grad4[gi4] * x4 + grad4[gi4 + 1] * y4 + grad4[gi4 + 2] * z4 + grad4[gi4 + 3] * w4);
	            }
	            // Sum up and scale the result to cover the range [-1,1]
	            return 27.0 * (n0 + n1 + n2 + n3 + n4);
	        }

	    };

	    // amd
	    if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	        return SimplexNoise;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    //common js
	    if (true) exports.SimplexNoise = SimplexNoise;
	    // browser
	    else if (typeof window !== 'undefined') window.SimplexNoise = SimplexNoise;
	    // nodejs
	    if (true) {
	        module.exports = SimplexNoise;
	    }
	})();

/***/ },
/* 7 */
/*!**************************!*\
  !*** ./src/icosphere.js ***!
  \**************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = icosphere;

	var _glMatrix = __webpack_require__(/*! gl-matrix */ 2);

	function icosphere(subdivisions) {
	  subdivisions = +subdivisions | 0;

	  if (subdivisions > 5) {
	    console.warn('An icosphere subdivided more than 5 times is a tough proposition. This could take a couple minutes...');
	    console.warn('(at least until the lookups in the algorithm are optimized some more)');
	  }

	  var positions = [];
	  var faces = [];
	  var t = 0.5 + Math.sqrt(5) / 2;

	  positions.push(_glMatrix.vec3.fromValues(-1, +t, 0));
	  positions.push(_glMatrix.vec3.fromValues(+1, +t, 0));
	  positions.push(_glMatrix.vec3.fromValues(-1, -t, 0));
	  positions.push(_glMatrix.vec3.fromValues(+1, -t, 0));

	  positions.push(_glMatrix.vec3.fromValues(0, -1, +t));
	  positions.push(_glMatrix.vec3.fromValues(0, +1, +t));
	  positions.push(_glMatrix.vec3.fromValues(0, -1, -t));
	  positions.push(_glMatrix.vec3.fromValues(0, +1, -t));

	  positions.push(_glMatrix.vec3.fromValues(+t, 0, -1));
	  positions.push(_glMatrix.vec3.fromValues(+t, 0, +1));
	  positions.push(_glMatrix.vec3.fromValues(-t, 0, -1));
	  positions.push(_glMatrix.vec3.fromValues(-t, 0, +1));

	  faces.push([0, 11, 5]);
	  faces.push([0, 5, 1]);
	  faces.push([0, 1, 7]);
	  faces.push([0, 7, 10]);
	  faces.push([0, 10, 11]);

	  faces.push([1, 5, 9]);
	  faces.push([5, 11, 4]);
	  faces.push([11, 10, 2]);
	  faces.push([10, 7, 6]);
	  faces.push([7, 1, 8]);

	  faces.push([3, 9, 4]);
	  faces.push([3, 4, 2]);
	  faces.push([3, 2, 6]);
	  faces.push([3, 6, 8]);
	  faces.push([3, 8, 9]);

	  faces.push([4, 9, 5]);
	  faces.push([2, 4, 11]);
	  faces.push([6, 2, 10]);
	  faces.push([8, 6, 7]);
	  faces.push([9, 8, 1]);

	  var complex = {
	    cells: faces,
	    positions: positions
	  };

	  while (subdivisions-- > 0) {
	    complex = subdivide(complex);
	  }

	  positions = complex.positions;
	  for (var i = 0; i < positions.length; i++) {
	    positions[i] = _glMatrix.vec3.normalize(_glMatrix.vec3.create(), positions[i]);
	  }

	  return complex;
	}

	// TODO: work out the second half of loop subdivision
	// and extract this into its own module.
	function subdivide(complex) {
	  var positions = complex.positions;
	  var cells = complex.cells;

	  var newCells = [];
	  var newPositions = [];
	  var newPositionsLength = 0;

	  for (var i = 0; i < cells.length; i++) {
	    var cell = cells[i];
	    var c0 = cell[0];
	    var c1 = cell[1];
	    var c2 = cell[2];
	    var v0 = positions[c0];
	    var v1 = positions[c1];
	    var v2 = positions[c2];

	    var a = getMidpoint(v0, v1);
	    var b = getMidpoint(v1, v2);
	    var c = getMidpoint(v2, v0);

	    // Add the midpoints to the new positions, but don't add duplicates
	    var ai = newPositions.indexOf(a);
	    if (ai === -1) {
	      ai = newPositionsLength++, newPositions.push(a);
	    }
	    var bi = newPositions.indexOf(b);
	    if (bi === -1) {
	      bi = newPositionsLength++, newPositions.push(b);
	    }
	    var ci = newPositions.indexOf(c);
	    if (ci === -1) {
	      ci = newPositionsLength++, newPositions.push(c);
	    }

	    // Add the original positions to the new positions, but don't add duplicates
	    var v0i = newPositions.indexOf(v0);
	    if (v0i === -1) {
	      v0i = newPositionsLength++, newPositions.push(v0);
	    }
	    var v1i = newPositions.indexOf(v1);
	    if (v1i === -1) {
	      v1i = newPositionsLength++, newPositions.push(v1);
	    }
	    var v2i = newPositions.indexOf(v2);
	    if (v2i === -1) {
	      v2i = newPositionsLength++, newPositions.push(v2);
	    }

	    // Add the indexes to the cell surfaces
	    newCells.push([v0i, ai, ci]);
	    newCells.push([v1i, bi, ai]);
	    newCells.push([v2i, ci, bi]);
	    newCells.push([ai, bi, ci]);
	  }

	  return {
	    cells: newCells,
	    positions: newPositions
	  };
	}

	// reuse midpoint vertices between iterations.
	// Otherwise, there'll be duplicate vertices in the final
	// mesh, resulting in sharp edges.
	function getMidpoint(a, b) {
	  var point = midpoint(a, b);
	  // pointToKey uses toPrecision(6) to compare points
	  // if the points are that close, use the same one
	  var pointKey = pointToKey(point);
	  var cache = getMidpoint._midpointsCache;
	  var cachedPoint = cache[pointKey];
	  if (cachedPoint) {
	    return cachedPoint;
	  } else {
	    return cache[pointKey] = point;
	  }
	}

	getMidpoint._midpointsCache = {};

	function midpoint(a, b) {
	  return _glMatrix.vec3.fromValues((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2);
	}

	function pointToKey(position) {
	  return position[0].toPrecision(6) + ',' + position[1].toPrecision(6) + ',' + position[2].toPrecision(6);
	}

/***/ },
/* 8 */
/*!******************************!*\
  !*** ./~/gl-shader/index.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var createUniformWrapper = __webpack_require__(/*! ./lib/create-uniforms */ 9);
	var createAttributeWrapper = __webpack_require__(/*! ./lib/create-attributes */ 12);
	var makeReflect = __webpack_require__(/*! ./lib/reflect */ 10);
	var shaderCache = __webpack_require__(/*! ./lib/shader-cache */ 13);
	var runtime = __webpack_require__(/*! ./lib/runtime-reflect */ 33);
	var GLError = __webpack_require__(/*! ./lib/GLError */ 11);

	//Shader object
	function Shader(gl) {
	  this.gl = gl;

	  //Default initialize these to null
	  this._vref = this._fref = this._relink = this.vertShader = this.fragShader = this.program = this.attributes = this.uniforms = this.types = null;
	}

	var proto = Shader.prototype;

	proto.bind = function () {
	  if (!this.program) {
	    this._relink();
	  }
	  this.gl.useProgram(this.program);
	};

	proto.dispose = function () {
	  if (this._fref) {
	    this._fref.dispose();
	  }
	  if (this._vref) {
	    this._vref.dispose();
	  }
	  this.attributes = this.types = this.vertShader = this.fragShader = this.program = this._relink = this._fref = this._vref = null;
	};

	function compareAttributes(a, b) {
	  if (a.name < b.name) {
	    return -1;
	  }
	  return 1;
	}

	//Update export hook for glslify-live
	proto.update = function (vertSource, fragSource, uniforms, attributes) {

	  //If only one object passed, assume glslify style output
	  if (!fragSource || arguments.length === 1) {
	    var obj = vertSource;
	    vertSource = obj.vertex;
	    fragSource = obj.fragment;
	    uniforms = obj.uniforms;
	    attributes = obj.attributes;
	  }

	  var wrapper = this;
	  var gl = wrapper.gl;

	  //Compile vertex and fragment shaders
	  var pvref = wrapper._vref;
	  wrapper._vref = shaderCache.shader(gl, gl.VERTEX_SHADER, vertSource);
	  if (pvref) {
	    pvref.dispose();
	  }
	  wrapper.vertShader = wrapper._vref.shader;
	  var pfref = this._fref;
	  wrapper._fref = shaderCache.shader(gl, gl.FRAGMENT_SHADER, fragSource);
	  if (pfref) {
	    pfref.dispose();
	  }
	  wrapper.fragShader = wrapper._fref.shader;

	  //If uniforms/attributes is not specified, use RT reflection
	  if (!uniforms || !attributes) {

	    //Create initial test program
	    var testProgram = gl.createProgram();
	    gl.attachShader(testProgram, wrapper.fragShader);
	    gl.attachShader(testProgram, wrapper.vertShader);
	    gl.linkProgram(testProgram);
	    if (!gl.getProgramParameter(testProgram, gl.LINK_STATUS)) {
	      var errLog = gl.getProgramInfoLog(testProgram);
	      throw new GLError(errLog, 'Error linking program:' + errLog);
	    }

	    //Load data from runtime
	    uniforms = uniforms || runtime.uniforms(gl, testProgram);
	    attributes = attributes || runtime.attributes(gl, testProgram);

	    //Release test program
	    gl.deleteProgram(testProgram);
	  }

	  //Sort attributes lexicographically
	  // overrides undefined WebGL behavior for attribute locations
	  attributes = attributes.slice();
	  attributes.sort(compareAttributes);

	  //Convert attribute types, read out locations
	  var attributeUnpacked = [];
	  var attributeNames = [];
	  var attributeLocations = [];
	  for (var i = 0; i < attributes.length; ++i) {
	    var attr = attributes[i];
	    if (attr.type.indexOf('mat') >= 0) {
	      var size = attr.type.charAt(attr.type.length - 1) | 0;
	      var locVector = new Array(size);
	      for (var j = 0; j < size; ++j) {
	        locVector[j] = attributeLocations.length;
	        attributeNames.push(attr.name + '[' + j + ']');
	        if (typeof attr.location === 'number') {
	          attributeLocations.push(attr.location + j);
	        } else if (Array.isArray(attr.location) && attr.location.length === size && typeof attr.location[j] === 'number') {
	          attributeLocations.push(attr.location[j] | 0);
	        } else {
	          attributeLocations.push(-1);
	        }
	      }
	      attributeUnpacked.push({
	        name: attr.name,
	        type: attr.type,
	        locations: locVector
	      });
	    } else {
	      attributeUnpacked.push({
	        name: attr.name,
	        type: attr.type,
	        locations: [attributeLocations.length]
	      });
	      attributeNames.push(attr.name);
	      if (typeof attr.location === 'number') {
	        attributeLocations.push(attr.location | 0);
	      } else {
	        attributeLocations.push(-1);
	      }
	    }
	  }

	  //For all unspecified attributes, assign them lexicographically min attribute
	  var curLocation = 0;
	  for (var i = 0; i < attributeLocations.length; ++i) {
	    if (attributeLocations[i] < 0) {
	      while (attributeLocations.indexOf(curLocation) >= 0) {
	        curLocation += 1;
	      }
	      attributeLocations[i] = curLocation;
	    }
	  }

	  //Rebuild program and recompute all uniform locations
	  var uniformLocations = new Array(uniforms.length);
	  function relink() {
	    wrapper.program = shaderCache.program(gl, wrapper._vref, wrapper._fref, attributeNames, attributeLocations);

	    for (var i = 0; i < uniforms.length; ++i) {
	      uniformLocations[i] = gl.getUniformLocation(wrapper.program, uniforms[i].name);
	    }
	  }

	  //Perform initial linking, reuse program used for reflection
	  relink();

	  //Save relinking procedure, defer until runtime
	  wrapper._relink = relink;

	  //Generate type info
	  wrapper.types = {
	    uniforms: makeReflect(uniforms),
	    attributes: makeReflect(attributes)
	  };

	  //Generate attribute wrappers
	  wrapper.attributes = createAttributeWrapper(gl, wrapper, attributeUnpacked, attributeLocations);

	  //Generate uniform wrappers
	  Object.defineProperty(wrapper, 'uniforms', createUniformWrapper(gl, wrapper, uniforms, uniformLocations));
	};

	//Compiles and links a shader program with the given attribute and vertex list
	function createShader(gl, vertSource, fragSource, uniforms, attributes) {

	  var shader = new Shader(gl);

	  shader.update(vertSource, fragSource, uniforms, attributes);

	  return shader;
	}

	module.exports = createShader;

/***/ },
/* 9 */
/*!********************************************!*\
  !*** ./~/gl-shader/lib/create-uniforms.js ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var coallesceUniforms = __webpack_require__(/*! ./reflect */ 10);
	var GLError = __webpack_require__(/*! ./GLError */ 11);

	module.exports = createUniformWrapper;

	//Binds a function and returns a value
	function identity(x) {
	  var c = new Function('y', 'return function(){return y}');
	  return c(x);
	}

	function makeVector(length, fill) {
	  var result = new Array(length);
	  for (var i = 0; i < length; ++i) {
	    result[i] = fill;
	  }
	  return result;
	}

	//Create shims for uniforms
	function createUniformWrapper(gl, wrapper, uniforms, locations) {

	  function makeGetter(index) {
	    var proc = new Function('gl', 'wrapper', 'locations', 'return function(){return gl.getUniform(wrapper.program,locations[' + index + '])}');
	    return proc(gl, wrapper, locations);
	  }

	  function makePropSetter(path, index, type) {
	    switch (type) {
	      case 'bool':
	      case 'int':
	      case 'sampler2D':
	      case 'samplerCube':
	        return 'gl.uniform1i(locations[' + index + '],obj' + path + ')';
	      case 'float':
	        return 'gl.uniform1f(locations[' + index + '],obj' + path + ')';
	      default:
	        var vidx = type.indexOf('vec');
	        if (0 <= vidx && vidx <= 1 && type.length === 4 + vidx) {
	          var d = type.charCodeAt(type.length - 1) - 48;
	          if (d < 2 || d > 4) {
	            throw new GLError('', 'Invalid data type');
	          }
	          switch (type.charAt(0)) {
	            case 'b':
	            case 'i':
	              return 'gl.uniform' + d + 'iv(locations[' + index + '],obj' + path + ')';
	            case 'v':
	              return 'gl.uniform' + d + 'fv(locations[' + index + '],obj' + path + ')';
	            default:
	              throw new GLError('', 'Unrecognized data type for vector ' + name + ': ' + type);
	          }
	        } else if (type.indexOf('mat') === 0 && type.length === 4) {
	          var d = type.charCodeAt(type.length - 1) - 48;
	          if (d < 2 || d > 4) {
	            throw new GLError('', 'Invalid uniform dimension type for matrix ' + name + ': ' + type);
	          }
	          return 'gl.uniformMatrix' + d + 'fv(locations[' + index + '],false,obj' + path + ')';
	        } else {
	          throw new GLError('', 'Unknown uniform data type for ' + name + ': ' + type);
	        }
	        break;
	    }
	  }

	  function enumerateIndices(prefix, type) {
	    if ((typeof type === 'undefined' ? 'undefined' : _typeof(type)) !== 'object') {
	      return [[prefix, type]];
	    }
	    var indices = [];
	    for (var id in type) {
	      var prop = type[id];
	      var tprefix = prefix;
	      if (parseInt(id) + '' === id) {
	        tprefix += '[' + id + ']';
	      } else {
	        tprefix += '.' + id;
	      }
	      if ((typeof prop === 'undefined' ? 'undefined' : _typeof(prop)) === 'object') {
	        indices.push.apply(indices, enumerateIndices(tprefix, prop));
	      } else {
	        indices.push([tprefix, prop]);
	      }
	    }
	    return indices;
	  }

	  function makeSetter(type) {
	    var code = ['return function updateProperty(obj){'];
	    var indices = enumerateIndices('', type);
	    for (var i = 0; i < indices.length; ++i) {
	      var item = indices[i];
	      var path = item[0];
	      var idx = item[1];
	      if (locations[idx]) {
	        code.push(makePropSetter(path, idx, uniforms[idx].type));
	      }
	    }
	    code.push('return obj}');
	    var proc = new Function('gl', 'locations', code.join('\n'));
	    return proc(gl, locations);
	  }

	  function defaultValue(type) {
	    switch (type) {
	      case 'bool':
	        return false;
	      case 'int':
	      case 'sampler2D':
	      case 'samplerCube':
	        return 0;
	      case 'float':
	        return 0.0;
	      default:
	        var vidx = type.indexOf('vec');
	        if (0 <= vidx && vidx <= 1 && type.length === 4 + vidx) {
	          var d = type.charCodeAt(type.length - 1) - 48;
	          if (d < 2 || d > 4) {
	            throw new GLError('', 'Invalid data type');
	          }
	          if (type.charAt(0) === 'b') {
	            return makeVector(d, false);
	          }
	          return makeVector(d, 0);
	        } else if (type.indexOf('mat') === 0 && type.length === 4) {
	          var d = type.charCodeAt(type.length - 1) - 48;
	          if (d < 2 || d > 4) {
	            throw new GLError('', 'Invalid uniform dimension type for matrix ' + name + ': ' + type);
	          }
	          return makeVector(d * d, 0);
	        } else {
	          throw new GLError('', 'Unknown uniform data type for ' + name + ': ' + type);
	        }
	        break;
	    }
	  }

	  function storeProperty(obj, prop, type) {
	    if ((typeof type === 'undefined' ? 'undefined' : _typeof(type)) === 'object') {
	      var child = processObject(type);
	      Object.defineProperty(obj, prop, {
	        get: identity(child),
	        set: makeSetter(type),
	        enumerable: true,
	        configurable: false
	      });
	    } else {
	      if (locations[type]) {
	        Object.defineProperty(obj, prop, {
	          get: makeGetter(type),
	          set: makeSetter(type),
	          enumerable: true,
	          configurable: false
	        });
	      } else {
	        obj[prop] = defaultValue(uniforms[type].type);
	      }
	    }
	  }

	  function processObject(obj) {
	    var result;
	    if (Array.isArray(obj)) {
	      result = new Array(obj.length);
	      for (var i = 0; i < obj.length; ++i) {
	        storeProperty(result, i, obj[i]);
	      }
	    } else {
	      result = {};
	      for (var id in obj) {
	        storeProperty(result, id, obj[id]);
	      }
	    }
	    return result;
	  }

	  //Return data
	  var coallesced = coallesceUniforms(uniforms, true);
	  return {
	    get: identity(processObject(coallesced)),
	    set: makeSetter(coallesced),
	    enumerable: true,
	    configurable: true
	  };
	}

/***/ },
/* 10 */
/*!************************************!*\
  !*** ./~/gl-shader/lib/reflect.js ***!
  \************************************/
/***/ function(module, exports) {

	'use strict';

	module.exports = makeReflectTypes;

	//Construct type info for reflection.
	//
	// This iterates over the flattened list of uniform type values and smashes them into a JSON object.
	//
	// The leaves of the resulting object are either indices or type strings representing primitive glslify types
	function makeReflectTypes(uniforms, useIndex) {
	  var obj = {};
	  for (var i = 0; i < uniforms.length; ++i) {
	    var n = uniforms[i].name;
	    var parts = n.split(".");
	    var o = obj;
	    for (var j = 0; j < parts.length; ++j) {
	      var x = parts[j].split("[");
	      if (x.length > 1) {
	        if (!(x[0] in o)) {
	          o[x[0]] = [];
	        }
	        o = o[x[0]];
	        for (var k = 1; k < x.length; ++k) {
	          var y = parseInt(x[k]);
	          if (k < x.length - 1 || j < parts.length - 1) {
	            if (!(y in o)) {
	              if (k < x.length - 1) {
	                o[y] = [];
	              } else {
	                o[y] = {};
	              }
	            }
	            o = o[y];
	          } else {
	            if (useIndex) {
	              o[y] = i;
	            } else {
	              o[y] = uniforms[i].type;
	            }
	          }
	        }
	      } else if (j < parts.length - 1) {
	        if (!(x[0] in o)) {
	          o[x[0]] = {};
	        }
	        o = o[x[0]];
	      } else {
	        if (useIndex) {
	          o[x[0]] = i;
	        } else {
	          o[x[0]] = uniforms[i].type;
	        }
	      }
	    }
	  }
	  return obj;
	}

/***/ },
/* 11 */
/*!************************************!*\
  !*** ./~/gl-shader/lib/GLError.js ***!
  \************************************/
/***/ function(module, exports) {

	'use strict';

	function GLError(rawError, shortMessage, longMessage) {
	    this.shortMessage = shortMessage || '';
	    this.longMessage = longMessage || '';
	    this.rawError = rawError || '';
	    this.message = 'gl-shader: ' + (shortMessage || rawError || '') + (longMessage ? '\n' + longMessage : '');
	    this.stack = new Error().stack;
	}
	GLError.prototype = new Error();
	GLError.prototype.name = 'GLError';
	GLError.prototype.constructor = GLError;
	module.exports = GLError;

/***/ },
/* 12 */
/*!**********************************************!*\
  !*** ./~/gl-shader/lib/create-attributes.js ***!
  \**********************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = createAttributeWrapper;

	var GLError = __webpack_require__(/*! ./GLError */ 11);

	function ShaderAttribute(gl, wrapper, index, locations, dimension, constFunc) {
	  this._gl = gl;
	  this._wrapper = wrapper;
	  this._index = index;
	  this._locations = locations;
	  this._dimension = dimension;
	  this._constFunc = constFunc;
	}

	var proto = ShaderAttribute.prototype;

	proto.pointer = function setAttribPointer(type, normalized, stride, offset) {

	  var self = this;
	  var gl = self._gl;
	  var location = self._locations[self._index];

	  gl.vertexAttribPointer(location, self._dimension, type || gl.FLOAT, !!normalized, stride || 0, offset || 0);
	  gl.enableVertexAttribArray(location);
	};

	proto.set = function (x0, x1, x2, x3) {
	  return this._constFunc(this._locations[this._index], x0, x1, x2, x3);
	};

	Object.defineProperty(proto, 'location', {
	  get: function get() {
	    return this._locations[this._index];
	  },
	  set: function set(v) {
	    if (v !== this._locations[this._index]) {
	      this._locations[this._index] = v | 0;
	      this._wrapper.program = null;
	    }
	    return v | 0;
	  }
	});

	//Adds a vector attribute to obj
	function addVectorAttribute(gl, wrapper, index, locations, dimension, obj, name) {

	  //Construct constant function
	  var constFuncArgs = ['gl', 'v'];
	  var varNames = [];
	  for (var i = 0; i < dimension; ++i) {
	    constFuncArgs.push('x' + i);
	    varNames.push('x' + i);
	  }
	  constFuncArgs.push('if(x0.length===void 0){return gl.vertexAttrib' + dimension + 'f(v,' + varNames.join() + ')}else{return gl.vertexAttrib' + dimension + 'fv(v,x0)}');
	  var constFunc = Function.apply(null, constFuncArgs);

	  //Create attribute wrapper
	  var attr = new ShaderAttribute(gl, wrapper, index, locations, dimension, constFunc);

	  //Create accessor
	  Object.defineProperty(obj, name, {
	    set: function set(x) {
	      gl.disableVertexAttribArray(locations[index]);
	      constFunc(gl, locations[index], x);
	      return x;
	    },
	    get: function get() {
	      return attr;
	    },
	    enumerable: true
	  });
	}

	function addMatrixAttribute(gl, wrapper, index, locations, dimension, obj, name) {

	  var parts = new Array(dimension);
	  var attrs = new Array(dimension);
	  for (var i = 0; i < dimension; ++i) {
	    addVectorAttribute(gl, wrapper, index[i], locations, dimension, parts, i);
	    attrs[i] = parts[i];
	  }

	  Object.defineProperty(parts, 'location', {
	    set: function set(v) {
	      if (Array.isArray(v)) {
	        for (var i = 0; i < dimension; ++i) {
	          attrs[i].location = v[i];
	        }
	      } else {
	        for (var i = 0; i < dimension; ++i) {
	          attrs[i].location = v + i;
	        }
	      }
	      return v;
	    },
	    get: function get() {
	      var result = new Array(dimension);
	      for (var i = 0; i < dimension; ++i) {
	        result[i] = locations[index[i]];
	      }
	      return result;
	    },
	    enumerable: true
	  });

	  parts.pointer = function (type, normalized, stride, offset) {
	    type = type || gl.FLOAT;
	    normalized = !!normalized;
	    stride = stride || dimension * dimension;
	    offset = offset || 0;
	    for (var i = 0; i < dimension; ++i) {
	      var location = locations[index[i]];
	      gl.vertexAttribPointer(location, dimension, type, normalized, stride, offset + i * dimension);
	      gl.enableVertexAttribArray(location);
	    }
	  };

	  var scratch = new Array(dimension);
	  var vertexAttrib = gl['vertexAttrib' + dimension + 'fv'];

	  Object.defineProperty(obj, name, {
	    set: function set(x) {
	      for (var i = 0; i < dimension; ++i) {
	        var loc = locations[index[i]];
	        gl.disableVertexAttribArray(loc);
	        if (Array.isArray(x[0])) {
	          vertexAttrib.call(gl, loc, x[i]);
	        } else {
	          for (var j = 0; j < dimension; ++j) {
	            scratch[j] = x[dimension * i + j];
	          }
	          vertexAttrib.call(gl, loc, scratch);
	        }
	      }
	      return x;
	    },
	    get: function get() {
	      return parts;
	    },
	    enumerable: true
	  });
	}

	//Create shims for attributes
	function createAttributeWrapper(gl, wrapper, attributes, locations) {

	  var obj = {};
	  for (var i = 0, n = attributes.length; i < n; ++i) {

	    var a = attributes[i];
	    var name = a.name;
	    var type = a.type;
	    var locs = a.locations;

	    switch (type) {
	      case 'bool':
	      case 'int':
	      case 'float':
	        addVectorAttribute(gl, wrapper, locs[0], locations, 1, obj, name);
	        break;

	      default:
	        if (type.indexOf('vec') >= 0) {
	          var d = type.charCodeAt(type.length - 1) - 48;
	          if (d < 2 || d > 4) {
	            throw new GLError('', 'Invalid data type for attribute ' + name + ': ' + type);
	          }
	          addVectorAttribute(gl, wrapper, locs[0], locations, d, obj, name);
	        } else if (type.indexOf('mat') >= 0) {
	          var d = type.charCodeAt(type.length - 1) - 48;
	          if (d < 2 || d > 4) {
	            throw new GLError('', 'Invalid data type for attribute ' + name + ': ' + type);
	          }
	          addMatrixAttribute(gl, wrapper, locs, locations, d, obj, name);
	        } else {
	          throw new GLError('', 'Unknown data type for attribute ' + name + ': ' + type);
	        }
	        break;
	    }
	  }
	  return obj;
	}

/***/ },
/* 13 */
/*!*****************************************!*\
  !*** ./~/gl-shader/lib/shader-cache.js ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.shader = getShaderReference;
	exports.program = createProgram;

	var GLError = __webpack_require__(/*! ./GLError */ 11);
	var formatCompilerError = __webpack_require__(/*! gl-format-compiler-error */ 14);

	var weakMap = typeof WeakMap === 'undefined' ? __webpack_require__(/*! weakmap-shim */ 30) : WeakMap;
	var CACHE = new weakMap();

	var SHADER_COUNTER = 0;

	function ShaderReference(id, src, type, shader, programs, count, cache) {
	  this.id = id;
	  this.src = src;
	  this.type = type;
	  this.shader = shader;
	  this.count = count;
	  this.programs = [];
	  this.cache = cache;
	}

	ShaderReference.prototype.dispose = function () {
	  if (--this.count === 0) {
	    var cache = this.cache;
	    var gl = cache.gl;

	    //Remove program references
	    var programs = this.programs;
	    for (var i = 0, n = programs.length; i < n; ++i) {
	      var p = cache.programs[programs[i]];
	      if (p) {
	        delete cache.programs[i];
	        gl.deleteProgram(p);
	      }
	    }

	    //Remove shader reference
	    gl.deleteShader(this.shader);
	    delete cache.shaders[this.type === gl.FRAGMENT_SHADER | 0][this.src];
	  }
	};

	function ContextCache(gl) {
	  this.gl = gl;
	  this.shaders = [{}, {}];
	  this.programs = {};
	}

	var proto = ContextCache.prototype;

	function compileShader(gl, type, src) {
	  var shader = gl.createShader(type);
	  gl.shaderSource(shader, src);
	  gl.compileShader(shader);
	  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	    var errLog = gl.getShaderInfoLog(shader);
	    try {
	      var fmt = formatCompilerError(errLog, src, type);
	    } catch (e) {
	      console.warn('Failed to format compiler error: ' + e);
	      throw new GLError(errLog, 'Error compiling shader:\n' + errLog);
	    }
	    throw new GLError(errLog, fmt.short, fmt.long);
	  }
	  return shader;
	}

	proto.getShaderReference = function (type, src) {
	  var gl = this.gl;
	  var shaders = this.shaders[type === gl.FRAGMENT_SHADER | 0];
	  var shader = shaders[src];
	  if (!shader || !gl.isShader(shader.shader)) {
	    var shaderObj = compileShader(gl, type, src);
	    shader = shaders[src] = new ShaderReference(SHADER_COUNTER++, src, type, shaderObj, [], 1, this);
	  } else {
	    shader.count += 1;
	  }
	  return shader;
	};

	function linkProgram(gl, vshader, fshader, attribs, locations) {
	  var program = gl.createProgram();
	  gl.attachShader(program, vshader);
	  gl.attachShader(program, fshader);
	  for (var i = 0; i < attribs.length; ++i) {
	    gl.bindAttribLocation(program, locations[i], attribs[i]);
	  }
	  gl.linkProgram(program);
	  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
	    var errLog = gl.getProgramInfoLog(program);
	    throw new GLError(errLog, 'Error linking program: ' + errLog);
	  }
	  return program;
	}

	proto.getProgram = function (vref, fref, attribs, locations) {
	  var token = [vref.id, fref.id, attribs.join(':'), locations.join(':')].join('@');
	  var prog = this.programs[token];
	  if (!prog || !this.gl.isProgram(prog)) {
	    this.programs[token] = prog = linkProgram(this.gl, vref.shader, fref.shader, attribs, locations);
	    vref.programs.push(token);
	    fref.programs.push(token);
	  }
	  return prog;
	};

	function getCache(gl) {
	  var ctxCache = CACHE.get(gl);
	  if (!ctxCache) {
	    ctxCache = new ContextCache(gl);
	    CACHE.set(gl, ctxCache);
	  }
	  return ctxCache;
	}

	function getShaderReference(gl, type, src) {
	  return getCache(gl).getShaderReference(type, src);
	}

	function createProgram(gl, vref, fref, attribs, locations) {
	  return getCache(gl).getProgram(vref, fref, attribs, locations);
	}

/***/ },
/* 14 */
/*!*********************************************!*\
  !*** ./~/gl-format-compiler-error/index.js ***!
  \*********************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var sprintf = __webpack_require__(/*! sprintf-js */ 15).sprintf;
	var glConstants = __webpack_require__(/*! gl-constants/lookup */ 16);
	var shaderName = __webpack_require__(/*! glsl-shader-name */ 18);
	var addLineNumbers = __webpack_require__(/*! add-line-numbers */ 27);

	module.exports = formatCompilerError;

	function formatCompilerError(errLog, src, type) {
	    "use strict";

	    var name = shaderName(src) || 'of unknown name (see npm glsl-shader-name)';

	    var typeName = 'unknown type';
	    if (type !== undefined) {
	        typeName = type === glConstants.FRAGMENT_SHADER ? 'fragment' : 'vertex';
	    }

	    var longForm = sprintf('Error compiling %s shader %s:\n', typeName, name);
	    var shortForm = sprintf("%s%s", longForm, errLog);

	    var errorStrings = errLog.split('\n');
	    var errors = {};

	    for (var i = 0; i < errorStrings.length; i++) {
	        var errorString = errorStrings[i];
	        if (errorString === '') continue;
	        var lineNo = parseInt(errorString.split(':')[2]);
	        if (isNaN(lineNo)) {
	            throw new Error(sprintf('Could not parse error: %s', errorString));
	        }
	        errors[lineNo] = errorString;
	    }

	    var lines = addLineNumbers(src).split('\n');

	    for (var i = 0; i < lines.length; i++) {
	        if (!errors[i + 3] && !errors[i + 2] && !errors[i + 1]) continue;
	        var line = lines[i];
	        longForm += line + '\n';
	        if (errors[i + 1]) {
	            var e = errors[i + 1];
	            e = e.substr(e.split(':', 3).join(':').length + 1).trim();
	            longForm += sprintf('^^^ %s\n\n', e);
	        }
	    }

	    return {
	        long: longForm.trim(),
	        short: shortForm.trim()
	    };
	}

/***/ },
/* 15 */
/*!*************************************!*\
  !*** ./~/sprintf-js/src/sprintf.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	(function (window) {
	    var re = {
	        not_string: /[^s]/,
	        number: /[diefg]/,
	        json: /[j]/,
	        not_json: /[^j]/,
	        text: /^[^\x25]+/,
	        modulo: /^\x25{2}/,
	        placeholder: /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijosuxX])/,
	        key: /^([a-z_][a-z_\d]*)/i,
	        key_access: /^\.([a-z_][a-z_\d]*)/i,
	        index_access: /^\[(\d+)\]/,
	        sign: /^[\+\-]/
	    };

	    function sprintf() {
	        var key = arguments[0],
	            cache = sprintf.cache;
	        if (!(cache[key] && cache.hasOwnProperty(key))) {
	            cache[key] = sprintf.parse(key);
	        }
	        return sprintf.format.call(null, cache[key], arguments);
	    }

	    sprintf.format = function (parse_tree, argv) {
	        var cursor = 1,
	            tree_length = parse_tree.length,
	            node_type = "",
	            arg,
	            output = [],
	            i,
	            k,
	            match,
	            pad,
	            pad_character,
	            pad_length,
	            is_positive = true,
	            sign = "";
	        for (i = 0; i < tree_length; i++) {
	            node_type = get_type(parse_tree[i]);
	            if (node_type === "string") {
	                output[output.length] = parse_tree[i];
	            } else if (node_type === "array") {
	                match = parse_tree[i]; // convenience purposes only
	                if (match[2]) {
	                    // keyword argument
	                    arg = argv[cursor];
	                    for (k = 0; k < match[2].length; k++) {
	                        if (!arg.hasOwnProperty(match[2][k])) {
	                            throw new Error(sprintf("[sprintf] property '%s' does not exist", match[2][k]));
	                        }
	                        arg = arg[match[2][k]];
	                    }
	                } else if (match[1]) {
	                    // positional argument (explicit)
	                    arg = argv[match[1]];
	                } else {
	                    // positional argument (implicit)
	                    arg = argv[cursor++];
	                }

	                if (get_type(arg) == "function") {
	                    arg = arg();
	                }

	                if (re.not_string.test(match[8]) && re.not_json.test(match[8]) && get_type(arg) != "number" && isNaN(arg)) {
	                    throw new TypeError(sprintf("[sprintf] expecting number but found %s", get_type(arg)));
	                }

	                if (re.number.test(match[8])) {
	                    is_positive = arg >= 0;
	                }

	                switch (match[8]) {
	                    case "b":
	                        arg = arg.toString(2);
	                        break;
	                    case "c":
	                        arg = String.fromCharCode(arg);
	                        break;
	                    case "d":
	                    case "i":
	                        arg = parseInt(arg, 10);
	                        break;
	                    case "j":
	                        arg = JSON.stringify(arg, null, match[6] ? parseInt(match[6]) : 0);
	                        break;
	                    case "e":
	                        arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential();
	                        break;
	                    case "f":
	                        arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg);
	                        break;
	                    case "g":
	                        arg = match[7] ? parseFloat(arg).toPrecision(match[7]) : parseFloat(arg);
	                        break;
	                    case "o":
	                        arg = arg.toString(8);
	                        break;
	                    case "s":
	                        arg = (arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg;
	                        break;
	                    case "u":
	                        arg = arg >>> 0;
	                        break;
	                    case "x":
	                        arg = arg.toString(16);
	                        break;
	                    case "X":
	                        arg = arg.toString(16).toUpperCase();
	                        break;
	                }
	                if (re.json.test(match[8])) {
	                    output[output.length] = arg;
	                } else {
	                    if (re.number.test(match[8]) && (!is_positive || match[3])) {
	                        sign = is_positive ? "+" : "-";
	                        arg = arg.toString().replace(re.sign, "");
	                    } else {
	                        sign = "";
	                    }
	                    pad_character = match[4] ? match[4] === "0" ? "0" : match[4].charAt(1) : " ";
	                    pad_length = match[6] - (sign + arg).length;
	                    pad = match[6] ? pad_length > 0 ? str_repeat(pad_character, pad_length) : "" : "";
	                    output[output.length] = match[5] ? sign + arg + pad : pad_character === "0" ? sign + pad + arg : pad + sign + arg;
	                }
	            }
	        }
	        return output.join("");
	    };

	    sprintf.cache = {};

	    sprintf.parse = function (fmt) {
	        var _fmt = fmt,
	            match = [],
	            parse_tree = [],
	            arg_names = 0;
	        while (_fmt) {
	            if ((match = re.text.exec(_fmt)) !== null) {
	                parse_tree[parse_tree.length] = match[0];
	            } else if ((match = re.modulo.exec(_fmt)) !== null) {
	                parse_tree[parse_tree.length] = "%";
	            } else if ((match = re.placeholder.exec(_fmt)) !== null) {
	                if (match[2]) {
	                    arg_names |= 1;
	                    var field_list = [],
	                        replacement_field = match[2],
	                        field_match = [];
	                    if ((field_match = re.key.exec(replacement_field)) !== null) {
	                        field_list[field_list.length] = field_match[1];
	                        while ((replacement_field = replacement_field.substring(field_match[0].length)) !== "") {
	                            if ((field_match = re.key_access.exec(replacement_field)) !== null) {
	                                field_list[field_list.length] = field_match[1];
	                            } else if ((field_match = re.index_access.exec(replacement_field)) !== null) {
	                                field_list[field_list.length] = field_match[1];
	                            } else {
	                                throw new SyntaxError("[sprintf] failed to parse named argument key");
	                            }
	                        }
	                    } else {
	                        throw new SyntaxError("[sprintf] failed to parse named argument key");
	                    }
	                    match[2] = field_list;
	                } else {
	                    arg_names |= 2;
	                }
	                if (arg_names === 3) {
	                    throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported");
	                }
	                parse_tree[parse_tree.length] = match;
	            } else {
	                throw new SyntaxError("[sprintf] unexpected placeholder");
	            }
	            _fmt = _fmt.substring(match[0].length);
	        }
	        return parse_tree;
	    };

	    var vsprintf = function vsprintf(fmt, argv, _argv) {
	        _argv = (argv || []).slice(0);
	        _argv.splice(0, 0, fmt);
	        return sprintf.apply(null, _argv);
	    };

	    /**
	     * helpers
	     */
	    function get_type(variable) {
	        return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
	    }

	    function str_repeat(input, multiplier) {
	        return Array(multiplier + 1).join(input);
	    }

	    /**
	     * export to either browser or node.js
	     */
	    if (true) {
	        exports.sprintf = sprintf;
	        exports.vsprintf = vsprintf;
	    } else {
	        window.sprintf = sprintf;
	        window.vsprintf = vsprintf;

	        if (typeof define === "function" && define.amd) {
	            define(function () {
	                return {
	                    sprintf: sprintf,
	                    vsprintf: vsprintf
	                };
	            });
	        }
	    }
	})(typeof window === "undefined" ? undefined : window);

/***/ },
/* 16 */
/*!**********************************!*\
  !*** ./~/gl-constants/lookup.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var gl10 = __webpack_require__(/*! ./1.0/numbers */ 17);

	module.exports = function lookupConstant(number) {
	  return gl10[number];
	};

/***/ },
/* 17 */
/*!***************************************!*\
  !*** ./~/gl-constants/1.0/numbers.js ***!
  \***************************************/
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  0: 'NONE',
	  1: 'ONE',
	  2: 'LINE_LOOP',
	  3: 'LINE_STRIP',
	  4: 'TRIANGLES',
	  5: 'TRIANGLE_STRIP',
	  6: 'TRIANGLE_FAN',
	  256: 'DEPTH_BUFFER_BIT',
	  512: 'NEVER',
	  513: 'LESS',
	  514: 'EQUAL',
	  515: 'LEQUAL',
	  516: 'GREATER',
	  517: 'NOTEQUAL',
	  518: 'GEQUAL',
	  519: 'ALWAYS',
	  768: 'SRC_COLOR',
	  769: 'ONE_MINUS_SRC_COLOR',
	  770: 'SRC_ALPHA',
	  771: 'ONE_MINUS_SRC_ALPHA',
	  772: 'DST_ALPHA',
	  773: 'ONE_MINUS_DST_ALPHA',
	  774: 'DST_COLOR',
	  775: 'ONE_MINUS_DST_COLOR',
	  776: 'SRC_ALPHA_SATURATE',
	  1024: 'STENCIL_BUFFER_BIT',
	  1028: 'FRONT',
	  1029: 'BACK',
	  1032: 'FRONT_AND_BACK',
	  1280: 'INVALID_ENUM',
	  1281: 'INVALID_VALUE',
	  1282: 'INVALID_OPERATION',
	  1285: 'OUT_OF_MEMORY',
	  1286: 'INVALID_FRAMEBUFFER_OPERATION',
	  2304: 'CW',
	  2305: 'CCW',
	  2849: 'LINE_WIDTH',
	  2884: 'CULL_FACE',
	  2885: 'CULL_FACE_MODE',
	  2886: 'FRONT_FACE',
	  2928: 'DEPTH_RANGE',
	  2929: 'DEPTH_TEST',
	  2930: 'DEPTH_WRITEMASK',
	  2931: 'DEPTH_CLEAR_VALUE',
	  2932: 'DEPTH_FUNC',
	  2960: 'STENCIL_TEST',
	  2961: 'STENCIL_CLEAR_VALUE',
	  2962: 'STENCIL_FUNC',
	  2963: 'STENCIL_VALUE_MASK',
	  2964: 'STENCIL_FAIL',
	  2965: 'STENCIL_PASS_DEPTH_FAIL',
	  2966: 'STENCIL_PASS_DEPTH_PASS',
	  2967: 'STENCIL_REF',
	  2968: 'STENCIL_WRITEMASK',
	  2978: 'VIEWPORT',
	  3024: 'DITHER',
	  3042: 'BLEND',
	  3088: 'SCISSOR_BOX',
	  3089: 'SCISSOR_TEST',
	  3106: 'COLOR_CLEAR_VALUE',
	  3107: 'COLOR_WRITEMASK',
	  3317: 'UNPACK_ALIGNMENT',
	  3333: 'PACK_ALIGNMENT',
	  3379: 'MAX_TEXTURE_SIZE',
	  3386: 'MAX_VIEWPORT_DIMS',
	  3408: 'SUBPIXEL_BITS',
	  3410: 'RED_BITS',
	  3411: 'GREEN_BITS',
	  3412: 'BLUE_BITS',
	  3413: 'ALPHA_BITS',
	  3414: 'DEPTH_BITS',
	  3415: 'STENCIL_BITS',
	  3553: 'TEXTURE_2D',
	  4352: 'DONT_CARE',
	  4353: 'FASTEST',
	  4354: 'NICEST',
	  5120: 'BYTE',
	  5121: 'UNSIGNED_BYTE',
	  5122: 'SHORT',
	  5123: 'UNSIGNED_SHORT',
	  5124: 'INT',
	  5125: 'UNSIGNED_INT',
	  5126: 'FLOAT',
	  5386: 'INVERT',
	  5890: 'TEXTURE',
	  6401: 'STENCIL_INDEX',
	  6402: 'DEPTH_COMPONENT',
	  6406: 'ALPHA',
	  6407: 'RGB',
	  6408: 'RGBA',
	  6409: 'LUMINANCE',
	  6410: 'LUMINANCE_ALPHA',
	  7680: 'KEEP',
	  7681: 'REPLACE',
	  7682: 'INCR',
	  7683: 'DECR',
	  7936: 'VENDOR',
	  7937: 'RENDERER',
	  7938: 'VERSION',
	  9728: 'NEAREST',
	  9729: 'LINEAR',
	  9984: 'NEAREST_MIPMAP_NEAREST',
	  9985: 'LINEAR_MIPMAP_NEAREST',
	  9986: 'NEAREST_MIPMAP_LINEAR',
	  9987: 'LINEAR_MIPMAP_LINEAR',
	  10240: 'TEXTURE_MAG_FILTER',
	  10241: 'TEXTURE_MIN_FILTER',
	  10242: 'TEXTURE_WRAP_S',
	  10243: 'TEXTURE_WRAP_T',
	  10497: 'REPEAT',
	  10752: 'POLYGON_OFFSET_UNITS',
	  16384: 'COLOR_BUFFER_BIT',
	  32769: 'CONSTANT_COLOR',
	  32770: 'ONE_MINUS_CONSTANT_COLOR',
	  32771: 'CONSTANT_ALPHA',
	  32772: 'ONE_MINUS_CONSTANT_ALPHA',
	  32773: 'BLEND_COLOR',
	  32774: 'FUNC_ADD',
	  32777: 'BLEND_EQUATION_RGB',
	  32778: 'FUNC_SUBTRACT',
	  32779: 'FUNC_REVERSE_SUBTRACT',
	  32819: 'UNSIGNED_SHORT_4_4_4_4',
	  32820: 'UNSIGNED_SHORT_5_5_5_1',
	  32823: 'POLYGON_OFFSET_FILL',
	  32824: 'POLYGON_OFFSET_FACTOR',
	  32854: 'RGBA4',
	  32855: 'RGB5_A1',
	  32873: 'TEXTURE_BINDING_2D',
	  32926: 'SAMPLE_ALPHA_TO_COVERAGE',
	  32928: 'SAMPLE_COVERAGE',
	  32936: 'SAMPLE_BUFFERS',
	  32937: 'SAMPLES',
	  32938: 'SAMPLE_COVERAGE_VALUE',
	  32939: 'SAMPLE_COVERAGE_INVERT',
	  32968: 'BLEND_DST_RGB',
	  32969: 'BLEND_SRC_RGB',
	  32970: 'BLEND_DST_ALPHA',
	  32971: 'BLEND_SRC_ALPHA',
	  33071: 'CLAMP_TO_EDGE',
	  33170: 'GENERATE_MIPMAP_HINT',
	  33189: 'DEPTH_COMPONENT16',
	  33306: 'DEPTH_STENCIL_ATTACHMENT',
	  33635: 'UNSIGNED_SHORT_5_6_5',
	  33648: 'MIRRORED_REPEAT',
	  33901: 'ALIASED_POINT_SIZE_RANGE',
	  33902: 'ALIASED_LINE_WIDTH_RANGE',
	  33984: 'TEXTURE0',
	  33985: 'TEXTURE1',
	  33986: 'TEXTURE2',
	  33987: 'TEXTURE3',
	  33988: 'TEXTURE4',
	  33989: 'TEXTURE5',
	  33990: 'TEXTURE6',
	  33991: 'TEXTURE7',
	  33992: 'TEXTURE8',
	  33993: 'TEXTURE9',
	  33994: 'TEXTURE10',
	  33995: 'TEXTURE11',
	  33996: 'TEXTURE12',
	  33997: 'TEXTURE13',
	  33998: 'TEXTURE14',
	  33999: 'TEXTURE15',
	  34000: 'TEXTURE16',
	  34001: 'TEXTURE17',
	  34002: 'TEXTURE18',
	  34003: 'TEXTURE19',
	  34004: 'TEXTURE20',
	  34005: 'TEXTURE21',
	  34006: 'TEXTURE22',
	  34007: 'TEXTURE23',
	  34008: 'TEXTURE24',
	  34009: 'TEXTURE25',
	  34010: 'TEXTURE26',
	  34011: 'TEXTURE27',
	  34012: 'TEXTURE28',
	  34013: 'TEXTURE29',
	  34014: 'TEXTURE30',
	  34015: 'TEXTURE31',
	  34016: 'ACTIVE_TEXTURE',
	  34024: 'MAX_RENDERBUFFER_SIZE',
	  34041: 'DEPTH_STENCIL',
	  34055: 'INCR_WRAP',
	  34056: 'DECR_WRAP',
	  34067: 'TEXTURE_CUBE_MAP',
	  34068: 'TEXTURE_BINDING_CUBE_MAP',
	  34069: 'TEXTURE_CUBE_MAP_POSITIVE_X',
	  34070: 'TEXTURE_CUBE_MAP_NEGATIVE_X',
	  34071: 'TEXTURE_CUBE_MAP_POSITIVE_Y',
	  34072: 'TEXTURE_CUBE_MAP_NEGATIVE_Y',
	  34073: 'TEXTURE_CUBE_MAP_POSITIVE_Z',
	  34074: 'TEXTURE_CUBE_MAP_NEGATIVE_Z',
	  34076: 'MAX_CUBE_MAP_TEXTURE_SIZE',
	  34338: 'VERTEX_ATTRIB_ARRAY_ENABLED',
	  34339: 'VERTEX_ATTRIB_ARRAY_SIZE',
	  34340: 'VERTEX_ATTRIB_ARRAY_STRIDE',
	  34341: 'VERTEX_ATTRIB_ARRAY_TYPE',
	  34342: 'CURRENT_VERTEX_ATTRIB',
	  34373: 'VERTEX_ATTRIB_ARRAY_POINTER',
	  34466: 'NUM_COMPRESSED_TEXTURE_FORMATS',
	  34467: 'COMPRESSED_TEXTURE_FORMATS',
	  34660: 'BUFFER_SIZE',
	  34661: 'BUFFER_USAGE',
	  34816: 'STENCIL_BACK_FUNC',
	  34817: 'STENCIL_BACK_FAIL',
	  34818: 'STENCIL_BACK_PASS_DEPTH_FAIL',
	  34819: 'STENCIL_BACK_PASS_DEPTH_PASS',
	  34877: 'BLEND_EQUATION_ALPHA',
	  34921: 'MAX_VERTEX_ATTRIBS',
	  34922: 'VERTEX_ATTRIB_ARRAY_NORMALIZED',
	  34930: 'MAX_TEXTURE_IMAGE_UNITS',
	  34962: 'ARRAY_BUFFER',
	  34963: 'ELEMENT_ARRAY_BUFFER',
	  34964: 'ARRAY_BUFFER_BINDING',
	  34965: 'ELEMENT_ARRAY_BUFFER_BINDING',
	  34975: 'VERTEX_ATTRIB_ARRAY_BUFFER_BINDING',
	  35040: 'STREAM_DRAW',
	  35044: 'STATIC_DRAW',
	  35048: 'DYNAMIC_DRAW',
	  35632: 'FRAGMENT_SHADER',
	  35633: 'VERTEX_SHADER',
	  35660: 'MAX_VERTEX_TEXTURE_IMAGE_UNITS',
	  35661: 'MAX_COMBINED_TEXTURE_IMAGE_UNITS',
	  35663: 'SHADER_TYPE',
	  35664: 'FLOAT_VEC2',
	  35665: 'FLOAT_VEC3',
	  35666: 'FLOAT_VEC4',
	  35667: 'INT_VEC2',
	  35668: 'INT_VEC3',
	  35669: 'INT_VEC4',
	  35670: 'BOOL',
	  35671: 'BOOL_VEC2',
	  35672: 'BOOL_VEC3',
	  35673: 'BOOL_VEC4',
	  35674: 'FLOAT_MAT2',
	  35675: 'FLOAT_MAT3',
	  35676: 'FLOAT_MAT4',
	  35678: 'SAMPLER_2D',
	  35680: 'SAMPLER_CUBE',
	  35712: 'DELETE_STATUS',
	  35713: 'COMPILE_STATUS',
	  35714: 'LINK_STATUS',
	  35715: 'VALIDATE_STATUS',
	  35716: 'INFO_LOG_LENGTH',
	  35717: 'ATTACHED_SHADERS',
	  35718: 'ACTIVE_UNIFORMS',
	  35719: 'ACTIVE_UNIFORM_MAX_LENGTH',
	  35720: 'SHADER_SOURCE_LENGTH',
	  35721: 'ACTIVE_ATTRIBUTES',
	  35722: 'ACTIVE_ATTRIBUTE_MAX_LENGTH',
	  35724: 'SHADING_LANGUAGE_VERSION',
	  35725: 'CURRENT_PROGRAM',
	  36003: 'STENCIL_BACK_REF',
	  36004: 'STENCIL_BACK_VALUE_MASK',
	  36005: 'STENCIL_BACK_WRITEMASK',
	  36006: 'FRAMEBUFFER_BINDING',
	  36007: 'RENDERBUFFER_BINDING',
	  36048: 'FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE',
	  36049: 'FRAMEBUFFER_ATTACHMENT_OBJECT_NAME',
	  36050: 'FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL',
	  36051: 'FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE',
	  36053: 'FRAMEBUFFER_COMPLETE',
	  36054: 'FRAMEBUFFER_INCOMPLETE_ATTACHMENT',
	  36055: 'FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT',
	  36057: 'FRAMEBUFFER_INCOMPLETE_DIMENSIONS',
	  36061: 'FRAMEBUFFER_UNSUPPORTED',
	  36064: 'COLOR_ATTACHMENT0',
	  36096: 'DEPTH_ATTACHMENT',
	  36128: 'STENCIL_ATTACHMENT',
	  36160: 'FRAMEBUFFER',
	  36161: 'RENDERBUFFER',
	  36162: 'RENDERBUFFER_WIDTH',
	  36163: 'RENDERBUFFER_HEIGHT',
	  36164: 'RENDERBUFFER_INTERNAL_FORMAT',
	  36168: 'STENCIL_INDEX8',
	  36176: 'RENDERBUFFER_RED_SIZE',
	  36177: 'RENDERBUFFER_GREEN_SIZE',
	  36178: 'RENDERBUFFER_BLUE_SIZE',
	  36179: 'RENDERBUFFER_ALPHA_SIZE',
	  36180: 'RENDERBUFFER_DEPTH_SIZE',
	  36181: 'RENDERBUFFER_STENCIL_SIZE',
	  36194: 'RGB565',
	  36336: 'LOW_FLOAT',
	  36337: 'MEDIUM_FLOAT',
	  36338: 'HIGH_FLOAT',
	  36339: 'LOW_INT',
	  36340: 'MEDIUM_INT',
	  36341: 'HIGH_INT',
	  36346: 'SHADER_COMPILER',
	  36347: 'MAX_VERTEX_UNIFORM_VECTORS',
	  36348: 'MAX_VARYING_VECTORS',
	  36349: 'MAX_FRAGMENT_UNIFORM_VECTORS',
	  37440: 'UNPACK_FLIP_Y_WEBGL',
	  37441: 'UNPACK_PREMULTIPLY_ALPHA_WEBGL',
	  37442: 'CONTEXT_LOST_WEBGL',
	  37443: 'UNPACK_COLORSPACE_CONVERSION_WEBGL',
	  37444: 'BROWSER_DEFAULT_WEBGL'
	};

/***/ },
/* 18 */
/*!*************************************!*\
  !*** ./~/glsl-shader-name/index.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var tokenize = __webpack_require__(/*! glsl-tokenizer */ 19);
	var atob = __webpack_require__(/*! atob-lite */ 26);

	module.exports = getName;

	function getName(src) {
	  var tokens = Array.isArray(src) ? src : tokenize(src);

	  for (var i = 0; i < tokens.length; i++) {
	    var token = tokens[i];
	    if (token.type !== 'preprocessor') continue;
	    var match = token.data.match(/\#define\s+SHADER_NAME(_B64)?\s+(.+)$/);
	    if (!match) continue;
	    if (!match[2]) continue;

	    var b64 = match[1];
	    var name = match[2];

	    return (b64 ? atob(name) : name).trim();
	  }
	}

/***/ },
/* 19 */
/*!************************************!*\
  !*** ./~/glsl-tokenizer/string.js ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var tokenize = __webpack_require__(/*! ./index */ 20);

	module.exports = tokenizeString;

	function tokenizeString(str, opt) {
	  var generator = tokenize(opt);
	  var tokens = [];

	  tokens = tokens.concat(generator(str));
	  tokens = tokens.concat(generator(null));

	  return tokens;
	}

/***/ },
/* 20 */
/*!***********************************!*\
  !*** ./~/glsl-tokenizer/index.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = tokenize;

	var literals100 = __webpack_require__(/*! ./lib/literals */ 21),
	    operators = __webpack_require__(/*! ./lib/operators */ 22),
	    builtins100 = __webpack_require__(/*! ./lib/builtins */ 23),
	    literals300es = __webpack_require__(/*! ./lib/literals-300es */ 24),
	    builtins300es = __webpack_require__(/*! ./lib/builtins-300es */ 25);

	var NORMAL = 999 // <-- never emitted
	,
	    TOKEN = 9999 // <-- never emitted
	,
	    BLOCK_COMMENT = 0,
	    LINE_COMMENT = 1,
	    PREPROCESSOR = 2,
	    OPERATOR = 3,
	    INTEGER = 4,
	    FLOAT = 5,
	    IDENT = 6,
	    BUILTIN = 7,
	    KEYWORD = 8,
	    WHITESPACE = 9,
	    EOF = 10,
	    HEX = 11;

	var map = ['block-comment', 'line-comment', 'preprocessor', 'operator', 'integer', 'float', 'ident', 'builtin', 'keyword', 'whitespace', 'eof', 'integer'];

	function tokenize(opt) {
	  var i = 0,
	      total = 0,
	      mode = NORMAL,
	      c,
	      last,
	      content = [],
	      tokens = [],
	      token_idx = 0,
	      token_offs = 0,
	      line = 1,
	      col = 0,
	      start = 0,
	      isnum = false,
	      isoperator = false,
	      input = '',
	      len;

	  opt = opt || {};
	  var allBuiltins = builtins100;
	  var allLiterals = literals100;
	  if (opt.version === '300 es') {
	    allBuiltins = builtins300es;
	    allLiterals = literals300es;
	  }

	  return function (data) {
	    tokens = [];
	    if (data !== null) return write(data);
	    return end();
	  };

	  function token(data) {
	    if (data.length) {
	      tokens.push({
	        type: map[mode],
	        data: data,
	        position: start,
	        line: line,
	        column: col
	      });
	    }
	  }

	  function write(chunk) {
	    i = 0;
	    input += chunk;
	    len = input.length;

	    var last;

	    while (c = input[i], i < len) {
	      last = i;

	      switch (mode) {
	        case BLOCK_COMMENT:
	          i = block_comment();break;
	        case LINE_COMMENT:
	          i = line_comment();break;
	        case PREPROCESSOR:
	          i = preprocessor();break;
	        case OPERATOR:
	          i = operator();break;
	        case INTEGER:
	          i = integer();break;
	        case HEX:
	          i = hex();break;
	        case FLOAT:
	          i = decimal();break;
	        case TOKEN:
	          i = readtoken();break;
	        case WHITESPACE:
	          i = whitespace();break;
	        case NORMAL:
	          i = normal();break;
	      }

	      if (last !== i) {
	        switch (input[last]) {
	          case '\n':
	            col = 0;++line;break;
	          default:
	            ++col;break;
	        }
	      }
	    }

	    total += i;
	    input = input.slice(i);
	    return tokens;
	  }

	  function end(chunk) {
	    if (content.length) {
	      token(content.join(''));
	    }

	    mode = EOF;
	    token('(eof)');
	    return tokens;
	  }

	  function normal() {
	    content = content.length ? [] : content;

	    if (last === '/' && c === '*') {
	      start = total + i - 1;
	      mode = BLOCK_COMMENT;
	      last = c;
	      return i + 1;
	    }

	    if (last === '/' && c === '/') {
	      start = total + i - 1;
	      mode = LINE_COMMENT;
	      last = c;
	      return i + 1;
	    }

	    if (c === '#') {
	      mode = PREPROCESSOR;
	      start = total + i;
	      return i;
	    }

	    if (/\s/.test(c)) {
	      mode = WHITESPACE;
	      start = total + i;
	      return i;
	    }

	    isnum = /\d/.test(c);
	    isoperator = /[^\w_]/.test(c);

	    start = total + i;
	    mode = isnum ? INTEGER : isoperator ? OPERATOR : TOKEN;
	    return i;
	  }

	  function whitespace() {
	    if (/[^\s]/g.test(c)) {
	      token(content.join(''));
	      mode = NORMAL;
	      return i;
	    }
	    content.push(c);
	    last = c;
	    return i + 1;
	  }

	  function preprocessor() {
	    if (c === '\n' && last !== '\\') {
	      token(content.join(''));
	      mode = NORMAL;
	      return i;
	    }
	    content.push(c);
	    last = c;
	    return i + 1;
	  }

	  function line_comment() {
	    return preprocessor();
	  }

	  function block_comment() {
	    if (c === '/' && last === '*') {
	      content.push(c);
	      token(content.join(''));
	      mode = NORMAL;
	      return i + 1;
	    }

	    content.push(c);
	    last = c;
	    return i + 1;
	  }

	  function operator() {
	    if (last === '.' && /\d/.test(c)) {
	      mode = FLOAT;
	      return i;
	    }

	    if (last === '/' && c === '*') {
	      mode = BLOCK_COMMENT;
	      return i;
	    }

	    if (last === '/' && c === '/') {
	      mode = LINE_COMMENT;
	      return i;
	    }

	    if (c === '.' && content.length) {
	      while (determine_operator(content)) {}

	      mode = FLOAT;
	      return i;
	    }

	    if (c === ';' || c === ')' || c === '(') {
	      if (content.length) while (determine_operator(content)) {}
	      token(c);
	      mode = NORMAL;
	      return i + 1;
	    }

	    var is_composite_operator = content.length === 2 && c !== '=';
	    if (/[\w_\d\s]/.test(c) || is_composite_operator) {
	      while (determine_operator(content)) {}
	      mode = NORMAL;
	      return i;
	    }

	    content.push(c);
	    last = c;
	    return i + 1;
	  }

	  function determine_operator(buf) {
	    var j = 0,
	        idx,
	        res;

	    do {
	      idx = operators.indexOf(buf.slice(0, buf.length + j).join(''));
	      res = operators[idx];

	      if (idx === -1) {
	        if (j-- + buf.length > 0) continue;
	        res = buf.slice(0, 1).join('');
	      }

	      token(res);

	      start += res.length;
	      content = content.slice(res.length);
	      return content.length;
	    } while (1);
	  }

	  function hex() {
	    if (/[^a-fA-F0-9]/.test(c)) {
	      token(content.join(''));
	      mode = NORMAL;
	      return i;
	    }

	    content.push(c);
	    last = c;
	    return i + 1;
	  }

	  function integer() {
	    if (c === '.') {
	      content.push(c);
	      mode = FLOAT;
	      last = c;
	      return i + 1;
	    }

	    if (/[eE]/.test(c)) {
	      content.push(c);
	      mode = FLOAT;
	      last = c;
	      return i + 1;
	    }

	    if (c === 'x' && content.length === 1 && content[0] === '0') {
	      mode = HEX;
	      content.push(c);
	      last = c;
	      return i + 1;
	    }

	    if (/[^\d]/.test(c)) {
	      token(content.join(''));
	      mode = NORMAL;
	      return i;
	    }

	    content.push(c);
	    last = c;
	    return i + 1;
	  }

	  function decimal() {
	    if (c === 'f') {
	      content.push(c);
	      last = c;
	      i += 1;
	    }

	    if (/[eE]/.test(c)) {
	      content.push(c);
	      last = c;
	      return i + 1;
	    }

	    if (c === '-' && /[eE]/.test(last)) {
	      content.push(c);
	      last = c;
	      return i + 1;
	    }

	    if (/[^\d]/.test(c)) {
	      token(content.join(''));
	      mode = NORMAL;
	      return i;
	    }

	    content.push(c);
	    last = c;
	    return i + 1;
	  }

	  function readtoken() {
	    if (/[^\d\w_]/.test(c)) {
	      var contentstr = content.join('');
	      if (allLiterals.indexOf(contentstr) > -1) {
	        mode = KEYWORD;
	      } else if (allBuiltins.indexOf(contentstr) > -1) {
	        mode = BUILTIN;
	      } else {
	        mode = IDENT;
	      }
	      token(content.join(''));
	      mode = NORMAL;
	      return i;
	    }
	    content.push(c);
	    last = c;
	    return i + 1;
	  }
	}

/***/ },
/* 21 */
/*!******************************************!*\
  !*** ./~/glsl-tokenizer/lib/literals.js ***!
  \******************************************/
/***/ function(module, exports) {

	'use strict';

	module.exports = [
	// current
	'precision', 'highp', 'mediump', 'lowp', 'attribute', 'const', 'uniform', 'varying', 'break', 'continue', 'do', 'for', 'while', 'if', 'else', 'in', 'out', 'inout', 'float', 'int', 'void', 'bool', 'true', 'false', 'discard', 'return', 'mat2', 'mat3', 'mat4', 'vec2', 'vec3', 'vec4', 'ivec2', 'ivec3', 'ivec4', 'bvec2', 'bvec3', 'bvec4', 'sampler1D', 'sampler2D', 'sampler3D', 'samplerCube', 'sampler1DShadow', 'sampler2DShadow', 'struct'

	// future
	, 'asm', 'class', 'union', 'enum', 'typedef', 'template', 'this', 'packed', 'goto', 'switch', 'default', 'inline', 'noinline', 'volatile', 'public', 'static', 'extern', 'external', 'interface', 'long', 'short', 'double', 'half', 'fixed', 'unsigned', 'input', 'output', 'hvec2', 'hvec3', 'hvec4', 'dvec2', 'dvec3', 'dvec4', 'fvec2', 'fvec3', 'fvec4', 'sampler2DRect', 'sampler3DRect', 'sampler2DRectShadow', 'sizeof', 'cast', 'namespace', 'using'];

/***/ },
/* 22 */
/*!*******************************************!*\
  !*** ./~/glsl-tokenizer/lib/operators.js ***!
  \*******************************************/
/***/ function(module, exports) {

	'use strict';

	module.exports = ['<<=', '>>=', '++', '--', '<<', '>>', '<=', '>=', '==', '!=', '&&', '||', '+=', '-=', '*=', '/=', '%=', '&=', '^^', '^=', '|=', '(', ')', '[', ']', '.', '!', '~', '*', '/', '%', '+', '-', '<', '>', '&', '^', '|', '?', ':', '=', ',', ';', '{', '}'];

/***/ },
/* 23 */
/*!******************************************!*\
  !*** ./~/glsl-tokenizer/lib/builtins.js ***!
  \******************************************/
/***/ function(module, exports) {

	'use strict';

	module.exports = [
	// Keep this list sorted
	'abs', 'acos', 'all', 'any', 'asin', 'atan', 'ceil', 'clamp', 'cos', 'cross', 'dFdx', 'dFdy', 'degrees', 'distance', 'dot', 'equal', 'exp', 'exp2', 'faceforward', 'floor', 'fract', 'gl_BackColor', 'gl_BackLightModelProduct', 'gl_BackLightProduct', 'gl_BackMaterial', 'gl_BackSecondaryColor', 'gl_ClipPlane', 'gl_ClipVertex', 'gl_Color', 'gl_DepthRange', 'gl_DepthRangeParameters', 'gl_EyePlaneQ', 'gl_EyePlaneR', 'gl_EyePlaneS', 'gl_EyePlaneT', 'gl_Fog', 'gl_FogCoord', 'gl_FogFragCoord', 'gl_FogParameters', 'gl_FragColor', 'gl_FragCoord', 'gl_FragData', 'gl_FragDepth', 'gl_FragDepthEXT', 'gl_FrontColor', 'gl_FrontFacing', 'gl_FrontLightModelProduct', 'gl_FrontLightProduct', 'gl_FrontMaterial', 'gl_FrontSecondaryColor', 'gl_LightModel', 'gl_LightModelParameters', 'gl_LightModelProducts', 'gl_LightProducts', 'gl_LightSource', 'gl_LightSourceParameters', 'gl_MaterialParameters', 'gl_MaxClipPlanes', 'gl_MaxCombinedTextureImageUnits', 'gl_MaxDrawBuffers', 'gl_MaxFragmentUniformComponents', 'gl_MaxLights', 'gl_MaxTextureCoords', 'gl_MaxTextureImageUnits', 'gl_MaxTextureUnits', 'gl_MaxVaryingFloats', 'gl_MaxVertexAttribs', 'gl_MaxVertexTextureImageUnits', 'gl_MaxVertexUniformComponents', 'gl_ModelViewMatrix', 'gl_ModelViewMatrixInverse', 'gl_ModelViewMatrixInverseTranspose', 'gl_ModelViewMatrixTranspose', 'gl_ModelViewProjectionMatrix', 'gl_ModelViewProjectionMatrixInverse', 'gl_ModelViewProjectionMatrixInverseTranspose', 'gl_ModelViewProjectionMatrixTranspose', 'gl_MultiTexCoord0', 'gl_MultiTexCoord1', 'gl_MultiTexCoord2', 'gl_MultiTexCoord3', 'gl_MultiTexCoord4', 'gl_MultiTexCoord5', 'gl_MultiTexCoord6', 'gl_MultiTexCoord7', 'gl_Normal', 'gl_NormalMatrix', 'gl_NormalScale', 'gl_ObjectPlaneQ', 'gl_ObjectPlaneR', 'gl_ObjectPlaneS', 'gl_ObjectPlaneT', 'gl_Point', 'gl_PointCoord', 'gl_PointParameters', 'gl_PointSize', 'gl_Position', 'gl_ProjectionMatrix', 'gl_ProjectionMatrixInverse', 'gl_ProjectionMatrixInverseTranspose', 'gl_ProjectionMatrixTranspose', 'gl_SecondaryColor', 'gl_TexCoord', 'gl_TextureEnvColor', 'gl_TextureMatrix', 'gl_TextureMatrixInverse', 'gl_TextureMatrixInverseTranspose', 'gl_TextureMatrixTranspose', 'gl_Vertex', 'greaterThan', 'greaterThanEqual', 'inversesqrt', 'length', 'lessThan', 'lessThanEqual', 'log', 'log2', 'matrixCompMult', 'max', 'min', 'mix', 'mod', 'normalize', 'not', 'notEqual', 'pow', 'radians', 'reflect', 'refract', 'sign', 'sin', 'smoothstep', 'sqrt', 'step', 'tan', 'texture2D', 'texture2DLod', 'texture2DProj', 'texture2DProjLod', 'textureCube', 'textureCubeLod', 'texture2DLodEXT', 'texture2DProjLodEXT', 'textureCubeLodEXT', 'texture2DGradEXT', 'texture2DProjGradEXT', 'textureCubeGradEXT'];

/***/ },
/* 24 */
/*!************************************************!*\
  !*** ./~/glsl-tokenizer/lib/literals-300es.js ***!
  \************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var v100 = __webpack_require__(/*! ./literals */ 21);

	module.exports = v100.slice().concat(['layout', 'centroid', 'smooth', 'case', 'mat2x2', 'mat2x3', 'mat2x4', 'mat3x2', 'mat3x3', 'mat3x4', 'mat4x2', 'mat4x3', 'mat4x4', 'uint', 'uvec2', 'uvec3', 'uvec4', 'samplerCubeShadow', 'sampler2DArray', 'sampler2DArrayShadow', 'isampler2D', 'isampler3D', 'isamplerCube', 'isampler2DArray', 'usampler2D', 'usampler3D', 'usamplerCube', 'usampler2DArray', 'coherent', 'restrict', 'readonly', 'writeonly', 'resource', 'atomic_uint', 'noperspective', 'patch', 'sample', 'subroutine', 'common', 'partition', 'active', 'filter', 'image1D', 'image2D', 'image3D', 'imageCube', 'iimage1D', 'iimage2D', 'iimage3D', 'iimageCube', 'uimage1D', 'uimage2D', 'uimage3D', 'uimageCube', 'image1DArray', 'image2DArray', 'iimage1DArray', 'iimage2DArray', 'uimage1DArray', 'uimage2DArray', 'image1DShadow', 'image2DShadow', 'image1DArrayShadow', 'image2DArrayShadow', 'imageBuffer', 'iimageBuffer', 'uimageBuffer', 'sampler1DArray', 'sampler1DArrayShadow', 'isampler1D', 'isampler1DArray', 'usampler1D', 'usampler1DArray', 'isampler2DRect', 'usampler2DRect', 'samplerBuffer', 'isamplerBuffer', 'usamplerBuffer', 'sampler2DMS', 'isampler2DMS', 'usampler2DMS', 'sampler2DMSArray', 'isampler2DMSArray', 'usampler2DMSArray']);

/***/ },
/* 25 */
/*!************************************************!*\
  !*** ./~/glsl-tokenizer/lib/builtins-300es.js ***!
  \************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// 300es builtins/reserved words that were previously valid in v100
	var v100 = __webpack_require__(/*! ./builtins */ 23);

	// The texture2D|Cube functions have been removed
	// And the gl_ features are updated
	v100 = v100.slice().filter(function (b) {
	  return !/^(gl\_|texture)/.test(b);
	});

	module.exports = v100.concat([
	// the updated gl_ constants
	'gl_VertexID', 'gl_InstanceID', 'gl_Position', 'gl_PointSize', 'gl_FragCoord', 'gl_FrontFacing', 'gl_FragDepth', 'gl_PointCoord', 'gl_MaxVertexAttribs', 'gl_MaxVertexUniformVectors', 'gl_MaxVertexOutputVectors', 'gl_MaxFragmentInputVectors', 'gl_MaxVertexTextureImageUnits', 'gl_MaxCombinedTextureImageUnits', 'gl_MaxTextureImageUnits', 'gl_MaxFragmentUniformVectors', 'gl_MaxDrawBuffers', 'gl_MinProgramTexelOffset', 'gl_MaxProgramTexelOffset', 'gl_DepthRangeParameters', 'gl_DepthRange'

	// other builtins
	, 'trunc', 'round', 'roundEven', 'isnan', 'isinf', 'floatBitsToInt', 'floatBitsToUint', 'intBitsToFloat', 'uintBitsToFloat', 'packSnorm2x16', 'unpackSnorm2x16', 'packUnorm2x16', 'unpackUnorm2x16', 'packHalf2x16', 'unpackHalf2x16', 'outerProduct', 'transpose', 'determinant', 'inverse', 'texture', 'textureSize', 'textureProj', 'textureLod', 'textureOffset', 'texelFetch', 'texelFetchOffset', 'textureProjOffset', 'textureLodOffset', 'textureProjLod', 'textureProjLodOffset', 'textureGrad', 'textureGradOffset', 'textureProjGrad', 'textureProjGradOffset']);

/***/ },
/* 26 */
/*!*************************************!*\
  !*** ./~/atob-lite/atob-browser.js ***!
  \*************************************/
/***/ function(module, exports) {

	"use strict";

	module.exports = function _atob(str) {
	  return atob(str);
	};

/***/ },
/* 27 */
/*!*************************************!*\
  !*** ./~/add-line-numbers/index.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var padLeft = __webpack_require__(/*! pad-left */ 28);

	module.exports = addLineNumbers;
	function addLineNumbers(string, start, delim) {
	  start = typeof start === 'number' ? start : 1;
	  delim = delim || ': ';

	  var lines = string.split(/\r?\n/);
	  var totalDigits = String(lines.length + start - 1).length;
	  return lines.map(function (line, i) {
	    var c = i + start;
	    var digits = String(c).length;
	    var prefix = padLeft(c, totalDigits - digits);
	    return prefix + delim + line;
	  }).join('\n');
	}

/***/ },
/* 28 */
/*!*****************************!*\
  !*** ./~/pad-left/index.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * pad-left <https://github.com/jonschlinkert/pad-left>
	 *
	 * Copyright (c) 2014-2015, Jon Schlinkert.
	 * Licensed under the MIT license.
	 */

	'use strict';

	var repeat = __webpack_require__(/*! repeat-string */ 29);

	module.exports = function padLeft(str, num, ch) {
	  ch = typeof ch !== 'undefined' ? ch + '' : ' ';
	  return repeat(ch, num) + str;
	};

/***/ },
/* 29 */
/*!**********************************!*\
  !*** ./~/repeat-string/index.js ***!
  \**********************************/
/***/ function(module, exports) {

	/*!
	 * repeat-string <https://github.com/jonschlinkert/repeat-string>
	 *
	 * Copyright (c) 2014-2015, Jon Schlinkert.
	 * Licensed under the MIT License.
	 */

	'use strict';

	/**
	 * Results cache
	 */

	var res = '';
	var cache;

	/**
	 * Expose `repeat`
	 */

	module.exports = repeat;

	/**
	 * Repeat the given `string` the specified `number`
	 * of times.
	 *
	 * **Example:**
	 *
	 * ```js
	 * var repeat = require('repeat-string');
	 * repeat('A', 5);
	 * //=> AAAAA
	 * ```
	 *
	 * @param {String} `string` The string to repeat
	 * @param {Number} `number` The number of times to repeat the string
	 * @return {String} Repeated string
	 * @api public
	 */

	function repeat(str, num) {
	  if (typeof str !== 'string') {
	    throw new TypeError('repeat-string expects a string.');
	  }

	  // cover common, quick use cases
	  if (num === 1) return str;
	  if (num === 2) return str + str;

	  var max = str.length * num;
	  if (cache !== str || typeof cache === 'undefined') {
	    cache = str;
	    res = '';
	  }

	  while (max > res.length && num > 0) {
	    if (num & 1) {
	      res += str;
	    }

	    num >>= 1;
	    if (!num) break;
	    str += str;
	  }

	  return res.substr(0, max);
	}

/***/ },
/* 30 */
/*!*********************************!*\
  !*** ./~/weakmap-shim/index.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// Original - @Gozola.
	// https://gist.github.com/Gozala/1269991
	// This is a reimplemented version (with a few bug fixes).

	var createStore = __webpack_require__(/*! ./create-store.js */ 31);

	module.exports = weakMap;

	function weakMap() {
	    var privates = createStore();

	    return {
	        'get': function get(key, fallback) {
	            var store = privates(key);
	            return store.hasOwnProperty('value') ? store.value : fallback;
	        },
	        'set': function set(key, value) {
	            privates(key).value = value;
	        },
	        'has': function has(key) {
	            return 'value' in privates(key);
	        },
	        'delete': function _delete(key) {
	            return delete privates(key).value;
	        }
	    };
	}

/***/ },
/* 31 */
/*!****************************************!*\
  !*** ./~/weakmap-shim/create-store.js ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var hiddenStore = __webpack_require__(/*! ./hidden-store.js */ 32);

	module.exports = createStore;

	function createStore() {
	    var key = {};

	    return function (obj) {
	        if (((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' || obj === null) && typeof obj !== 'function') {
	            throw new Error('Weakmap-shim: Key must be object');
	        }

	        var store = obj.valueOf(key);
	        return store && store.identity === key ? store : hiddenStore(obj, key);
	    };
	}

/***/ },
/* 32 */
/*!****************************************!*\
  !*** ./~/weakmap-shim/hidden-store.js ***!
  \****************************************/
/***/ function(module, exports) {

	"use strict";

	module.exports = hiddenStore;

	function hiddenStore(obj, key) {
	    var store = { identity: key };
	    var valueOf = obj.valueOf;

	    Object.defineProperty(obj, "valueOf", {
	        value: function value(_value) {
	            return _value !== key ? valueOf.apply(this, arguments) : store;
	        },
	        writable: true
	    });

	    return store;
	}

/***/ },
/* 33 */
/*!********************************************!*\
  !*** ./~/gl-shader/lib/runtime-reflect.js ***!
  \********************************************/
/***/ function(module, exports) {

	'use strict';

	exports.uniforms = runtimeUniforms;
	exports.attributes = runtimeAttributes;

	var GL_TO_GLSL_TYPES = {
	  'FLOAT': 'float',
	  'FLOAT_VEC2': 'vec2',
	  'FLOAT_VEC3': 'vec3',
	  'FLOAT_VEC4': 'vec4',
	  'INT': 'int',
	  'INT_VEC2': 'ivec2',
	  'INT_VEC3': 'ivec3',
	  'INT_VEC4': 'ivec4',
	  'BOOL': 'bool',
	  'BOOL_VEC2': 'bvec2',
	  'BOOL_VEC3': 'bvec3',
	  'BOOL_VEC4': 'bvec4',
	  'FLOAT_MAT2': 'mat2',
	  'FLOAT_MAT3': 'mat3',
	  'FLOAT_MAT4': 'mat4',
	  'SAMPLER_2D': 'sampler2D',
	  'SAMPLER_CUBE': 'samplerCube'
	};

	var GL_TABLE = null;

	function getType(gl, type) {
	  if (!GL_TABLE) {
	    var typeNames = Object.keys(GL_TO_GLSL_TYPES);
	    GL_TABLE = {};
	    for (var i = 0; i < typeNames.length; ++i) {
	      var tn = typeNames[i];
	      GL_TABLE[gl[tn]] = GL_TO_GLSL_TYPES[tn];
	    }
	  }
	  return GL_TABLE[type];
	}

	function runtimeUniforms(gl, program) {
	  var numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
	  var result = [];
	  for (var i = 0; i < numUniforms; ++i) {
	    var info = gl.getActiveUniform(program, i);
	    if (info) {
	      var type = getType(gl, info.type);
	      if (info.size > 1) {
	        for (var j = 0; j < info.size; ++j) {
	          result.push({
	            name: info.name.replace('[0]', '[' + j + ']'),
	            type: type
	          });
	        }
	      } else {
	        result.push({
	          name: info.name,
	          type: type
	        });
	      }
	    }
	  }
	  return result;
	}

	function runtimeAttributes(gl, program) {
	  var numAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
	  var result = [];
	  for (var i = 0; i < numAttributes; ++i) {
	    var info = gl.getActiveAttrib(program, i);
	    if (info) {
	      result.push({
	        name: info.name,
	        type: getType(gl, info.type)
	      });
	    }
	  }
	  return result;
	}

/***/ },
/* 34 */
/*!*******************************!*\
  !*** ./~/gl-buffer/buffer.js ***!
  \*******************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var pool = __webpack_require__(/*! typedarray-pool */ 35);
	var ops = __webpack_require__(/*! ndarray-ops */ 42);
	var ndarray = __webpack_require__(/*! ndarray */ 47);

	var SUPPORTED_TYPES = ["uint8", "uint8_clamped", "uint16", "uint32", "int8", "int16", "int32", "float32"];

	function GLBuffer(gl, type, handle, length, usage) {
	  this.gl = gl;
	  this.type = type;
	  this.handle = handle;
	  this.length = length;
	  this.usage = usage;
	}

	var proto = GLBuffer.prototype;

	proto.bind = function () {
	  this.gl.bindBuffer(this.type, this.handle);
	};

	proto.unbind = function () {
	  this.gl.bindBuffer(this.type, null);
	};

	proto.dispose = function () {
	  this.gl.deleteBuffer(this.handle);
	};

	function updateTypeArray(gl, type, len, usage, data, offset) {
	  var dataLen = data.length * data.BYTES_PER_ELEMENT;
	  if (offset < 0) {
	    gl.bufferData(type, data, usage);
	    return dataLen;
	  }
	  if (dataLen + offset > len) {
	    throw new Error("gl-buffer: If resizing buffer, must not specify offset");
	  }
	  gl.bufferSubData(type, offset, data);
	  return len;
	}

	function makeScratchTypeArray(array, dtype) {
	  var res = pool.malloc(array.length, dtype);
	  var n = array.length;
	  for (var i = 0; i < n; ++i) {
	    res[i] = array[i];
	  }
	  return res;
	}

	function isPacked(shape, stride) {
	  var n = 1;
	  for (var i = stride.length - 1; i >= 0; --i) {
	    if (stride[i] !== n) {
	      return false;
	    }
	    n *= shape[i];
	  }
	  return true;
	}

	proto.update = function (array, offset) {
	  if (typeof offset !== "number") {
	    offset = -1;
	  }
	  this.bind();
	  if ((typeof array === "undefined" ? "undefined" : _typeof(array)) === "object" && typeof array.shape !== "undefined") {
	    //ndarray
	    var dtype = array.dtype;
	    if (SUPPORTED_TYPES.indexOf(dtype) < 0) {
	      dtype = "float32";
	    }
	    if (this.type === this.gl.ELEMENT_ARRAY_BUFFER) {
	      var ext = gl.getExtension('OES_element_index_uint');
	      if (ext && dtype !== "uint16") {
	        dtype = "uint32";
	      } else {
	        dtype = "uint16";
	      }
	    }
	    if (dtype === array.dtype && isPacked(array.shape, array.stride)) {
	      if (array.offset === 0 && array.data.length === array.shape[0]) {
	        this.length = updateTypeArray(this.gl, this.type, this.length, this.usage, array.data, offset);
	      } else {
	        this.length = updateTypeArray(this.gl, this.type, this.length, this.usage, array.data.subarray(array.offset, array.shape[0]), offset);
	      }
	    } else {
	      var tmp = pool.malloc(array.size, dtype);
	      var ndt = ndarray(tmp, array.shape);
	      ops.assign(ndt, array);
	      if (offset < 0) {
	        this.length = updateTypeArray(this.gl, this.type, this.length, this.usage, tmp, offset);
	      } else {
	        this.length = updateTypeArray(this.gl, this.type, this.length, this.usage, tmp.subarray(0, array.size), offset);
	      }
	      pool.free(tmp);
	    }
	  } else if (Array.isArray(array)) {
	    //Vanilla array
	    var t;
	    if (this.type === this.gl.ELEMENT_ARRAY_BUFFER) {
	      t = makeScratchTypeArray(array, "uint16");
	    } else {
	      t = makeScratchTypeArray(array, "float32");
	    }
	    if (offset < 0) {
	      this.length = updateTypeArray(this.gl, this.type, this.length, this.usage, t, offset);
	    } else {
	      this.length = updateTypeArray(this.gl, this.type, this.length, this.usage, t.subarray(0, array.length), offset);
	    }
	    pool.free(t);
	  } else if ((typeof array === "undefined" ? "undefined" : _typeof(array)) === "object" && typeof array.length === "number") {
	    //Typed array
	    this.length = updateTypeArray(this.gl, this.type, this.length, this.usage, array, offset);
	  } else if (typeof array === "number" || array === undefined) {
	    //Number/default
	    if (offset >= 0) {
	      throw new Error("gl-buffer: Cannot specify offset when resizing buffer");
	    }
	    array = array | 0;
	    if (array <= 0) {
	      array = 1;
	    }
	    this.gl.bufferData(this.type, array | 0, this.usage);
	    this.length = array;
	  } else {
	    //Error, case should not happen
	    throw new Error("gl-buffer: Invalid data type");
	  }
	};

	function createBuffer(gl, data, type, usage) {
	  type = type || gl.ARRAY_BUFFER;
	  usage = usage || gl.DYNAMIC_DRAW;
	  if (type !== gl.ARRAY_BUFFER && type !== gl.ELEMENT_ARRAY_BUFFER) {
	    throw new Error("gl-buffer: Invalid type for webgl buffer, must be either gl.ARRAY_BUFFER or gl.ELEMENT_ARRAY_BUFFER");
	  }
	  if (usage !== gl.DYNAMIC_DRAW && usage !== gl.STATIC_DRAW && usage !== gl.STREAM_DRAW) {
	    throw new Error("gl-buffer: Invalid usage for buffer, must be either gl.DYNAMIC_DRAW, gl.STATIC_DRAW or gl.STREAM_DRAW");
	  }
	  var handle = gl.createBuffer();
	  var result = new GLBuffer(gl, type, handle, 0, usage);
	  result.update(data);
	  return result;
	}

	module.exports = createBuffer;

/***/ },
/* 35 */
/*!***********************************!*\
  !*** ./~/typedarray-pool/pool.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, Buffer) {'use strict';

	var bits = __webpack_require__(/*! bit-twiddle */ 40);
	var dup = __webpack_require__(/*! dup */ 41);

	//Legacy pool support
	if (!global.__TYPEDARRAY_POOL) {
	  global.__TYPEDARRAY_POOL = {
	    UINT8: dup([32, 0]),
	    UINT16: dup([32, 0]),
	    UINT32: dup([32, 0]),
	    INT8: dup([32, 0]),
	    INT16: dup([32, 0]),
	    INT32: dup([32, 0]),
	    FLOAT: dup([32, 0]),
	    DOUBLE: dup([32, 0]),
	    DATA: dup([32, 0]),
	    UINT8C: dup([32, 0]),
	    BUFFER: dup([32, 0])
	  };
	}

	var hasUint8C = typeof Uint8ClampedArray !== 'undefined';
	var POOL = global.__TYPEDARRAY_POOL;

	//Upgrade pool
	if (!POOL.UINT8C) {
	  POOL.UINT8C = dup([32, 0]);
	}
	if (!POOL.BUFFER) {
	  POOL.BUFFER = dup([32, 0]);
	}

	//New technique: Only allocate from ArrayBufferView and Buffer
	var DATA = POOL.DATA,
	    BUFFER = POOL.BUFFER;

	exports.free = function free(array) {
	  if (Buffer.isBuffer(array)) {
	    BUFFER[bits.log2(array.length)].push(array);
	  } else {
	    if (Object.prototype.toString.call(array) !== '[object ArrayBuffer]') {
	      array = array.buffer;
	    }
	    if (!array) {
	      return;
	    }
	    var n = array.length || array.byteLength;
	    var log_n = bits.log2(n) | 0;
	    DATA[log_n].push(array);
	  }
	};

	function freeArrayBuffer(buffer) {
	  if (!buffer) {
	    return;
	  }
	  var n = buffer.length || buffer.byteLength;
	  var log_n = bits.log2(n);
	  DATA[log_n].push(buffer);
	}

	function freeTypedArray(array) {
	  freeArrayBuffer(array.buffer);
	}

	exports.freeUint8 = exports.freeUint16 = exports.freeUint32 = exports.freeInt8 = exports.freeInt16 = exports.freeInt32 = exports.freeFloat32 = exports.freeFloat = exports.freeFloat64 = exports.freeDouble = exports.freeUint8Clamped = exports.freeDataView = freeTypedArray;

	exports.freeArrayBuffer = freeArrayBuffer;

	exports.freeBuffer = function freeBuffer(array) {
	  BUFFER[bits.log2(array.length)].push(array);
	};

	exports.malloc = function malloc(n, dtype) {
	  if (dtype === undefined || dtype === 'arraybuffer') {
	    return mallocArrayBuffer(n);
	  } else {
	    switch (dtype) {
	      case 'uint8':
	        return mallocUint8(n);
	      case 'uint16':
	        return mallocUint16(n);
	      case 'uint32':
	        return mallocUint32(n);
	      case 'int8':
	        return mallocInt8(n);
	      case 'int16':
	        return mallocInt16(n);
	      case 'int32':
	        return mallocInt32(n);
	      case 'float':
	      case 'float32':
	        return mallocFloat(n);
	      case 'double':
	      case 'float64':
	        return mallocDouble(n);
	      case 'uint8_clamped':
	        return mallocUint8Clamped(n);
	      case 'buffer':
	        return mallocBuffer(n);
	      case 'data':
	      case 'dataview':
	        return mallocDataView(n);

	      default:
	        return null;
	    }
	  }
	  return null;
	};

	function mallocArrayBuffer(n) {
	  var n = bits.nextPow2(n);
	  var log_n = bits.log2(n);
	  var d = DATA[log_n];
	  if (d.length > 0) {
	    return d.pop();
	  }
	  return new ArrayBuffer(n);
	}
	exports.mallocArrayBuffer = mallocArrayBuffer;

	function mallocUint8(n) {
	  return new Uint8Array(mallocArrayBuffer(n), 0, n);
	}
	exports.mallocUint8 = mallocUint8;

	function mallocUint16(n) {
	  return new Uint16Array(mallocArrayBuffer(2 * n), 0, n);
	}
	exports.mallocUint16 = mallocUint16;

	function mallocUint32(n) {
	  return new Uint32Array(mallocArrayBuffer(4 * n), 0, n);
	}
	exports.mallocUint32 = mallocUint32;

	function mallocInt8(n) {
	  return new Int8Array(mallocArrayBuffer(n), 0, n);
	}
	exports.mallocInt8 = mallocInt8;

	function mallocInt16(n) {
	  return new Int16Array(mallocArrayBuffer(2 * n), 0, n);
	}
	exports.mallocInt16 = mallocInt16;

	function mallocInt32(n) {
	  return new Int32Array(mallocArrayBuffer(4 * n), 0, n);
	}
	exports.mallocInt32 = mallocInt32;

	function mallocFloat(n) {
	  return new Float32Array(mallocArrayBuffer(4 * n), 0, n);
	}
	exports.mallocFloat32 = exports.mallocFloat = mallocFloat;

	function mallocDouble(n) {
	  return new Float64Array(mallocArrayBuffer(8 * n), 0, n);
	}
	exports.mallocFloat64 = exports.mallocDouble = mallocDouble;

	function mallocUint8Clamped(n) {
	  if (hasUint8C) {
	    return new Uint8ClampedArray(mallocArrayBuffer(n), 0, n);
	  } else {
	    return mallocUint8(n);
	  }
	}
	exports.mallocUint8Clamped = mallocUint8Clamped;

	function mallocDataView(n) {
	  return new DataView(mallocArrayBuffer(n), 0, n);
	}
	exports.mallocDataView = mallocDataView;

	function mallocBuffer(n) {
	  n = bits.nextPow2(n);
	  var log_n = bits.log2(n);
	  var cache = BUFFER[log_n];
	  if (cache.length > 0) {
	    return cache.pop();
	  }
	  return new Buffer(n);
	}
	exports.mallocBuffer = mallocBuffer;

	exports.clearCache = function clearCache() {
	  for (var i = 0; i < 32; ++i) {
	    POOL.UINT8[i].length = 0;
	    POOL.UINT16[i].length = 0;
	    POOL.UINT32[i].length = 0;
	    POOL.INT8[i].length = 0;
	    POOL.INT16[i].length = 0;
	    POOL.INT32[i].length = 0;
	    POOL.FLOAT[i].length = 0;
	    POOL.DOUBLE[i].length = 0;
	    POOL.UINT8C[i].length = 0;
	    DATA[i].length = 0;
	    BUFFER[i].length = 0;
	  }
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(/*! ./~/buffer/index.js */ 36).Buffer))

/***/ },
/* 36 */
/*!***************************!*\
  !*** ./~/buffer/index.js ***!
  \***************************/
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer, global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */

	'use strict';

	var base64 = __webpack_require__(/*! base64-js */ 37);
	var ieee754 = __webpack_require__(/*! ieee754 */ 38);
	var isArray = __webpack_require__(/*! isarray */ 39);

	exports.Buffer = Buffer;
	exports.SlowBuffer = SlowBuffer;
	exports.INSPECT_MAX_BYTES = 50;
	Buffer.poolSize = 8192; // not used by this implementation

	var rootParent = {};

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
	 *     on objects.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.

	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined ? global.TYPED_ARRAY_SUPPORT : typedArraySupport();

	function typedArraySupport() {
	  function Bar() {}
	  try {
	    var arr = new Uint8Array(1);
	    arr.foo = function () {
	      return 42;
	    };
	    arr.constructor = Bar;
	    return arr.foo() === 42 && // typed array instances can be augmented
	    arr.constructor === Bar && // constructor can be set
	    typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	    arr.subarray(1, 1).byteLength === 0; // ie10 has broken `subarray`
	  } catch (e) {
	    return false;
	  }
	}

	function kMaxLength() {
	  return Buffer.TYPED_ARRAY_SUPPORT ? 0x7fffffff : 0x3fffffff;
	}

	/**
	 * Class: Buffer
	 * =============
	 *
	 * The Buffer constructor returns instances of `Uint8Array` that are augmented
	 * with function properties for all the node `Buffer` API functions. We use
	 * `Uint8Array` so that square bracket notation works as expected -- it returns
	 * a single octet.
	 *
	 * By augmenting the instances, we can avoid modifying the `Uint8Array`
	 * prototype.
	 */
	function Buffer(arg) {
	  if (!(this instanceof Buffer)) {
	    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
	    if (arguments.length > 1) return new Buffer(arg, arguments[1]);
	    return new Buffer(arg);
	  }

	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    this.length = 0;
	    this.parent = undefined;
	  }

	  // Common case.
	  if (typeof arg === 'number') {
	    return fromNumber(this, arg);
	  }

	  // Slightly less common case.
	  if (typeof arg === 'string') {
	    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8');
	  }

	  // Unusual.
	  return fromObject(this, arg);
	}

	function fromNumber(that, length) {
	  that = allocate(that, length < 0 ? 0 : checked(length) | 0);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < length; i++) {
	      that[i] = 0;
	    }
	  }
	  return that;
	}

	function fromString(that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8';

	  // Assumption: byteLength() return value is always < kMaxLength.
	  var length = byteLength(string, encoding) | 0;
	  that = allocate(that, length);

	  that.write(string, encoding);
	  return that;
	}

	function fromObject(that, object) {
	  if (Buffer.isBuffer(object)) return fromBuffer(that, object);

	  if (isArray(object)) return fromArray(that, object);

	  if (object == null) {
	    throw new TypeError('must start with number, buffer, array or string');
	  }

	  if (typeof ArrayBuffer !== 'undefined') {
	    if (object.buffer instanceof ArrayBuffer) {
	      return fromTypedArray(that, object);
	    }
	    if (object instanceof ArrayBuffer) {
	      return fromArrayBuffer(that, object);
	    }
	  }

	  if (object.length) return fromArrayLike(that, object);

	  return fromJsonObject(that, object);
	}

	function fromBuffer(that, buffer) {
	  var length = checked(buffer.length) | 0;
	  that = allocate(that, length);
	  buffer.copy(that, 0, 0, length);
	  return that;
	}

	function fromArray(that, array) {
	  var length = checked(array.length) | 0;
	  that = allocate(that, length);
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255;
	  }
	  return that;
	}

	// Duplicate of fromArray() to keep fromArray() monomorphic.
	function fromTypedArray(that, array) {
	  var length = checked(array.length) | 0;
	  that = allocate(that, length);
	  // Truncating the elements is probably not what people expect from typed
	  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
	  // of the old Buffer constructor.
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255;
	  }
	  return that;
	}

	function fromArrayBuffer(that, array) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    array.byteLength;
	    that = Buffer._augment(new Uint8Array(array));
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromTypedArray(that, new Uint8Array(array));
	  }
	  return that;
	}

	function fromArrayLike(that, array) {
	  var length = checked(array.length) | 0;
	  that = allocate(that, length);
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255;
	  }
	  return that;
	}

	// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
	// Returns a zero-length buffer for inputs that don't conform to the spec.
	function fromJsonObject(that, object) {
	  var array;
	  var length = 0;

	  if (object.type === 'Buffer' && isArray(object.data)) {
	    array = object.data;
	    length = checked(array.length) | 0;
	  }
	  that = allocate(that, length);

	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255;
	  }
	  return that;
	}

	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype;
	  Buffer.__proto__ = Uint8Array;
	} else {
	  // pre-set for values that may exist in the future
	  Buffer.prototype.length = undefined;
	  Buffer.prototype.parent = undefined;
	}

	function allocate(that, length) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = Buffer._augment(new Uint8Array(length));
	    that.__proto__ = Buffer.prototype;
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that.length = length;
	    that._isBuffer = true;
	  }

	  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1;
	  if (fromPool) that.parent = rootParent;

	  return that;
	}

	function checked(length) {
	  // Note: cannot use `length < kMaxLength` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + kMaxLength().toString(16) + ' bytes');
	  }
	  return length | 0;
	}

	function SlowBuffer(subject, encoding) {
	  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding);

	  var buf = new Buffer(subject, encoding);
	  delete buf.parent;
	  return buf;
	}

	Buffer.isBuffer = function isBuffer(b) {
	  return !!(b != null && b._isBuffer);
	};

	Buffer.compare = function compare(a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers');
	  }

	  if (a === b) return 0;

	  var x = a.length;
	  var y = b.length;

	  var i = 0;
	  var len = Math.min(x, y);
	  while (i < len) {
	    if (a[i] !== b[i]) break;

	    ++i;
	  }

	  if (i !== len) {
	    x = a[i];
	    y = b[i];
	  }

	  if (x < y) return -1;
	  if (y < x) return 1;
	  return 0;
	};

	Buffer.isEncoding = function isEncoding(encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'binary':
	    case 'base64':
	    case 'raw':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true;
	    default:
	      return false;
	  }
	};

	Buffer.concat = function concat(list, length) {
	  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.');

	  if (list.length === 0) {
	    return new Buffer(0);
	  }

	  var i;
	  if (length === undefined) {
	    length = 0;
	    for (i = 0; i < list.length; i++) {
	      length += list[i].length;
	    }
	  }

	  var buf = new Buffer(length);
	  var pos = 0;
	  for (i = 0; i < list.length; i++) {
	    var item = list[i];
	    item.copy(buf, pos);
	    pos += item.length;
	  }
	  return buf;
	};

	function byteLength(string, encoding) {
	  if (typeof string !== 'string') string = '' + string;

	  var len = string.length;
	  if (len === 0) return 0;

	  // Use a for loop to avoid recursion
	  var loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'binary':
	      // Deprecated
	      case 'raw':
	      case 'raws':
	        return len;
	      case 'utf8':
	      case 'utf-8':
	        return utf8ToBytes(string).length;
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2;
	      case 'hex':
	        return len >>> 1;
	      case 'base64':
	        return base64ToBytes(string).length;
	      default:
	        if (loweredCase) return utf8ToBytes(string).length; // assume utf8
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	}
	Buffer.byteLength = byteLength;

	function slowToString(encoding, start, end) {
	  var loweredCase = false;

	  start = start | 0;
	  end = end === undefined || end === Infinity ? this.length : end | 0;

	  if (!encoding) encoding = 'utf8';
	  if (start < 0) start = 0;
	  if (end > this.length) end = this.length;
	  if (end <= start) return '';

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end);

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end);

	      case 'ascii':
	        return asciiSlice(this, start, end);

	      case 'binary':
	        return binarySlice(this, start, end);

	      case 'base64':
	        return base64Slice(this, start, end);

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end);

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
	        encoding = (encoding + '').toLowerCase();
	        loweredCase = true;
	    }
	  }
	}

	Buffer.prototype.toString = function toString() {
	  var length = this.length | 0;
	  if (length === 0) return '';
	  if (arguments.length === 0) return utf8Slice(this, 0, length);
	  return slowToString.apply(this, arguments);
	};

	Buffer.prototype.equals = function equals(b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
	  if (this === b) return true;
	  return Buffer.compare(this, b) === 0;
	};

	Buffer.prototype.inspect = function inspect() {
	  var str = '';
	  var max = exports.INSPECT_MAX_BYTES;
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
	    if (this.length > max) str += ' ... ';
	  }
	  return '<Buffer ' + str + '>';
	};

	Buffer.prototype.compare = function compare(b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
	  if (this === b) return 0;
	  return Buffer.compare(this, b);
	};

	Buffer.prototype.indexOf = function indexOf(val, byteOffset) {
	  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff;else if (byteOffset < -0x80000000) byteOffset = -0x80000000;
	  byteOffset >>= 0;

	  if (this.length === 0) return -1;
	  if (byteOffset >= this.length) return -1;

	  // Negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0);

	  if (typeof val === 'string') {
	    if (val.length === 0) return -1; // special case: looking for empty string always fails
	    return String.prototype.indexOf.call(this, val, byteOffset);
	  }
	  if (Buffer.isBuffer(val)) {
	    return arrayIndexOf(this, val, byteOffset);
	  }
	  if (typeof val === 'number') {
	    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
	      return Uint8Array.prototype.indexOf.call(this, val, byteOffset);
	    }
	    return arrayIndexOf(this, [val], byteOffset);
	  }

	  function arrayIndexOf(arr, val, byteOffset) {
	    var foundIndex = -1;
	    for (var i = 0; byteOffset + i < arr.length; i++) {
	      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
	        if (foundIndex === -1) foundIndex = i;
	        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex;
	      } else {
	        foundIndex = -1;
	      }
	    }
	    return -1;
	  }

	  throw new TypeError('val must be string, number or Buffer');
	};

	// `get` is deprecated
	Buffer.prototype.get = function get(offset) {
	  console.log('.get() is deprecated. Access using array indexes instead.');
	  return this.readUInt8(offset);
	};

	// `set` is deprecated
	Buffer.prototype.set = function set(v, offset) {
	  console.log('.set() is deprecated. Access using array indexes instead.');
	  return this.writeUInt8(v, offset);
	};

	function hexWrite(buf, string, offset, length) {
	  offset = Number(offset) || 0;
	  var remaining = buf.length - offset;
	  if (!length) {
	    length = remaining;
	  } else {
	    length = Number(length);
	    if (length > remaining) {
	      length = remaining;
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length;
	  if (strLen % 2 !== 0) throw new Error('Invalid hex string');

	  if (length > strLen / 2) {
	    length = strLen / 2;
	  }
	  for (var i = 0; i < length; i++) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16);
	    if (isNaN(parsed)) throw new Error('Invalid hex string');
	    buf[offset + i] = parsed;
	  }
	  return i;
	}

	function utf8Write(buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
	}

	function asciiWrite(buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length);
	}

	function binaryWrite(buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length);
	}

	function base64Write(buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length);
	}

	function ucs2Write(buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
	}

	Buffer.prototype.write = function write(string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8';
	    length = this.length;
	    offset = 0;
	    // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	      encoding = offset;
	      length = this.length;
	      offset = 0;
	      // Buffer#write(string, offset[, length][, encoding])
	    } else if (isFinite(offset)) {
	        offset = offset | 0;
	        if (isFinite(length)) {
	          length = length | 0;
	          if (encoding === undefined) encoding = 'utf8';
	        } else {
	          encoding = length;
	          length = undefined;
	        }
	        // legacy write(string, encoding, offset, length) - remove in v0.13
	      } else {
	          var swap = encoding;
	          encoding = offset;
	          offset = length | 0;
	          length = swap;
	        }

	  var remaining = this.length - offset;
	  if (length === undefined || length > remaining) length = remaining;

	  if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
	    throw new RangeError('attempt to write outside buffer bounds');
	  }

	  if (!encoding) encoding = 'utf8';

	  var loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length);

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length);

	      case 'ascii':
	        return asciiWrite(this, string, offset, length);

	      case 'binary':
	        return binaryWrite(this, string, offset, length);

	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length);

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length);

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	};

	Buffer.prototype.toJSON = function toJSON() {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  };
	};

	function base64Slice(buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf);
	  } else {
	    return base64.fromByteArray(buf.slice(start, end));
	  }
	}

	function utf8Slice(buf, start, end) {
	  end = Math.min(buf.length, end);
	  var res = [];

	  var i = start;
	  while (i < end) {
	    var firstByte = buf[i];
	    var codePoint = null;
	    var bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;

	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint;

	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte;
	          }
	          break;
	        case 2:
	          secondByte = buf[i + 1];
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | secondByte & 0x3F;
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break;
	        case 3:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | thirdByte & 0x3F;
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break;
	        case 4:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          fourthByte = buf[i + 3];
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | fourthByte & 0x3F;
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint;
	            }
	          }
	      }
	    }

	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD;
	      bytesPerSequence = 1;
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000;
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
	      codePoint = 0xDC00 | codePoint & 0x3FF;
	    }

	    res.push(codePoint);
	    i += bytesPerSequence;
	  }

	  return decodeCodePointsArray(res);
	}

	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000;

	function decodeCodePointsArray(codePoints) {
	  var len = codePoints.length;
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints); // avoid extra slice()
	  }

	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = '';
	  var i = 0;
	  while (i < len) {
	    res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
	  }
	  return res;
	}

	function asciiSlice(buf, start, end) {
	  var ret = '';
	  end = Math.min(buf.length, end);

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i] & 0x7F);
	  }
	  return ret;
	}

	function binarySlice(buf, start, end) {
	  var ret = '';
	  end = Math.min(buf.length, end);

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i]);
	  }
	  return ret;
	}

	function hexSlice(buf, start, end) {
	  var len = buf.length;

	  if (!start || start < 0) start = 0;
	  if (!end || end < 0 || end > len) end = len;

	  var out = '';
	  for (var i = start; i < end; i++) {
	    out += toHex(buf[i]);
	  }
	  return out;
	}

	function utf16leSlice(buf, start, end) {
	  var bytes = buf.slice(start, end);
	  var res = '';
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
	  }
	  return res;
	}

	Buffer.prototype.slice = function slice(start, end) {
	  var len = this.length;
	  start = ~ ~start;
	  end = end === undefined ? len : ~ ~end;

	  if (start < 0) {
	    start += len;
	    if (start < 0) start = 0;
	  } else if (start > len) {
	    start = len;
	  }

	  if (end < 0) {
	    end += len;
	    if (end < 0) end = 0;
	  } else if (end > len) {
	    end = len;
	  }

	  if (end < start) end = start;

	  var newBuf;
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = Buffer._augment(this.subarray(start, end));
	  } else {
	    var sliceLen = end - start;
	    newBuf = new Buffer(sliceLen, undefined);
	    for (var i = 0; i < sliceLen; i++) {
	      newBuf[i] = this[i + start];
	    }
	  }

	  if (newBuf.length) newBuf.parent = this.parent || this;

	  return newBuf;
	};

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset(offset, ext, length) {
	  if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
	}

	Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var val = this[offset];
	  var mul = 1;
	  var i = 0;
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul;
	  }

	  return val;
	};

	Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length);
	  }

	  var val = this[offset + --byteLength];
	  var mul = 1;
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul;
	  }

	  return val;
	};

	Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  return this[offset];
	};

	Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return this[offset] | this[offset + 1] << 8;
	};

	Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return this[offset] << 8 | this[offset + 1];
	};

	Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 0x1000000;
	};

	Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return this[offset] * 0x1000000 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
	};

	Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var val = this[offset];
	  var mul = 1;
	  var i = 0;
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul;
	  }
	  mul *= 0x80;

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

	  return val;
	};

	Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var i = byteLength;
	  var mul = 1;
	  var val = this[offset + --i];
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul;
	  }
	  mul *= 0x80;

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

	  return val;
	};

	Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  if (!(this[offset] & 0x80)) return this[offset];
	  return (0xff - this[offset] + 1) * -1;
	};

	Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  var val = this[offset] | this[offset + 1] << 8;
	  return val & 0x8000 ? val | 0xFFFF0000 : val;
	};

	Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  var val = this[offset + 1] | this[offset] << 8;
	  return val & 0x8000 ? val | 0xFFFF0000 : val;
	};

	Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
	};

	Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
	};

	Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return ieee754.read(this, offset, true, 23, 4);
	};

	Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return ieee754.read(this, offset, false, 23, 4);
	};

	Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return ieee754.read(this, offset, true, 52, 8);
	};

	Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return ieee754.read(this, offset, false, 52, 8);
	};

	function checkInt(buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance');
	  if (value > max || value < min) throw new RangeError('value is out of bounds');
	  if (offset + ext > buf.length) throw new RangeError('index out of range');
	}

	Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0);

	  var mul = 1;
	  var i = 0;
	  this[offset] = value & 0xFF;
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = value / mul & 0xFF;
	  }

	  return offset + byteLength;
	};

	Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0);

	  var i = byteLength - 1;
	  var mul = 1;
	  this[offset + i] = value & 0xFF;
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = value / mul & 0xFF;
	  }

	  return offset + byteLength;
	};

	Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
	  this[offset] = value & 0xff;
	  return offset + 1;
	};

	function objectWriteUInt16(buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1;
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
	    buf[offset + i] = (value & 0xff << 8 * (littleEndian ? i : 1 - i)) >>> (littleEndian ? i : 1 - i) * 8;
	  }
	}

	Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value & 0xff;
	    this[offset + 1] = value >>> 8;
	  } else {
	    objectWriteUInt16(this, value, offset, true);
	  }
	  return offset + 2;
	};

	Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value >>> 8;
	    this[offset + 1] = value & 0xff;
	  } else {
	    objectWriteUInt16(this, value, offset, false);
	  }
	  return offset + 2;
	};

	function objectWriteUInt32(buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1;
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
	    buf[offset + i] = value >>> (littleEndian ? i : 3 - i) * 8 & 0xff;
	  }
	}

	Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = value >>> 24;
	    this[offset + 2] = value >>> 16;
	    this[offset + 1] = value >>> 8;
	    this[offset] = value & 0xff;
	  } else {
	    objectWriteUInt32(this, value, offset, true);
	  }
	  return offset + 4;
	};

	Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value >>> 24;
	    this[offset + 1] = value >>> 16;
	    this[offset + 2] = value >>> 8;
	    this[offset + 3] = value & 0xff;
	  } else {
	    objectWriteUInt32(this, value, offset, false);
	  }
	  return offset + 4;
	};

	Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1);

	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }

	  var i = 0;
	  var mul = 1;
	  var sub = value < 0 ? 1 : 0;
	  this[offset] = value & 0xFF;
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
	  }

	  return offset + byteLength;
	};

	Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1);

	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }

	  var i = byteLength - 1;
	  var mul = 1;
	  var sub = value < 0 ? 1 : 0;
	  this[offset + i] = value & 0xFF;
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
	  }

	  return offset + byteLength;
	};

	Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
	  if (value < 0) value = 0xff + value + 1;
	  this[offset] = value & 0xff;
	  return offset + 1;
	};

	Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value & 0xff;
	    this[offset + 1] = value >>> 8;
	  } else {
	    objectWriteUInt16(this, value, offset, true);
	  }
	  return offset + 2;
	};

	Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value >>> 8;
	    this[offset + 1] = value & 0xff;
	  } else {
	    objectWriteUInt16(this, value, offset, false);
	  }
	  return offset + 2;
	};

	Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value & 0xff;
	    this[offset + 1] = value >>> 8;
	    this[offset + 2] = value >>> 16;
	    this[offset + 3] = value >>> 24;
	  } else {
	    objectWriteUInt32(this, value, offset, true);
	  }
	  return offset + 4;
	};

	Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
	  if (value < 0) value = 0xffffffff + value + 1;
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value >>> 24;
	    this[offset + 1] = value >>> 16;
	    this[offset + 2] = value >>> 8;
	    this[offset + 3] = value & 0xff;
	  } else {
	    objectWriteUInt32(this, value, offset, false);
	  }
	  return offset + 4;
	};

	function checkIEEE754(buf, value, offset, ext, max, min) {
	  if (value > max || value < min) throw new RangeError('value is out of bounds');
	  if (offset + ext > buf.length) throw new RangeError('index out of range');
	  if (offset < 0) throw new RangeError('index out of range');
	}

	function writeFloat(buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4);
	  return offset + 4;
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert);
	};

	Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert);
	};

	function writeDouble(buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308);
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8);
	  return offset + 8;
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert);
	};

	Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert);
	};

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy(target, targetStart, start, end) {
	  if (!start) start = 0;
	  if (!end && end !== 0) end = this.length;
	  if (targetStart >= target.length) targetStart = target.length;
	  if (!targetStart) targetStart = 0;
	  if (end > 0 && end < start) end = start;

	  // Copy 0 bytes; we're done
	  if (end === start) return 0;
	  if (target.length === 0 || this.length === 0) return 0;

	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds');
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds');
	  if (end < 0) throw new RangeError('sourceEnd out of bounds');

	  // Are we oob?
	  if (end > this.length) end = this.length;
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start;
	  }

	  var len = end - start;
	  var i;

	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; i--) {
	      target[i + targetStart] = this[i + start];
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; i++) {
	      target[i + targetStart] = this[i + start];
	    }
	  } else {
	    target._set(this.subarray(start, start + len), targetStart);
	  }

	  return len;
	};

	// fill(value, start=0, end=buffer.length)
	Buffer.prototype.fill = function fill(value, start, end) {
	  if (!value) value = 0;
	  if (!start) start = 0;
	  if (!end) end = this.length;

	  if (end < start) throw new RangeError('end < start');

	  // Fill 0 bytes; we're done
	  if (end === start) return;
	  if (this.length === 0) return;

	  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds');
	  if (end < 0 || end > this.length) throw new RangeError('end out of bounds');

	  var i;
	  if (typeof value === 'number') {
	    for (i = start; i < end; i++) {
	      this[i] = value;
	    }
	  } else {
	    var bytes = utf8ToBytes(value.toString());
	    var len = bytes.length;
	    for (i = start; i < end; i++) {
	      this[i] = bytes[i % len];
	    }
	  }

	  return this;
	};

	/**
	 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
	 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
	 */
	Buffer.prototype.toArrayBuffer = function toArrayBuffer() {
	  if (typeof Uint8Array !== 'undefined') {
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	      return new Buffer(this).buffer;
	    } else {
	      var buf = new Uint8Array(this.length);
	      for (var i = 0, len = buf.length; i < len; i += 1) {
	        buf[i] = this[i];
	      }
	      return buf.buffer;
	    }
	  } else {
	    throw new TypeError('Buffer.toArrayBuffer not supported in this browser');
	  }
	};

	// HELPER FUNCTIONS
	// ================

	var BP = Buffer.prototype;

	/**
	 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
	 */
	Buffer._augment = function _augment(arr) {
	  arr.constructor = Buffer;
	  arr._isBuffer = true;

	  // save reference to original Uint8Array set method before overwriting
	  arr._set = arr.set;

	  // deprecated
	  arr.get = BP.get;
	  arr.set = BP.set;

	  arr.write = BP.write;
	  arr.toString = BP.toString;
	  arr.toLocaleString = BP.toString;
	  arr.toJSON = BP.toJSON;
	  arr.equals = BP.equals;
	  arr.compare = BP.compare;
	  arr.indexOf = BP.indexOf;
	  arr.copy = BP.copy;
	  arr.slice = BP.slice;
	  arr.readUIntLE = BP.readUIntLE;
	  arr.readUIntBE = BP.readUIntBE;
	  arr.readUInt8 = BP.readUInt8;
	  arr.readUInt16LE = BP.readUInt16LE;
	  arr.readUInt16BE = BP.readUInt16BE;
	  arr.readUInt32LE = BP.readUInt32LE;
	  arr.readUInt32BE = BP.readUInt32BE;
	  arr.readIntLE = BP.readIntLE;
	  arr.readIntBE = BP.readIntBE;
	  arr.readInt8 = BP.readInt8;
	  arr.readInt16LE = BP.readInt16LE;
	  arr.readInt16BE = BP.readInt16BE;
	  arr.readInt32LE = BP.readInt32LE;
	  arr.readInt32BE = BP.readInt32BE;
	  arr.readFloatLE = BP.readFloatLE;
	  arr.readFloatBE = BP.readFloatBE;
	  arr.readDoubleLE = BP.readDoubleLE;
	  arr.readDoubleBE = BP.readDoubleBE;
	  arr.writeUInt8 = BP.writeUInt8;
	  arr.writeUIntLE = BP.writeUIntLE;
	  arr.writeUIntBE = BP.writeUIntBE;
	  arr.writeUInt16LE = BP.writeUInt16LE;
	  arr.writeUInt16BE = BP.writeUInt16BE;
	  arr.writeUInt32LE = BP.writeUInt32LE;
	  arr.writeUInt32BE = BP.writeUInt32BE;
	  arr.writeIntLE = BP.writeIntLE;
	  arr.writeIntBE = BP.writeIntBE;
	  arr.writeInt8 = BP.writeInt8;
	  arr.writeInt16LE = BP.writeInt16LE;
	  arr.writeInt16BE = BP.writeInt16BE;
	  arr.writeInt32LE = BP.writeInt32LE;
	  arr.writeInt32BE = BP.writeInt32BE;
	  arr.writeFloatLE = BP.writeFloatLE;
	  arr.writeFloatBE = BP.writeFloatBE;
	  arr.writeDoubleLE = BP.writeDoubleLE;
	  arr.writeDoubleBE = BP.writeDoubleBE;
	  arr.fill = BP.fill;
	  arr.inspect = BP.inspect;
	  arr.toArrayBuffer = BP.toArrayBuffer;

	  return arr;
	};

	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

	function base64clean(str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return '';
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '=';
	  }
	  return str;
	}

	function stringtrim(str) {
	  if (str.trim) return str.trim();
	  return str.replace(/^\s+|\s+$/g, '');
	}

	function toHex(n) {
	  if (n < 16) return '0' + n.toString(16);
	  return n.toString(16);
	}

	function utf8ToBytes(string, units) {
	  units = units || Infinity;
	  var codePoint;
	  var length = string.length;
	  var leadSurrogate = null;
	  var bytes = [];

	  for (var i = 0; i < length; i++) {
	    codePoint = string.charCodeAt(i);

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          continue;
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          continue;
	        }

	        // valid lead
	        leadSurrogate = codePoint;

	        continue;
	      }

	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	        leadSurrogate = codePoint;
	        continue;
	      }

	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	    }

	    leadSurrogate = null;

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break;
	      bytes.push(codePoint);
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break;
	      bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break;
	      bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break;
	      bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
	    } else {
	      throw new Error('Invalid code point');
	    }
	  }

	  return bytes;
	}

	function asciiToBytes(str) {
	  var byteArray = [];
	  for (var i = 0; i < str.length; i++) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF);
	  }
	  return byteArray;
	}

	function utf16leToBytes(str, units) {
	  var c, hi, lo;
	  var byteArray = [];
	  for (var i = 0; i < str.length; i++) {
	    if ((units -= 2) < 0) break;

	    c = str.charCodeAt(i);
	    hi = c >> 8;
	    lo = c % 256;
	    byteArray.push(lo);
	    byteArray.push(hi);
	  }

	  return byteArray;
	}

	function base64ToBytes(str) {
	  return base64.toByteArray(base64clean(str));
	}

	function blitBuffer(src, dst, offset, length) {
	  for (var i = 0; i < length; i++) {
	    if (i + offset >= dst.length || i >= src.length) break;
	    dst[i + offset] = src[i];
	  }
	  return i;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./~/buffer/index.js */ 36).Buffer, (function() { return this; }())))

/***/ },
/* 37 */
/*!********************************!*\
  !*** ./~/base64-js/lib/b64.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	;(function (exports) {
		'use strict';

		var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

		var PLUS = '+'.charCodeAt(0);
		var SLASH = '/'.charCodeAt(0);
		var NUMBER = '0'.charCodeAt(0);
		var LOWER = 'a'.charCodeAt(0);
		var UPPER = 'A'.charCodeAt(0);
		var PLUS_URL_SAFE = '-'.charCodeAt(0);
		var SLASH_URL_SAFE = '_'.charCodeAt(0);

		function decode(elt) {
			var code = elt.charCodeAt(0);
			if (code === PLUS || code === PLUS_URL_SAFE) return 62; // '+'
			if (code === SLASH || code === SLASH_URL_SAFE) return 63; // '/'
			if (code < NUMBER) return -1; //no match
			if (code < NUMBER + 10) return code - NUMBER + 26 + 26;
			if (code < UPPER + 26) return code - UPPER;
			if (code < LOWER + 26) return code - LOWER + 26;
		}

		function b64ToByteArray(b64) {
			var i, j, l, tmp, placeHolders, arr;

			if (b64.length % 4 > 0) {
				throw new Error('Invalid string. Length must be a multiple of 4');
			}

			// the number of equal signs (place holders)
			// if there are two placeholders, than the two characters before it
			// represent one byte
			// if there is only one, then the three characters before it represent 2 bytes
			// this is just a cheap hack to not do indexOf twice
			var len = b64.length;
			placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0;

			// base64 is 4/3 + up to two characters of the original data
			arr = new Arr(b64.length * 3 / 4 - placeHolders);

			// if there are placeholders, only get up to the last complete 4 chars
			l = placeHolders > 0 ? b64.length - 4 : b64.length;

			var L = 0;

			function push(v) {
				arr[L++] = v;
			}

			for (i = 0, j = 0; i < l; i += 4, j += 3) {
				tmp = decode(b64.charAt(i)) << 18 | decode(b64.charAt(i + 1)) << 12 | decode(b64.charAt(i + 2)) << 6 | decode(b64.charAt(i + 3));
				push((tmp & 0xFF0000) >> 16);
				push((tmp & 0xFF00) >> 8);
				push(tmp & 0xFF);
			}

			if (placeHolders === 2) {
				tmp = decode(b64.charAt(i)) << 2 | decode(b64.charAt(i + 1)) >> 4;
				push(tmp & 0xFF);
			} else if (placeHolders === 1) {
				tmp = decode(b64.charAt(i)) << 10 | decode(b64.charAt(i + 1)) << 4 | decode(b64.charAt(i + 2)) >> 2;
				push(tmp >> 8 & 0xFF);
				push(tmp & 0xFF);
			}

			return arr;
		}

		function uint8ToBase64(uint8) {
			var i,
			    extraBytes = uint8.length % 3,
			    // if we have 1 byte left, pad 2 bytes
			output = "",
			    temp,
			    length;

			function encode(num) {
				return lookup.charAt(num);
			}

			function tripletToBase64(num) {
				return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F);
			}

			// go through the array every three bytes, we'll deal with trailing stuff later
			for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
				temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
				output += tripletToBase64(temp);
			}

			// pad the end with zeros, but make sure to not forget the extra bytes
			switch (extraBytes) {
				case 1:
					temp = uint8[uint8.length - 1];
					output += encode(temp >> 2);
					output += encode(temp << 4 & 0x3F);
					output += '==';
					break;
				case 2:
					temp = (uint8[uint8.length - 2] << 8) + uint8[uint8.length - 1];
					output += encode(temp >> 10);
					output += encode(temp >> 4 & 0x3F);
					output += encode(temp << 2 & 0x3F);
					output += '=';
					break;
			}

			return output;
		}

		exports.toByteArray = b64ToByteArray;
		exports.fromByteArray = uint8ToBase64;
	})( false ? undefined.base64js = {} : exports);

/***/ },
/* 38 */
/*!****************************!*\
  !*** ./~/ieee754/index.js ***!
  \****************************/
/***/ function(module, exports) {

	"use strict";

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m;
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var nBits = -7;
	  var i = isLE ? nBytes - 1 : 0;
	  var d = isLE ? -1 : 1;
	  var s = buffer[offset + i];

	  i += d;

	  e = s & (1 << -nBits) - 1;
	  s >>= -nBits;
	  nBits += eLen;
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & (1 << -nBits) - 1;
	  e >>= -nBits;
	  nBits += mLen;
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias;
	  } else if (e === eMax) {
	    return m ? NaN : (s ? -1 : 1) * Infinity;
	  } else {
	    m = m + Math.pow(2, mLen);
	    e = e - eBias;
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
	};

	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c;
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
	  var i = isLE ? 0 : nBytes - 1;
	  var d = isLE ? 1 : -1;
	  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;

	  value = Math.abs(value);

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0;
	    e = eMax;
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2);
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--;
	      c *= 2;
	    }
	    if (e + eBias >= 1) {
	      value += rt / c;
	    } else {
	      value += rt * Math.pow(2, 1 - eBias);
	    }
	    if (value * c >= 2) {
	      e++;
	      c /= 2;
	    }

	    if (e + eBias >= eMax) {
	      m = 0;
	      e = eMax;
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen);
	      e = e + eBias;
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
	      e = 0;
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = e << mLen | m;
	  eLen += mLen;
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128;
	};

/***/ },
/* 39 */
/*!****************************!*\
  !*** ./~/isarray/index.js ***!
  \****************************/
/***/ function(module, exports) {

	'use strict';

	var toString = {}.toString;

	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};

/***/ },
/* 40 */
/*!**********************************!*\
  !*** ./~/bit-twiddle/twiddle.js ***!
  \**********************************/
/***/ function(module, exports) {

	/**
	 * Bit twiddling hacks for JavaScript.
	 *
	 * Author: Mikola Lysenko
	 *
	 * Ported from Stanford bit twiddling hack library:
	 *    http://graphics.stanford.edu/~seander/bithacks.html
	 */

	"use strict";"use restrict";

	//Number of bits in an integer

	var INT_BITS = 32;

	//Constants
	exports.INT_BITS = INT_BITS;
	exports.INT_MAX = 0x7fffffff;
	exports.INT_MIN = -1 << INT_BITS - 1;

	//Returns -1, 0, +1 depending on sign of x
	exports.sign = function (v) {
	  return (v > 0) - (v < 0);
	};

	//Computes absolute value of integer
	exports.abs = function (v) {
	  var mask = v >> INT_BITS - 1;
	  return (v ^ mask) - mask;
	};

	//Computes minimum of integers x and y
	exports.min = function (x, y) {
	  return y ^ (x ^ y) & -(x < y);
	};

	//Computes maximum of integers x and y
	exports.max = function (x, y) {
	  return x ^ (x ^ y) & -(x < y);
	};

	//Checks if a number is a power of two
	exports.isPow2 = function (v) {
	  return !(v & v - 1) && !!v;
	};

	//Computes log base 2 of v
	exports.log2 = function (v) {
	  var r, shift;
	  r = (v > 0xFFFF) << 4;v >>>= r;
	  shift = (v > 0xFF) << 3;v >>>= shift;r |= shift;
	  shift = (v > 0xF) << 2;v >>>= shift;r |= shift;
	  shift = (v > 0x3) << 1;v >>>= shift;r |= shift;
	  return r | v >> 1;
	};

	//Computes log base 10 of v
	exports.log10 = function (v) {
	  return v >= 1000000000 ? 9 : v >= 100000000 ? 8 : v >= 10000000 ? 7 : v >= 1000000 ? 6 : v >= 100000 ? 5 : v >= 10000 ? 4 : v >= 1000 ? 3 : v >= 100 ? 2 : v >= 10 ? 1 : 0;
	};

	//Counts number of bits
	exports.popCount = function (v) {
	  v = v - (v >>> 1 & 0x55555555);
	  v = (v & 0x33333333) + (v >>> 2 & 0x33333333);
	  return (v + (v >>> 4) & 0xF0F0F0F) * 0x1010101 >>> 24;
	};

	//Counts number of trailing zeros
	function countTrailingZeros(v) {
	  var c = 32;
	  v &= -v;
	  if (v) c--;
	  if (v & 0x0000FFFF) c -= 16;
	  if (v & 0x00FF00FF) c -= 8;
	  if (v & 0x0F0F0F0F) c -= 4;
	  if (v & 0x33333333) c -= 2;
	  if (v & 0x55555555) c -= 1;
	  return c;
	}
	exports.countTrailingZeros = countTrailingZeros;

	//Rounds to next power of 2
	exports.nextPow2 = function (v) {
	  v += v === 0;
	  --v;
	  v |= v >>> 1;
	  v |= v >>> 2;
	  v |= v >>> 4;
	  v |= v >>> 8;
	  v |= v >>> 16;
	  return v + 1;
	};

	//Rounds down to previous power of 2
	exports.prevPow2 = function (v) {
	  v |= v >>> 1;
	  v |= v >>> 2;
	  v |= v >>> 4;
	  v |= v >>> 8;
	  v |= v >>> 16;
	  return v - (v >>> 1);
	};

	//Computes parity of word
	exports.parity = function (v) {
	  v ^= v >>> 16;
	  v ^= v >>> 8;
	  v ^= v >>> 4;
	  v &= 0xf;
	  return 0x6996 >>> v & 1;
	};

	var REVERSE_TABLE = new Array(256);

	(function (tab) {
	  for (var i = 0; i < 256; ++i) {
	    var v = i,
	        r = i,
	        s = 7;
	    for (v >>>= 1; v; v >>>= 1) {
	      r <<= 1;
	      r |= v & 1;
	      --s;
	    }
	    tab[i] = r << s & 0xff;
	  }
	})(REVERSE_TABLE);

	//Reverse bits in a 32 bit word
	exports.reverse = function (v) {
	  return REVERSE_TABLE[v & 0xff] << 24 | REVERSE_TABLE[v >>> 8 & 0xff] << 16 | REVERSE_TABLE[v >>> 16 & 0xff] << 8 | REVERSE_TABLE[v >>> 24 & 0xff];
	};

	//Interleave bits of 2 coordinates with 16 bits.  Useful for fast quadtree codes
	exports.interleave2 = function (x, y) {
	  x &= 0xFFFF;
	  x = (x | x << 8) & 0x00FF00FF;
	  x = (x | x << 4) & 0x0F0F0F0F;
	  x = (x | x << 2) & 0x33333333;
	  x = (x | x << 1) & 0x55555555;

	  y &= 0xFFFF;
	  y = (y | y << 8) & 0x00FF00FF;
	  y = (y | y << 4) & 0x0F0F0F0F;
	  y = (y | y << 2) & 0x33333333;
	  y = (y | y << 1) & 0x55555555;

	  return x | y << 1;
	};

	//Extracts the nth interleaved component
	exports.deinterleave2 = function (v, n) {
	  v = v >>> n & 0x55555555;
	  v = (v | v >>> 1) & 0x33333333;
	  v = (v | v >>> 2) & 0x0F0F0F0F;
	  v = (v | v >>> 4) & 0x00FF00FF;
	  v = (v | v >>> 16) & 0x000FFFF;
	  return v << 16 >> 16;
	};

	//Interleave bits of 3 coordinates, each with 10 bits.  Useful for fast octree codes
	exports.interleave3 = function (x, y, z) {
	  x &= 0x3FF;
	  x = (x | x << 16) & 4278190335;
	  x = (x | x << 8) & 251719695;
	  x = (x | x << 4) & 3272356035;
	  x = (x | x << 2) & 1227133513;

	  y &= 0x3FF;
	  y = (y | y << 16) & 4278190335;
	  y = (y | y << 8) & 251719695;
	  y = (y | y << 4) & 3272356035;
	  y = (y | y << 2) & 1227133513;
	  x |= y << 1;

	  z &= 0x3FF;
	  z = (z | z << 16) & 4278190335;
	  z = (z | z << 8) & 251719695;
	  z = (z | z << 4) & 3272356035;
	  z = (z | z << 2) & 1227133513;

	  return x | z << 2;
	};

	//Extracts nth interleaved component of a 3-tuple
	exports.deinterleave3 = function (v, n) {
	  v = v >>> n & 1227133513;
	  v = (v | v >>> 2) & 3272356035;
	  v = (v | v >>> 4) & 251719695;
	  v = (v | v >>> 8) & 4278190335;
	  v = (v | v >>> 16) & 0x3FF;
	  return v << 22 >> 22;
	};

	//Computes next combination in colexicographic order (this is mistakenly called nextPermutation on the bit twiddling hacks page)
	exports.nextCombination = function (v) {
	  var t = v | v - 1;
	  return t + 1 | (~t & - ~t) - 1 >>> countTrailingZeros(v) + 1;
	};

/***/ },
/* 41 */
/*!**********************!*\
  !*** ./~/dup/dup.js ***!
  \**********************/
/***/ function(module, exports) {

	"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	function dupe_array(count, value, i) {
	  var c = count[i] | 0;
	  if (c <= 0) {
	    return [];
	  }
	  var result = new Array(c),
	      j;
	  if (i === count.length - 1) {
	    for (j = 0; j < c; ++j) {
	      result[j] = value;
	    }
	  } else {
	    for (j = 0; j < c; ++j) {
	      result[j] = dupe_array(count, value, i + 1);
	    }
	  }
	  return result;
	}

	function dupe_number(count, value) {
	  var result, i;
	  result = new Array(count);
	  for (i = 0; i < count; ++i) {
	    result[i] = value;
	  }
	  return result;
	}

	function dupe(count, value) {
	  if (typeof value === "undefined") {
	    value = 0;
	  }
	  switch (typeof count === "undefined" ? "undefined" : _typeof(count)) {
	    case "number":
	      if (count > 0) {
	        return dupe_number(count | 0, value);
	      }
	      break;
	    case "object":
	      if (typeof count.length === "number") {
	        return dupe_array(count, value, 0);
	      }
	      break;
	  }
	  return [];
	}

	module.exports = dupe;

/***/ },
/* 42 */
/*!**************************************!*\
  !*** ./~/ndarray-ops/ndarray-ops.js ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var compile = __webpack_require__(/*! cwise-compiler */ 43);

	var EmptyProc = {
	  body: "",
	  args: [],
	  thisVars: [],
	  localVars: []
	};

	function fixup(x) {
	  if (!x) {
	    return EmptyProc;
	  }
	  for (var i = 0; i < x.args.length; ++i) {
	    var a = x.args[i];
	    if (i === 0) {
	      x.args[i] = { name: a, lvalue: true, rvalue: !!x.rvalue, count: x.count || 1 };
	    } else {
	      x.args[i] = { name: a, lvalue: false, rvalue: true, count: 1 };
	    }
	  }
	  if (!x.thisVars) {
	    x.thisVars = [];
	  }
	  if (!x.localVars) {
	    x.localVars = [];
	  }
	  return x;
	}

	function pcompile(user_args) {
	  return compile({
	    args: user_args.args,
	    pre: fixup(user_args.pre),
	    body: fixup(user_args.body),
	    post: fixup(user_args.proc),
	    funcName: user_args.funcName
	  });
	}

	function makeOp(user_args) {
	  var args = [];
	  for (var i = 0; i < user_args.args.length; ++i) {
	    args.push("a" + i);
	  }
	  var wrapper = new Function("P", ["return function ", user_args.funcName, "_ndarrayops(", args.join(","), ") {P(", args.join(","), ");return a0}"].join(""));
	  return wrapper(pcompile(user_args));
	}

	var assign_ops = {
	  add: "+",
	  sub: "-",
	  mul: "*",
	  div: "/",
	  mod: "%",
	  band: "&",
	  bor: "|",
	  bxor: "^",
	  lshift: "<<",
	  rshift: ">>",
	  rrshift: ">>>"
	};(function () {
	  for (var id in assign_ops) {
	    var op = assign_ops[id];
	    exports[id] = makeOp({
	      args: ["array", "array", "array"],
	      body: { args: ["a", "b", "c"],
	        body: "a=b" + op + "c" },
	      funcName: id
	    });
	    exports[id + "eq"] = makeOp({
	      args: ["array", "array"],
	      body: { args: ["a", "b"],
	        body: "a" + op + "=b" },
	      rvalue: true,
	      funcName: id + "eq"
	    });
	    exports[id + "s"] = makeOp({
	      args: ["array", "array", "scalar"],
	      body: { args: ["a", "b", "s"],
	        body: "a=b" + op + "s" },
	      funcName: id + "s"
	    });
	    exports[id + "seq"] = makeOp({
	      args: ["array", "scalar"],
	      body: { args: ["a", "s"],
	        body: "a" + op + "=s" },
	      rvalue: true,
	      funcName: id + "seq"
	    });
	  }
	})();

	var unary_ops = {
	  not: "!",
	  bnot: "~",
	  neg: "-",
	  recip: "1.0/"
	};(function () {
	  for (var id in unary_ops) {
	    var op = unary_ops[id];
	    exports[id] = makeOp({
	      args: ["array", "array"],
	      body: { args: ["a", "b"],
	        body: "a=" + op + "b" },
	      funcName: id
	    });
	    exports[id + "eq"] = makeOp({
	      args: ["array"],
	      body: { args: ["a"],
	        body: "a=" + op + "a" },
	      rvalue: true,
	      count: 2,
	      funcName: id + "eq"
	    });
	  }
	})();

	var binary_ops = {
	  and: "&&",
	  or: "||",
	  eq: "===",
	  neq: "!==",
	  lt: "<",
	  gt: ">",
	  leq: "<=",
	  geq: ">="
	};(function () {
	  for (var id in binary_ops) {
	    var op = binary_ops[id];
	    exports[id] = makeOp({
	      args: ["array", "array", "array"],
	      body: { args: ["a", "b", "c"],
	        body: "a=b" + op + "c" },
	      funcName: id
	    });
	    exports[id + "s"] = makeOp({
	      args: ["array", "array", "scalar"],
	      body: { args: ["a", "b", "s"],
	        body: "a=b" + op + "s" },
	      funcName: id + "s"
	    });
	    exports[id + "eq"] = makeOp({
	      args: ["array", "array"],
	      body: { args: ["a", "b"],
	        body: "a=a" + op + "b" },
	      rvalue: true,
	      count: 2,
	      funcName: id + "eq"
	    });
	    exports[id + "seq"] = makeOp({
	      args: ["array", "scalar"],
	      body: { args: ["a", "s"],
	        body: "a=a" + op + "s" },
	      rvalue: true,
	      count: 2,
	      funcName: id + "seq"
	    });
	  }
	})();

	var math_unary = ["abs", "acos", "asin", "atan", "ceil", "cos", "exp", "floor", "log", "round", "sin", "sqrt", "tan"];(function () {
	  for (var i = 0; i < math_unary.length; ++i) {
	    var f = math_unary[i];
	    exports[f] = makeOp({
	      args: ["array", "array"],
	      pre: { args: [], body: "this_f=Math." + f, thisVars: ["this_f"] },
	      body: { args: ["a", "b"], body: "a=this_f(b)", thisVars: ["this_f"] },
	      funcName: f
	    });
	    exports[f + "eq"] = makeOp({
	      args: ["array"],
	      pre: { args: [], body: "this_f=Math." + f, thisVars: ["this_f"] },
	      body: { args: ["a"], body: "a=this_f(a)", thisVars: ["this_f"] },
	      rvalue: true,
	      count: 2,
	      funcName: f + "eq"
	    });
	  }
	})();

	var math_comm = ["max", "min", "atan2", "pow"];(function () {
	  for (var i = 0; i < math_comm.length; ++i) {
	    var f = math_comm[i];
	    exports[f] = makeOp({
	      args: ["array", "array", "array"],
	      pre: { args: [], body: "this_f=Math." + f, thisVars: ["this_f"] },
	      body: { args: ["a", "b", "c"], body: "a=this_f(b,c)", thisVars: ["this_f"] },
	      funcName: f
	    });
	    exports[f + "s"] = makeOp({
	      args: ["array", "array", "scalar"],
	      pre: { args: [], body: "this_f=Math." + f, thisVars: ["this_f"] },
	      body: { args: ["a", "b", "c"], body: "a=this_f(b,c)", thisVars: ["this_f"] },
	      funcName: f + "s"
	    });
	    exports[f + "eq"] = makeOp({ args: ["array", "array"],
	      pre: { args: [], body: "this_f=Math." + f, thisVars: ["this_f"] },
	      body: { args: ["a", "b"], body: "a=this_f(a,b)", thisVars: ["this_f"] },
	      rvalue: true,
	      count: 2,
	      funcName: f + "eq"
	    });
	    exports[f + "seq"] = makeOp({ args: ["array", "scalar"],
	      pre: { args: [], body: "this_f=Math." + f, thisVars: ["this_f"] },
	      body: { args: ["a", "b"], body: "a=this_f(a,b)", thisVars: ["this_f"] },
	      rvalue: true,
	      count: 2,
	      funcName: f + "seq"
	    });
	  }
	})();

	var math_noncomm = ["atan2", "pow"];(function () {
	  for (var i = 0; i < math_noncomm.length; ++i) {
	    var f = math_noncomm[i];
	    exports[f + "op"] = makeOp({
	      args: ["array", "array", "array"],
	      pre: { args: [], body: "this_f=Math." + f, thisVars: ["this_f"] },
	      body: { args: ["a", "b", "c"], body: "a=this_f(c,b)", thisVars: ["this_f"] },
	      funcName: f + "op"
	    });
	    exports[f + "ops"] = makeOp({
	      args: ["array", "array", "scalar"],
	      pre: { args: [], body: "this_f=Math." + f, thisVars: ["this_f"] },
	      body: { args: ["a", "b", "c"], body: "a=this_f(c,b)", thisVars: ["this_f"] },
	      funcName: f + "ops"
	    });
	    exports[f + "opeq"] = makeOp({ args: ["array", "array"],
	      pre: { args: [], body: "this_f=Math." + f, thisVars: ["this_f"] },
	      body: { args: ["a", "b"], body: "a=this_f(b,a)", thisVars: ["this_f"] },
	      rvalue: true,
	      count: 2,
	      funcName: f + "opeq"
	    });
	    exports[f + "opseq"] = makeOp({ args: ["array", "scalar"],
	      pre: { args: [], body: "this_f=Math." + f, thisVars: ["this_f"] },
	      body: { args: ["a", "b"], body: "a=this_f(b,a)", thisVars: ["this_f"] },
	      rvalue: true,
	      count: 2,
	      funcName: f + "opseq"
	    });
	  }
	})();

	exports.any = compile({
	  args: ["array"],
	  pre: EmptyProc,
	  body: { args: [{ name: "a", lvalue: false, rvalue: true, count: 1 }], body: "if(a){return true}", localVars: [], thisVars: [] },
	  post: { args: [], localVars: [], thisVars: [], body: "return false" },
	  funcName: "any"
	});

	exports.all = compile({
	  args: ["array"],
	  pre: EmptyProc,
	  body: { args: [{ name: "x", lvalue: false, rvalue: true, count: 1 }], body: "if(!x){return false}", localVars: [], thisVars: [] },
	  post: { args: [], localVars: [], thisVars: [], body: "return true" },
	  funcName: "all"
	});

	exports.sum = compile({
	  args: ["array"],
	  pre: { args: [], localVars: [], thisVars: ["this_s"], body: "this_s=0" },
	  body: { args: [{ name: "a", lvalue: false, rvalue: true, count: 1 }], body: "this_s+=a", localVars: [], thisVars: ["this_s"] },
	  post: { args: [], localVars: [], thisVars: ["this_s"], body: "return this_s" },
	  funcName: "sum"
	});

	exports.prod = compile({
	  args: ["array"],
	  pre: { args: [], localVars: [], thisVars: ["this_s"], body: "this_s=1" },
	  body: { args: [{ name: "a", lvalue: false, rvalue: true, count: 1 }], body: "this_s*=a", localVars: [], thisVars: ["this_s"] },
	  post: { args: [], localVars: [], thisVars: ["this_s"], body: "return this_s" },
	  funcName: "prod"
	});

	exports.norm2squared = compile({
	  args: ["array"],
	  pre: { args: [], localVars: [], thisVars: ["this_s"], body: "this_s=0" },
	  body: { args: [{ name: "a", lvalue: false, rvalue: true, count: 2 }], body: "this_s+=a*a", localVars: [], thisVars: ["this_s"] },
	  post: { args: [], localVars: [], thisVars: ["this_s"], body: "return this_s" },
	  funcName: "norm2squared"
	});

	exports.norm2 = compile({
	  args: ["array"],
	  pre: { args: [], localVars: [], thisVars: ["this_s"], body: "this_s=0" },
	  body: { args: [{ name: "a", lvalue: false, rvalue: true, count: 2 }], body: "this_s+=a*a", localVars: [], thisVars: ["this_s"] },
	  post: { args: [], localVars: [], thisVars: ["this_s"], body: "return Math.sqrt(this_s)" },
	  funcName: "norm2"
	});

	exports.norminf = compile({
	  args: ["array"],
	  pre: { args: [], localVars: [], thisVars: ["this_s"], body: "this_s=0" },
	  body: { args: [{ name: "a", lvalue: false, rvalue: true, count: 4 }], body: "if(-a>this_s){this_s=-a}else if(a>this_s){this_s=a}", localVars: [], thisVars: ["this_s"] },
	  post: { args: [], localVars: [], thisVars: ["this_s"], body: "return this_s" },
	  funcName: "norminf"
	});

	exports.norm1 = compile({
	  args: ["array"],
	  pre: { args: [], localVars: [], thisVars: ["this_s"], body: "this_s=0" },
	  body: { args: [{ name: "a", lvalue: false, rvalue: true, count: 3 }], body: "this_s+=a<0?-a:a", localVars: [], thisVars: ["this_s"] },
	  post: { args: [], localVars: [], thisVars: ["this_s"], body: "return this_s" },
	  funcName: "norm1"
	});

	exports.sup = compile({
	  args: ["array"],
	  pre: { body: "this_h=-Infinity",
	    args: [],
	    thisVars: ["this_h"],
	    localVars: [] },
	  body: { body: "if(_inline_1_arg0_>this_h)this_h=_inline_1_arg0_",
	    args: [{ "name": "_inline_1_arg0_", "lvalue": false, "rvalue": true, "count": 2 }],
	    thisVars: ["this_h"],
	    localVars: [] },
	  post: { body: "return this_h",
	    args: [],
	    thisVars: ["this_h"],
	    localVars: [] }
	});

	exports.inf = compile({
	  args: ["array"],
	  pre: { body: "this_h=Infinity",
	    args: [],
	    thisVars: ["this_h"],
	    localVars: [] },
	  body: { body: "if(_inline_1_arg0_<this_h)this_h=_inline_1_arg0_",
	    args: [{ "name": "_inline_1_arg0_", "lvalue": false, "rvalue": true, "count": 2 }],
	    thisVars: ["this_h"],
	    localVars: [] },
	  post: { body: "return this_h",
	    args: [],
	    thisVars: ["this_h"],
	    localVars: [] }
	});

	exports.argmin = compile({
	  args: ["index", "array", "shape"],
	  pre: {
	    body: "{this_v=Infinity;this_i=_inline_0_arg2_.slice(0)}",
	    args: [{ name: "_inline_0_arg0_", lvalue: false, rvalue: false, count: 0 }, { name: "_inline_0_arg1_", lvalue: false, rvalue: false, count: 0 }, { name: "_inline_0_arg2_", lvalue: false, rvalue: true, count: 1 }],
	    thisVars: ["this_i", "this_v"],
	    localVars: [] },
	  body: {
	    body: "{if(_inline_1_arg1_<this_v){this_v=_inline_1_arg1_;for(var _inline_1_k=0;_inline_1_k<_inline_1_arg0_.length;++_inline_1_k){this_i[_inline_1_k]=_inline_1_arg0_[_inline_1_k]}}}",
	    args: [{ name: "_inline_1_arg0_", lvalue: false, rvalue: true, count: 2 }, { name: "_inline_1_arg1_", lvalue: false, rvalue: true, count: 2 }],
	    thisVars: ["this_i", "this_v"],
	    localVars: ["_inline_1_k"] },
	  post: {
	    body: "{return this_i}",
	    args: [],
	    thisVars: ["this_i"],
	    localVars: [] }
	});

	exports.argmax = compile({
	  args: ["index", "array", "shape"],
	  pre: {
	    body: "{this_v=-Infinity;this_i=_inline_0_arg2_.slice(0)}",
	    args: [{ name: "_inline_0_arg0_", lvalue: false, rvalue: false, count: 0 }, { name: "_inline_0_arg1_", lvalue: false, rvalue: false, count: 0 }, { name: "_inline_0_arg2_", lvalue: false, rvalue: true, count: 1 }],
	    thisVars: ["this_i", "this_v"],
	    localVars: [] },
	  body: {
	    body: "{if(_inline_1_arg1_>this_v){this_v=_inline_1_arg1_;for(var _inline_1_k=0;_inline_1_k<_inline_1_arg0_.length;++_inline_1_k){this_i[_inline_1_k]=_inline_1_arg0_[_inline_1_k]}}}",
	    args: [{ name: "_inline_1_arg0_", lvalue: false, rvalue: true, count: 2 }, { name: "_inline_1_arg1_", lvalue: false, rvalue: true, count: 2 }],
	    thisVars: ["this_i", "this_v"],
	    localVars: ["_inline_1_k"] },
	  post: {
	    body: "{return this_i}",
	    args: [],
	    thisVars: ["this_i"],
	    localVars: [] }
	});

	exports.random = makeOp({
	  args: ["array"],
	  pre: { args: [], body: "this_f=Math.random", thisVars: ["this_f"] },
	  body: { args: ["a"], body: "a=this_f()", thisVars: ["this_f"] },
	  funcName: "random"
	});

	exports.assign = makeOp({
	  args: ["array", "array"],
	  body: { args: ["a", "b"], body: "a=b" },
	  funcName: "assign" });

	exports.assigns = makeOp({
	  args: ["array", "scalar"],
	  body: { args: ["a", "b"], body: "a=b" },
	  funcName: "assigns" });

	exports.equals = compile({
	  args: ["array", "array"],
	  pre: EmptyProc,
	  body: { args: [{ name: "x", lvalue: false, rvalue: true, count: 1 }, { name: "y", lvalue: false, rvalue: true, count: 1 }],
	    body: "if(x!==y){return false}",
	    localVars: [],
	    thisVars: [] },
	  post: { args: [], localVars: [], thisVars: [], body: "return true" },
	  funcName: "equals"
	});

/***/ },
/* 43 */
/*!**************************************!*\
  !*** ./~/cwise-compiler/compiler.js ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var createThunk = __webpack_require__(/*! ./lib/thunk.js */ 44);

	function Procedure() {
	  this.argTypes = [];
	  this.shimArgs = [];
	  this.arrayArgs = [];
	  this.arrayBlockIndices = [];
	  this.scalarArgs = [];
	  this.offsetArgs = [];
	  this.offsetArgIndex = [];
	  this.indexArgs = [];
	  this.shapeArgs = [];
	  this.funcName = "";
	  this.pre = null;
	  this.body = null;
	  this.post = null;
	  this.debug = false;
	}

	function compileCwise(user_args) {
	  //Create procedure
	  var proc = new Procedure();

	  //Parse blocks
	  proc.pre = user_args.pre;
	  proc.body = user_args.body;
	  proc.post = user_args.post;

	  //Parse arguments
	  var proc_args = user_args.args.slice(0);
	  proc.argTypes = proc_args;
	  for (var i = 0; i < proc_args.length; ++i) {
	    var arg_type = proc_args[i];
	    if (arg_type === "array" || (typeof arg_type === "undefined" ? "undefined" : _typeof(arg_type)) === "object" && arg_type.blockIndices) {
	      proc.argTypes[i] = "array";
	      proc.arrayArgs.push(i);
	      proc.arrayBlockIndices.push(arg_type.blockIndices ? arg_type.blockIndices : 0);
	      proc.shimArgs.push("array" + i);
	      if (i < proc.pre.args.length && proc.pre.args[i].count > 0) {
	        throw new Error("cwise: pre() block may not reference array args");
	      }
	      if (i < proc.post.args.length && proc.post.args[i].count > 0) {
	        throw new Error("cwise: post() block may not reference array args");
	      }
	    } else if (arg_type === "scalar") {
	      proc.scalarArgs.push(i);
	      proc.shimArgs.push("scalar" + i);
	    } else if (arg_type === "index") {
	      proc.indexArgs.push(i);
	      if (i < proc.pre.args.length && proc.pre.args[i].count > 0) {
	        throw new Error("cwise: pre() block may not reference array index");
	      }
	      if (i < proc.body.args.length && proc.body.args[i].lvalue) {
	        throw new Error("cwise: body() block may not write to array index");
	      }
	      if (i < proc.post.args.length && proc.post.args[i].count > 0) {
	        throw new Error("cwise: post() block may not reference array index");
	      }
	    } else if (arg_type === "shape") {
	      proc.shapeArgs.push(i);
	      if (i < proc.pre.args.length && proc.pre.args[i].lvalue) {
	        throw new Error("cwise: pre() block may not write to array shape");
	      }
	      if (i < proc.body.args.length && proc.body.args[i].lvalue) {
	        throw new Error("cwise: body() block may not write to array shape");
	      }
	      if (i < proc.post.args.length && proc.post.args[i].lvalue) {
	        throw new Error("cwise: post() block may not write to array shape");
	      }
	    } else if ((typeof arg_type === "undefined" ? "undefined" : _typeof(arg_type)) === "object" && arg_type.offset) {
	      proc.argTypes[i] = "offset";
	      proc.offsetArgs.push({ array: arg_type.array, offset: arg_type.offset });
	      proc.offsetArgIndex.push(i);
	    } else {
	      throw new Error("cwise: Unknown argument type " + proc_args[i]);
	    }
	  }

	  //Make sure at least one array argument was specified
	  if (proc.arrayArgs.length <= 0) {
	    throw new Error("cwise: No array arguments specified");
	  }

	  //Make sure arguments are correct
	  if (proc.pre.args.length > proc_args.length) {
	    throw new Error("cwise: Too many arguments in pre() block");
	  }
	  if (proc.body.args.length > proc_args.length) {
	    throw new Error("cwise: Too many arguments in body() block");
	  }
	  if (proc.post.args.length > proc_args.length) {
	    throw new Error("cwise: Too many arguments in post() block");
	  }

	  //Check debug flag
	  proc.debug = !!user_args.printCode || !!user_args.debug;

	  //Retrieve name
	  proc.funcName = user_args.funcName || "cwise";

	  //Read in block size
	  proc.blockSize = user_args.blockSize || 64;

	  return createThunk(proc);
	}

	module.exports = compileCwise;

/***/ },
/* 44 */
/*!***************************************!*\
  !*** ./~/cwise-compiler/lib/thunk.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	// The function below is called when constructing a cwise function object, and does the following:
	// A function object is constructed which accepts as argument a compilation function and returns another function.
	// It is this other function that is eventually returned by createThunk, and this function is the one that actually
	// checks whether a certain pattern of arguments has already been used before and compiles new loops as needed.
	// The compilation passed to the first function object is used for compiling new functions.
	// Once this function object is created, it is called with compile as argument, where the first argument of compile
	// is bound to "proc" (essentially containing a preprocessed version of the user arguments to cwise).
	// So createThunk roughly works like this:
	// function createThunk(proc) {
	//   var thunk = function(compileBound) {
	//     var CACHED = {}
	//     return function(arrays and scalars) {
	//       if (dtype and order of arrays in CACHED) {
	//         var func = CACHED[dtype and order of arrays]
	//       } else {
	//         var func = CACHED[dtype and order of arrays] = compileBound(dtype and order of arrays)
	//       }
	//       return func(arrays and scalars)
	//     }
	//   }
	//   return thunk(compile.bind1(proc))
	// }

	var compile = __webpack_require__(/*! ./compile.js */ 45);

	function createThunk(proc) {
	  var code = ["'use strict'", "var CACHED={}"];
	  var vars = [];
	  var thunkName = proc.funcName + "_cwise_thunk";

	  //Build thunk
	  code.push(["return function ", thunkName, "(", proc.shimArgs.join(","), "){"].join(""));
	  var typesig = [];
	  var string_typesig = [];
	  var proc_args = [["array", proc.arrayArgs[0], ".shape.slice(", // Slice shape so that we only retain the shape over which we iterate (which gets passed to the cwise operator as SS).
	  Math.max(0, proc.arrayBlockIndices[0]), proc.arrayBlockIndices[0] < 0 ? "," + proc.arrayBlockIndices[0] + ")" : ")"].join("")];
	  var shapeLengthConditions = [],
	      shapeConditions = [];
	  // Process array arguments
	  for (var i = 0; i < proc.arrayArgs.length; ++i) {
	    var j = proc.arrayArgs[i];
	    vars.push(["t", j, "=array", j, ".dtype,", "r", j, "=array", j, ".order"].join(""));
	    typesig.push("t" + j);
	    typesig.push("r" + j);
	    string_typesig.push("t" + j);
	    string_typesig.push("r" + j + ".join()");
	    proc_args.push("array" + j + ".data");
	    proc_args.push("array" + j + ".stride");
	    proc_args.push("array" + j + ".offset|0");
	    if (i > 0) {
	      // Gather conditions to check for shape equality (ignoring block indices)
	      shapeLengthConditions.push("array" + proc.arrayArgs[0] + ".shape.length===array" + j + ".shape.length+" + (Math.abs(proc.arrayBlockIndices[0]) - Math.abs(proc.arrayBlockIndices[i])));
	      shapeConditions.push("array" + proc.arrayArgs[0] + ".shape[shapeIndex+" + Math.max(0, proc.arrayBlockIndices[0]) + "]===array" + j + ".shape[shapeIndex+" + Math.max(0, proc.arrayBlockIndices[i]) + "]");
	    }
	  }
	  // Check for shape equality
	  if (proc.arrayArgs.length > 1) {
	    code.push("if (!(" + shapeLengthConditions.join(" && ") + ")) throw new Error('cwise: Arrays do not all have the same dimensionality!')");
	    code.push("for(var shapeIndex=array" + proc.arrayArgs[0] + ".shape.length-" + Math.abs(proc.arrayBlockIndices[0]) + "; shapeIndex-->0;) {");
	    code.push("if (!(" + shapeConditions.join(" && ") + ")) throw new Error('cwise: Arrays do not all have the same shape!')");
	    code.push("}");
	  }
	  // Process scalar arguments
	  for (var i = 0; i < proc.scalarArgs.length; ++i) {
	    proc_args.push("scalar" + proc.scalarArgs[i]);
	  }
	  // Check for cached function (and if not present, generate it)
	  vars.push(["type=[", string_typesig.join(","), "].join()"].join(""));
	  vars.push("proc=CACHED[type]");
	  code.push("var " + vars.join(","));

	  code.push(["if(!proc){", "CACHED[type]=proc=compile([", typesig.join(","), "])}", "return proc(", proc_args.join(","), ")}"].join(""));

	  if (proc.debug) {
	    console.log("-----Generated thunk:\n" + code.join("\n") + "\n----------");
	  }

	  //Compile thunk
	  var thunk = new Function("compile", code.join("\n"));
	  return thunk(compile.bind(undefined, proc));
	}

	module.exports = createThunk;

/***/ },
/* 45 */
/*!*****************************************!*\
  !*** ./~/cwise-compiler/lib/compile.js ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var uniq = __webpack_require__(/*! uniq */ 46);

	// This function generates very simple loops analogous to how you typically traverse arrays (the outermost loop corresponds to the slowest changing index, the innermost loop to the fastest changing index)
	// TODO: If two arrays have the same strides (and offsets) there is potential for decreasing the number of "pointers" and related variables. The drawback is that the type signature would become more specific and that there would thus be less potential for caching, but it might still be worth it, especially when dealing with large numbers of arguments.
	function innerFill(order, proc, body) {
	  var dimension = order.length,
	      nargs = proc.arrayArgs.length,
	      has_index = proc.indexArgs.length > 0,
	      code = [],
	      vars = [],
	      idx = 0,
	      pidx = 0,
	      i,
	      j;
	  for (i = 0; i < dimension; ++i) {
	    // Iteration variables
	    vars.push(["i", i, "=0"].join(""));
	  }
	  //Compute scan deltas
	  for (j = 0; j < nargs; ++j) {
	    for (i = 0; i < dimension; ++i) {
	      pidx = idx;
	      idx = order[i];
	      if (i === 0) {
	        // The innermost/fastest dimension's delta is simply its stride
	        vars.push(["d", j, "s", i, "=t", j, "p", idx].join(""));
	      } else {
	        // For other dimensions the delta is basically the stride minus something which essentially "rewinds" the previous (more inner) dimension
	        vars.push(["d", j, "s", i, "=(t", j, "p", idx, "-s", pidx, "*t", j, "p", pidx, ")"].join(""));
	      }
	    }
	  }
	  code.push("var " + vars.join(","));
	  //Scan loop
	  for (i = dimension - 1; i >= 0; --i) {
	    // Start at largest stride and work your way inwards
	    idx = order[i];
	    code.push(["for(i", i, "=0;i", i, "<s", idx, ";++i", i, "){"].join(""));
	  }
	  //Push body of inner loop
	  code.push(body);
	  //Advance scan pointers
	  for (i = 0; i < dimension; ++i) {
	    pidx = idx;
	    idx = order[i];
	    for (j = 0; j < nargs; ++j) {
	      code.push(["p", j, "+=d", j, "s", i].join(""));
	    }
	    if (has_index) {
	      if (i > 0) {
	        code.push(["index[", pidx, "]-=s", pidx].join(""));
	      }
	      code.push(["++index[", idx, "]"].join(""));
	    }
	    code.push("}");
	  }
	  return code.join("\n");
	}

	// Generate "outer" loops that loop over blocks of data, applying "inner" loops to the blocks by manipulating the local variables in such a way that the inner loop only "sees" the current block.
	// TODO: If this is used, then the previous declaration (done by generateCwiseOp) of s* is essentially unnecessary.
	//       I believe the s* are not used elsewhere (in particular, I don't think they're used in the pre/post parts and "shape" is defined independently), so it would be possible to make defining the s* dependent on what loop method is being used.
	function outerFill(matched, order, proc, body) {
	  var dimension = order.length,
	      nargs = proc.arrayArgs.length,
	      blockSize = proc.blockSize,
	      has_index = proc.indexArgs.length > 0,
	      code = [];
	  for (var i = 0; i < nargs; ++i) {
	    code.push(["var offset", i, "=p", i].join(""));
	  }
	  //Generate loops for unmatched dimensions
	  // The order in which these dimensions are traversed is fairly arbitrary (from small stride to large stride, for the first argument)
	  // TODO: It would be nice if the order in which these loops are placed would also be somehow "optimal" (at the very least we should check that it really doesn't hurt us if they're not).
	  for (var i = matched; i < dimension; ++i) {
	    code.push(["for(var j" + i + "=SS[", order[i], "]|0;j", i, ">0;){"].join("")); // Iterate back to front
	    code.push(["if(j", i, "<", blockSize, "){"].join("")); // Either decrease j by blockSize (s = blockSize), or set it to zero (after setting s = j).
	    code.push(["s", order[i], "=j", i].join(""));
	    code.push(["j", i, "=0"].join(""));
	    code.push(["}else{s", order[i], "=", blockSize].join(""));
	    code.push(["j", i, "-=", blockSize, "}"].join(""));
	    if (has_index) {
	      code.push(["index[", order[i], "]=j", i].join(""));
	    }
	  }
	  for (var i = 0; i < nargs; ++i) {
	    var indexStr = ["offset" + i];
	    for (var j = matched; j < dimension; ++j) {
	      indexStr.push(["j", j, "*t", i, "p", order[j]].join(""));
	    }
	    code.push(["p", i, "=(", indexStr.join("+"), ")"].join(""));
	  }
	  code.push(innerFill(order, proc, body));
	  for (var i = matched; i < dimension; ++i) {
	    code.push("}");
	  }
	  return code.join("\n");
	}

	//Count the number of compatible inner orders
	// This is the length of the longest common prefix of the arrays in orders.
	// Each array in orders lists the dimensions of the correspond ndarray in order of increasing stride.
	// This is thus the maximum number of dimensions that can be efficiently traversed by simple nested loops for all arrays.
	function countMatches(orders) {
	  var matched = 0,
	      dimension = orders[0].length;
	  while (matched < dimension) {
	    for (var j = 1; j < orders.length; ++j) {
	      if (orders[j][matched] !== orders[0][matched]) {
	        return matched;
	      }
	    }
	    ++matched;
	  }
	  return matched;
	}

	//Processes a block according to the given data types
	// Replaces variable names by different ones, either "local" ones (that are then ferried in and out of the given array) or ones matching the arguments that the function performing the ultimate loop will accept.
	function processBlock(block, proc, dtypes) {
	  var code = block.body;
	  var pre = [];
	  var post = [];
	  for (var i = 0; i < block.args.length; ++i) {
	    var carg = block.args[i];
	    if (carg.count <= 0) {
	      continue;
	    }
	    var re = new RegExp(carg.name, "g");
	    var ptrStr = "";
	    var arrNum = proc.arrayArgs.indexOf(i);
	    switch (proc.argTypes[i]) {
	      case "offset":
	        var offArgIndex = proc.offsetArgIndex.indexOf(i);
	        var offArg = proc.offsetArgs[offArgIndex];
	        arrNum = offArg.array;
	        ptrStr = "+q" + offArgIndex; // Adds offset to the "pointer" in the array
	      case "array":
	        ptrStr = "p" + arrNum + ptrStr;
	        var localStr = "l" + i;
	        var arrStr = "a" + arrNum;
	        if (proc.arrayBlockIndices[arrNum] === 0) {
	          // Argument to body is just a single value from this array
	          if (carg.count === 1) {
	            // Argument/array used only once(?)
	            if (dtypes[arrNum] === "generic") {
	              if (carg.lvalue) {
	                pre.push(["var ", localStr, "=", arrStr, ".get(", ptrStr, ")"].join("")); // Is this necessary if the argument is ONLY used as an lvalue? (keep in mind that we can have a += something, so we would actually need to check carg.rvalue)
	                code = code.replace(re, localStr);
	                post.push([arrStr, ".set(", ptrStr, ",", localStr, ")"].join(""));
	              } else {
	                code = code.replace(re, [arrStr, ".get(", ptrStr, ")"].join(""));
	              }
	            } else {
	              code = code.replace(re, [arrStr, "[", ptrStr, "]"].join(""));
	            }
	          } else if (dtypes[arrNum] === "generic") {
	            pre.push(["var ", localStr, "=", arrStr, ".get(", ptrStr, ")"].join("")); // TODO: Could we optimize by checking for carg.rvalue?
	            code = code.replace(re, localStr);
	            if (carg.lvalue) {
	              post.push([arrStr, ".set(", ptrStr, ",", localStr, ")"].join(""));
	            }
	          } else {
	            pre.push(["var ", localStr, "=", arrStr, "[", ptrStr, "]"].join("")); // TODO: Could we optimize by checking for carg.rvalue?
	            code = code.replace(re, localStr);
	            if (carg.lvalue) {
	              post.push([arrStr, "[", ptrStr, "]=", localStr].join(""));
	            }
	          }
	        } else {
	          // Argument to body is a "block"
	          var reStrArr = [carg.name],
	              ptrStrArr = [ptrStr];
	          for (var j = 0; j < Math.abs(proc.arrayBlockIndices[arrNum]); j++) {
	            reStrArr.push("\\s*\\[([^\\]]+)\\]");
	            ptrStrArr.push("$" + (j + 1) + "*t" + arrNum + "b" + j); // Matched index times stride
	          }
	          re = new RegExp(reStrArr.join(""), "g");
	          ptrStr = ptrStrArr.join("+");
	          if (dtypes[arrNum] === "generic") {
	            /*if(carg.lvalue) {
	              pre.push(["var ", localStr, "=", arrStr, ".get(", ptrStr, ")"].join("")) // Is this necessary if the argument is ONLY used as an lvalue? (keep in mind that we can have a += something, so we would actually need to check carg.rvalue)
	              code = code.replace(re, localStr)
	              post.push([arrStr, ".set(", ptrStr, ",", localStr,")"].join(""))
	            } else {
	              code = code.replace(re, [arrStr, ".get(", ptrStr, ")"].join(""))
	            }*/
	            throw new Error("cwise: Generic arrays not supported in combination with blocks!");
	          } else {
	            // This does not produce any local variables, even if variables are used multiple times. It would be possible to do so, but it would complicate things quite a bit.
	            code = code.replace(re, [arrStr, "[", ptrStr, "]"].join(""));
	          }
	        }
	        break;
	      case "scalar":
	        code = code.replace(re, "Y" + proc.scalarArgs.indexOf(i));
	        break;
	      case "index":
	        code = code.replace(re, "index");
	        break;
	      case "shape":
	        code = code.replace(re, "shape");
	        break;
	    }
	  }
	  return [pre.join("\n"), code, post.join("\n")].join("\n").trim();
	}

	function typeSummary(dtypes) {
	  var summary = new Array(dtypes.length);
	  var allEqual = true;
	  for (var i = 0; i < dtypes.length; ++i) {
	    var t = dtypes[i];
	    var digits = t.match(/\d+/);
	    if (!digits) {
	      digits = "";
	    } else {
	      digits = digits[0];
	    }
	    if (t.charAt(0) === 0) {
	      summary[i] = "u" + t.charAt(1) + digits;
	    } else {
	      summary[i] = t.charAt(0) + digits;
	    }
	    if (i > 0) {
	      allEqual = allEqual && summary[i] === summary[i - 1];
	    }
	  }
	  if (allEqual) {
	    return summary[0];
	  }
	  return summary.join("");
	}

	//Generates a cwise operator
	function generateCWiseOp(proc, typesig) {

	  //Compute dimension
	  // Arrays get put first in typesig, and there are two entries per array (dtype and order), so this gets the number of dimensions in the first array arg.
	  var dimension = typesig[1].length - Math.abs(proc.arrayBlockIndices[0]) | 0;
	  var orders = new Array(proc.arrayArgs.length);
	  var dtypes = new Array(proc.arrayArgs.length);
	  for (var i = 0; i < proc.arrayArgs.length; ++i) {
	    dtypes[i] = typesig[2 * i];
	    orders[i] = typesig[2 * i + 1];
	  }

	  //Determine where block and loop indices start and end
	  var blockBegin = [],
	      blockEnd = []; // These indices are exposed as blocks
	  var loopBegin = [],
	      loopEnd = []; // These indices are iterated over
	  var loopOrders = []; // orders restricted to the loop indices
	  for (var i = 0; i < proc.arrayArgs.length; ++i) {
	    if (proc.arrayBlockIndices[i] < 0) {
	      loopBegin.push(0);
	      loopEnd.push(dimension);
	      blockBegin.push(dimension);
	      blockEnd.push(dimension + proc.arrayBlockIndices[i]);
	    } else {
	      loopBegin.push(proc.arrayBlockIndices[i]); // Non-negative
	      loopEnd.push(proc.arrayBlockIndices[i] + dimension);
	      blockBegin.push(0);
	      blockEnd.push(proc.arrayBlockIndices[i]);
	    }
	    var newOrder = [];
	    for (var j = 0; j < orders[i].length; j++) {
	      if (loopBegin[i] <= orders[i][j] && orders[i][j] < loopEnd[i]) {
	        newOrder.push(orders[i][j] - loopBegin[i]); // If this is a loop index, put it in newOrder, subtracting loopBegin, to make sure that all loopOrders are using a common set of indices.
	      }
	    }
	    loopOrders.push(newOrder);
	  }

	  //First create arguments for procedure
	  var arglist = ["SS"]; // SS is the overall shape over which we iterate
	  var code = ["'use strict'"];
	  var vars = [];

	  for (var j = 0; j < dimension; ++j) {
	    vars.push(["s", j, "=SS[", j, "]"].join("")); // The limits for each dimension.
	  }
	  for (var i = 0; i < proc.arrayArgs.length; ++i) {
	    arglist.push("a" + i); // Actual data array
	    arglist.push("t" + i); // Strides
	    arglist.push("p" + i); // Offset in the array at which the data starts (also used for iterating over the data)

	    for (var j = 0; j < dimension; ++j) {
	      // Unpack the strides into vars for looping
	      vars.push(["t", i, "p", j, "=t", i, "[", loopBegin[i] + j, "]"].join(""));
	    }

	    for (var j = 0; j < Math.abs(proc.arrayBlockIndices[i]); ++j) {
	      // Unpack the strides into vars for block iteration
	      vars.push(["t", i, "b", j, "=t", i, "[", blockBegin[i] + j, "]"].join(""));
	    }
	  }
	  for (var i = 0; i < proc.scalarArgs.length; ++i) {
	    arglist.push("Y" + i);
	  }
	  if (proc.shapeArgs.length > 0) {
	    vars.push("shape=SS.slice(0)"); // Makes the shape over which we iterate available to the user defined functions (so you can use width/height for example)
	  }
	  if (proc.indexArgs.length > 0) {
	    // Prepare an array to keep track of the (logical) indices, initialized to dimension zeroes.
	    var zeros = new Array(dimension);
	    for (var i = 0; i < dimension; ++i) {
	      zeros[i] = "0";
	    }
	    vars.push(["index=[", zeros.join(","), "]"].join(""));
	  }
	  for (var i = 0; i < proc.offsetArgs.length; ++i) {
	    // Offset arguments used for stencil operations
	    var off_arg = proc.offsetArgs[i];
	    var init_string = [];
	    for (var j = 0; j < off_arg.offset.length; ++j) {
	      if (off_arg.offset[j] === 0) {
	        continue;
	      } else if (off_arg.offset[j] === 1) {
	        init_string.push(["t", off_arg.array, "p", j].join(""));
	      } else {
	        init_string.push([off_arg.offset[j], "*t", off_arg.array, "p", j].join(""));
	      }
	    }
	    if (init_string.length === 0) {
	      vars.push("q" + i + "=0");
	    } else {
	      vars.push(["q", i, "=", init_string.join("+")].join(""));
	    }
	  }

	  //Prepare this variables
	  var thisVars = uniq([].concat(proc.pre.thisVars).concat(proc.body.thisVars).concat(proc.post.thisVars));
	  vars = vars.concat(thisVars);
	  code.push("var " + vars.join(","));
	  for (var i = 0; i < proc.arrayArgs.length; ++i) {
	    code.push("p" + i + "|=0");
	  }

	  //Inline prelude
	  if (proc.pre.body.length > 3) {
	    code.push(processBlock(proc.pre, proc, dtypes));
	  }

	  //Process body
	  var body = processBlock(proc.body, proc, dtypes);
	  var matched = countMatches(loopOrders);
	  if (matched < dimension) {
	    code.push(outerFill(matched, loopOrders[0], proc, body)); // TODO: Rather than passing loopOrders[0], it might be interesting to look at passing an order that represents the majority of the arguments for example.
	  } else {
	      code.push(innerFill(loopOrders[0], proc, body));
	    }

	  //Inline epilog
	  if (proc.post.body.length > 3) {
	    code.push(processBlock(proc.post, proc, dtypes));
	  }

	  if (proc.debug) {
	    console.log("-----Generated cwise routine for ", typesig, ":\n" + code.join("\n") + "\n----------");
	  }

	  var loopName = [proc.funcName || "unnamed", "_cwise_loop_", orders[0].join("s"), "m", matched, typeSummary(dtypes)].join("");
	  var f = new Function(["function ", loopName, "(", arglist.join(","), "){", code.join("\n"), "} return ", loopName].join(""));
	  return f();
	}
	module.exports = generateCWiseOp;

/***/ },
/* 46 */
/*!************************!*\
  !*** ./~/uniq/uniq.js ***!
  \************************/
/***/ function(module, exports) {

	"use strict";

	function unique_pred(list, compare) {
	  var ptr = 1,
	      len = list.length,
	      a = list[0],
	      b = list[0];
	  for (var i = 1; i < len; ++i) {
	    b = a;
	    a = list[i];
	    if (compare(a, b)) {
	      if (i === ptr) {
	        ptr++;
	        continue;
	      }
	      list[ptr++] = a;
	    }
	  }
	  list.length = ptr;
	  return list;
	}

	function unique_eq(list) {
	  var ptr = 1,
	      len = list.length,
	      a = list[0],
	      b = list[0];
	  for (var i = 1; i < len; ++i, b = a) {
	    b = a;
	    a = list[i];
	    if (a !== b) {
	      if (i === ptr) {
	        ptr++;
	        continue;
	      }
	      list[ptr++] = a;
	    }
	  }
	  list.length = ptr;
	  return list;
	}

	function unique(list, compare, sorted) {
	  if (list.length === 0) {
	    return list;
	  }
	  if (compare) {
	    if (!sorted) {
	      list.sort(compare);
	    }
	    return unique_pred(list, compare);
	  }
	  if (!sorted) {
	    list.sort();
	  }
	  return unique_eq(list);
	}

	module.exports = unique;

/***/ },
/* 47 */
/*!******************************!*\
  !*** ./~/ndarray/ndarray.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var iota = __webpack_require__(/*! iota-array */ 48);
	var isBuffer = __webpack_require__(/*! is-buffer */ 49);

	var hasTypedArrays = typeof Float64Array !== "undefined";

	function compare1st(a, b) {
	  return a[0] - b[0];
	}

	function order() {
	  var stride = this.stride;
	  var terms = new Array(stride.length);
	  var i;
	  for (i = 0; i < terms.length; ++i) {
	    terms[i] = [Math.abs(stride[i]), i];
	  }
	  terms.sort(compare1st);
	  var result = new Array(terms.length);
	  for (i = 0; i < result.length; ++i) {
	    result[i] = terms[i][1];
	  }
	  return result;
	}

	function compileConstructor(dtype, dimension) {
	  var className = ["View", dimension, "d", dtype].join("");
	  if (dimension < 0) {
	    className = "View_Nil" + dtype;
	  }
	  var useGetters = dtype === "generic";

	  if (dimension === -1) {
	    //Special case for trivial arrays
	    var code = "function " + className + "(a){this.data=a;};\
	var proto=" + className + ".prototype;\
	proto.dtype='" + dtype + "';\
	proto.index=function(){return -1};\
	proto.size=0;\
	proto.dimension=-1;\
	proto.shape=proto.stride=proto.order=[];\
	proto.lo=proto.hi=proto.transpose=proto.step=\
	function(){return new " + className + "(this.data);};\
	proto.get=proto.set=function(){};\
	proto.pick=function(){return null};\
	return function construct_" + className + "(a){return new " + className + "(a);}";
	    var procedure = new Function(code);
	    return procedure();
	  } else if (dimension === 0) {
	    //Special case for 0d arrays
	    var code = "function " + className + "(a,d) {\
	this.data = a;\
	this.offset = d\
	};\
	var proto=" + className + ".prototype;\
	proto.dtype='" + dtype + "';\
	proto.index=function(){return this.offset};\
	proto.dimension=0;\
	proto.size=1;\
	proto.shape=\
	proto.stride=\
	proto.order=[];\
	proto.lo=\
	proto.hi=\
	proto.transpose=\
	proto.step=function " + className + "_copy() {\
	return new " + className + "(this.data,this.offset)\
	};\
	proto.pick=function " + className + "_pick(){\
	return TrivialArray(this.data);\
	};\
	proto.valueOf=proto.get=function " + className + "_get(){\
	return " + (useGetters ? "this.data.get(this.offset)" : "this.data[this.offset]") + "};\
	proto.set=function " + className + "_set(v){\
	return " + (useGetters ? "this.data.set(this.offset,v)" : "this.data[this.offset]=v") + "\
	};\
	return function construct_" + className + "(a,b,c,d){return new " + className + "(a,d)}";
	    var procedure = new Function("TrivialArray", code);
	    return procedure(CACHED_CONSTRUCTORS[dtype][0]);
	  }

	  var code = ["'use strict'"];

	  //Create constructor for view
	  var indices = iota(dimension);
	  var args = indices.map(function (i) {
	    return "i" + i;
	  });
	  var index_str = "this.offset+" + indices.map(function (i) {
	    return "this.stride[" + i + "]*i" + i;
	  }).join("+");
	  var shapeArg = indices.map(function (i) {
	    return "b" + i;
	  }).join(",");
	  var strideArg = indices.map(function (i) {
	    return "c" + i;
	  }).join(",");
	  code.push("function " + className + "(a," + shapeArg + "," + strideArg + ",d){this.data=a", "this.shape=[" + shapeArg + "]", "this.stride=[" + strideArg + "]", "this.offset=d|0}", "var proto=" + className + ".prototype", "proto.dtype='" + dtype + "'", "proto.dimension=" + dimension);

	  //view.size:
	  code.push("Object.defineProperty(proto,'size',{get:function " + className + "_size(){\
	return " + indices.map(function (i) {
	    return "this.shape[" + i + "]";
	  }).join("*"), "}})");

	  //view.order:
	  if (dimension === 1) {
	    code.push("proto.order=[0]");
	  } else {
	    code.push("Object.defineProperty(proto,'order',{get:");
	    if (dimension < 4) {
	      code.push("function " + className + "_order(){");
	      if (dimension === 2) {
	        code.push("return (Math.abs(this.stride[0])>Math.abs(this.stride[1]))?[1,0]:[0,1]}})");
	      } else if (dimension === 3) {
	        code.push("var s0=Math.abs(this.stride[0]),s1=Math.abs(this.stride[1]),s2=Math.abs(this.stride[2]);\
	if(s0>s1){\
	if(s1>s2){\
	return [2,1,0];\
	}else if(s0>s2){\
	return [1,2,0];\
	}else{\
	return [1,0,2];\
	}\
	}else if(s0>s2){\
	return [2,0,1];\
	}else if(s2>s1){\
	return [0,1,2];\
	}else{\
	return [0,2,1];\
	}}})");
	      }
	    } else {
	      code.push("ORDER})");
	    }
	  }

	  //view.set(i0, ..., v):
	  code.push("proto.set=function " + className + "_set(" + args.join(",") + ",v){");
	  if (useGetters) {
	    code.push("return this.data.set(" + index_str + ",v)}");
	  } else {
	    code.push("return this.data[" + index_str + "]=v}");
	  }

	  //view.get(i0, ...):
	  code.push("proto.get=function " + className + "_get(" + args.join(",") + "){");
	  if (useGetters) {
	    code.push("return this.data.get(" + index_str + ")}");
	  } else {
	    code.push("return this.data[" + index_str + "]}");
	  }

	  //view.index:
	  code.push("proto.index=function " + className + "_index(", args.join(), "){return " + index_str + "}");

	  //view.hi():
	  code.push("proto.hi=function " + className + "_hi(" + args.join(",") + "){return new " + className + "(this.data," + indices.map(function (i) {
	    return ["(typeof i", i, "!=='number'||i", i, "<0)?this.shape[", i, "]:i", i, "|0"].join("");
	  }).join(",") + "," + indices.map(function (i) {
	    return "this.stride[" + i + "]";
	  }).join(",") + ",this.offset)}");

	  //view.lo():
	  var a_vars = indices.map(function (i) {
	    return "a" + i + "=this.shape[" + i + "]";
	  });
	  var c_vars = indices.map(function (i) {
	    return "c" + i + "=this.stride[" + i + "]";
	  });
	  code.push("proto.lo=function " + className + "_lo(" + args.join(",") + "){var b=this.offset,d=0," + a_vars.join(",") + "," + c_vars.join(","));
	  for (var i = 0; i < dimension; ++i) {
	    code.push("if(typeof i" + i + "==='number'&&i" + i + ">=0){\
	d=i" + i + "|0;\
	b+=c" + i + "*d;\
	a" + i + "-=d}");
	  }
	  code.push("return new " + className + "(this.data," + indices.map(function (i) {
	    return "a" + i;
	  }).join(",") + "," + indices.map(function (i) {
	    return "c" + i;
	  }).join(",") + ",b)}");

	  //view.step():
	  code.push("proto.step=function " + className + "_step(" + args.join(",") + "){var " + indices.map(function (i) {
	    return "a" + i + "=this.shape[" + i + "]";
	  }).join(",") + "," + indices.map(function (i) {
	    return "b" + i + "=this.stride[" + i + "]";
	  }).join(",") + ",c=this.offset,d=0,ceil=Math.ceil");
	  for (var i = 0; i < dimension; ++i) {
	    code.push("if(typeof i" + i + "==='number'){\
	d=i" + i + "|0;\
	if(d<0){\
	c+=b" + i + "*(a" + i + "-1);\
	a" + i + "=ceil(-a" + i + "/d)\
	}else{\
	a" + i + "=ceil(a" + i + "/d)\
	}\
	b" + i + "*=d\
	}");
	  }
	  code.push("return new " + className + "(this.data," + indices.map(function (i) {
	    return "a" + i;
	  }).join(",") + "," + indices.map(function (i) {
	    return "b" + i;
	  }).join(",") + ",c)}");

	  //view.transpose():
	  var tShape = new Array(dimension);
	  var tStride = new Array(dimension);
	  for (var i = 0; i < dimension; ++i) {
	    tShape[i] = "a[i" + i + "]";
	    tStride[i] = "b[i" + i + "]";
	  }
	  code.push("proto.transpose=function " + className + "_transpose(" + args + "){" + args.map(function (n, idx) {
	    return n + "=(" + n + "===undefined?" + idx + ":" + n + "|0)";
	  }).join(";"), "var a=this.shape,b=this.stride;return new " + className + "(this.data," + tShape.join(",") + "," + tStride.join(",") + ",this.offset)}");

	  //view.pick():
	  code.push("proto.pick=function " + className + "_pick(" + args + "){var a=[],b=[],c=this.offset");
	  for (var i = 0; i < dimension; ++i) {
	    code.push("if(typeof i" + i + "==='number'&&i" + i + ">=0){c=(c+this.stride[" + i + "]*i" + i + ")|0}else{a.push(this.shape[" + i + "]);b.push(this.stride[" + i + "])}");
	  }
	  code.push("var ctor=CTOR_LIST[a.length+1];return ctor(this.data,a,b,c)}");

	  //Add return statement
	  code.push("return function construct_" + className + "(data,shape,stride,offset){return new " + className + "(data," + indices.map(function (i) {
	    return "shape[" + i + "]";
	  }).join(",") + "," + indices.map(function (i) {
	    return "stride[" + i + "]";
	  }).join(",") + ",offset)}");

	  //Compile procedure
	  var procedure = new Function("CTOR_LIST", "ORDER", code.join("\n"));
	  return procedure(CACHED_CONSTRUCTORS[dtype], order);
	}

	function arrayDType(data) {
	  if (isBuffer(data)) {
	    return "buffer";
	  }
	  if (hasTypedArrays) {
	    switch (Object.prototype.toString.call(data)) {
	      case "[object Float64Array]":
	        return "float64";
	      case "[object Float32Array]":
	        return "float32";
	      case "[object Int8Array]":
	        return "int8";
	      case "[object Int16Array]":
	        return "int16";
	      case "[object Int32Array]":
	        return "int32";
	      case "[object Uint8Array]":
	        return "uint8";
	      case "[object Uint16Array]":
	        return "uint16";
	      case "[object Uint32Array]":
	        return "uint32";
	      case "[object Uint8ClampedArray]":
	        return "uint8_clamped";
	    }
	  }
	  if (Array.isArray(data)) {
	    return "array";
	  }
	  return "generic";
	}

	var CACHED_CONSTRUCTORS = {
	  "float32": [],
	  "float64": [],
	  "int8": [],
	  "int16": [],
	  "int32": [],
	  "uint8": [],
	  "uint16": [],
	  "uint32": [],
	  "array": [],
	  "uint8_clamped": [],
	  "buffer": [],
	  "generic": []
	};(function () {
	  for (var id in CACHED_CONSTRUCTORS) {
	    CACHED_CONSTRUCTORS[id].push(compileConstructor(id, -1));
	  }
	});

	function wrappedNDArrayCtor(data, shape, stride, offset) {
	  if (data === undefined) {
	    var ctor = CACHED_CONSTRUCTORS.array[0];
	    return ctor([]);
	  } else if (typeof data === "number") {
	    data = [data];
	  }
	  if (shape === undefined) {
	    shape = [data.length];
	  }
	  var d = shape.length;
	  if (stride === undefined) {
	    stride = new Array(d);
	    for (var i = d - 1, sz = 1; i >= 0; --i) {
	      stride[i] = sz;
	      sz *= shape[i];
	    }
	  }
	  if (offset === undefined) {
	    offset = 0;
	    for (var i = 0; i < d; ++i) {
	      if (stride[i] < 0) {
	        offset -= (shape[i] - 1) * stride[i];
	      }
	    }
	  }
	  var dtype = arrayDType(data);
	  var ctor_list = CACHED_CONSTRUCTORS[dtype];
	  while (ctor_list.length <= d + 1) {
	    ctor_list.push(compileConstructor(dtype, ctor_list.length - 1));
	  }
	  var ctor = ctor_list[d + 1];
	  return ctor(data, shape, stride, offset);
	}

	module.exports = wrappedNDArrayCtor;

/***/ },
/* 48 */
/*!******************************!*\
  !*** ./~/iota-array/iota.js ***!
  \******************************/
/***/ function(module, exports) {

	"use strict";

	function iota(n) {
	  var result = new Array(n);
	  for (var i = 0; i < n; ++i) {
	    result[i] = i;
	  }
	  return result;
	}

	module.exports = iota;

/***/ },
/* 49 */
/*!******************************!*\
  !*** ./~/is-buffer/index.js ***!
  \******************************/
/***/ function(module, exports) {

	'use strict';

	/**
	 * Determine if an object is Buffer
	 *
	 * Author:   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * License:  MIT
	 *
	 * `npm install is-buffer`
	 */

	module.exports = function (obj) {
	  return !!(obj != null && (obj._isBuffer || // For Safari 5-7 (missing Object.prototype.constructor)
	  obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)));
	};

/***/ }
/******/ ]);