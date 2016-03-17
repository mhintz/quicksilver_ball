precision highp float; // Not necessary, but makes it explicit

uniform mat4 u_projectionMatrix;
uniform mat4 u_modelWorldMatrix;
uniform mat4 u_modelWorldMatrix_IT;
uniform mat4 u_worldViewMatrix;

attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec4 a_color;

varying vec3 v_position;
varying vec3 v_normal;
varying vec4 v_color;

void main() {
  vec3 vertexWorldPosition = (u_modelWorldMatrix * vec4(a_position, 1)).xyz;
  gl_Position = u_projectionMatrix * u_worldViewMatrix * vec4(vertexWorldPosition, 1);
  v_position = vertexWorldPosition;
  v_normal = (u_modelWorldMatrix_IT * vec4(a_normal, 1)).xyz;
  v_color = a_color;
}
