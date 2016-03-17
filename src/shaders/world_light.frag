precision highp float;

uniform vec3 u_lightWorldPosition;

varying vec3 v_position;
varying vec3 v_normal;
varying vec4 v_color;

void main() {
  vec3 n_normal = normalize(v_normal);
  vec3 tocamera = normalize(u_lightWorldPosition - v_position);
  // gl_FragColor = vec4(clamp(v_normal, 0.1, 1.0), 1.0);
  // gl_FragColor = v_color * vec4(v_normal, 1);
  // gl_FragColor = vec4(v_position, 1.0);
  float incidence = dot(tocamera, n_normal);
  gl_FragColor = vec4((0.15 + pow(clamp(incidence, 0., 1.), 2.5)) * v_color.rgb, 1.);
}
