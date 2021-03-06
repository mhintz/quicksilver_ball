precision highp float; // Not necessary, but makes it explicit

uniform mat4 u_projectionMatrix;
uniform mat4 u_modelWorldMatrix;
uniform mat4 u_modelWorldMatrix_IT;
uniform mat4 u_worldViewMatrix;

attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec4 a_color;
attribute vec3 a_offset;

varying vec3 v_position;
varying vec4 v_camera_position;
varying vec3 v_normal;
varying vec3 v_world_normal;
varying vec3 v_screen_normal;
varying vec4 v_color;

void main() {
  vec4 vertexWorldPosition = u_modelWorldMatrix * vec4(a_position + a_offset, 1);
  // vec4 vertexWorldPosition = u_modelWorldMatrix * vec4(a_position, 1);
  gl_Position = u_projectionMatrix * u_worldViewMatrix * vertexWorldPosition;
  v_camera_position = u_worldViewMatrix * vertexWorldPosition;
  v_position = vertexWorldPosition.xyz;
  v_normal = a_normal;
  vec4 norm_world = u_modelWorldMatrix_IT * vec4(a_normal, 1);
  v_world_normal = norm_world.xyz;
  v_screen_normal = (u_worldViewMatrix * norm_world).xyz;
  v_color = a_color;
}
