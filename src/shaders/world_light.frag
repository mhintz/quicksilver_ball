#extension GL_OES_standard_derivatives : enable

precision highp float;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)

uniform vec3 u_lightWorldPosition;

varying vec3 v_position;
varying vec4 v_camera_position;
varying vec3 v_normal;
varying vec3 v_world_normal;
varying vec3 v_screen_normal;
varying vec4 v_color;

struct Material {
  vec3 amb;
  vec3 diff;
  vec3 spec;
  float shine;
};

vec3 noisyvec(in vec3 sampl) {
  return (vec3(snoise3(sampl), snoise3(sampl + 1000.0), snoise3(sampl + 10000.0)) + 1.0) / 2.0;
}

void main() {
  const Material silver = Material(vec3(0.19225, 0.19225, 0.19225), vec3(0.50754, 0.50754, 0.50754), vec3(0.508273, 0.508273, 0.508273), 0.4 * 128.0);

  vec3 xvec = dFdx(v_position);
  vec3 yvec = dFdy(v_position);
  vec3 face_normal = normalize(cross(xvec, yvec));
  vec3 base_normal = normalize(v_world_normal);
  vec3 n_normal = mix(base_normal, face_normal, 0.65);

  vec3 to_light = normalize(u_lightWorldPosition - v_position);
  vec3 to_cam = normalize(- v_camera_position.xyz);

  float ambient_value = 1.0;
  float diffuse_value = max(dot(to_light, n_normal), 0.0);
  float diffuse_dropoff = pow(diffuse_value, 2.0);
  float spec_highlight = pow(max(dot(normalize(mix(to_light, to_cam, 0.5)), n_normal), 0.0), silver.shine);

  float light_facing = dot(to_light, n_normal);
  float chroma_clamp = 0.0;
  if (light_facing > -0.3 && light_facing < -0.05) { chroma_clamp = 1.0; }
  if (light_facing > 0.9 && light_facing < 0.95) { chroma_clamp = 1.0; }
  float chroma_value = pow(1.0 - diffuse_value, 2.0);
  vec3 chroma = abs(v_normal) * chroma_clamp * vec3(0.15, 0.4, 0.55) * 0.8;

  float noise_clamp = 0.0;
  if (light_facing > -0.85 && light_facing < -0.7) { noise_clamp = 1.0; }
  vec3 noisey_color = noisyvec(cos(n_normal) * sin(v_position)) * vec3(0.25, 0.68, 0.75) * 0.4 * noise_clamp;

  float alpha = v_color.a;

  vec3 combined_color = silver.amb * ambient_value + silver.diff * diffuse_dropoff + silver.spec * spec_highlight + chroma + noisey_color;
  gl_FragColor = vec4(combined_color, alpha);
}
