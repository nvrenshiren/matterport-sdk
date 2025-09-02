precision highp float;
precision highp int;
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
#define M_PI  3.14159265359
uniform samplerCube cubemap;
uniform float yaw;
varying vec2 vUv;
void main()
{
  vec2 uv = vUv;
  float theta = uv.x * 2. * M_PI + yaw;
  float phi = uv.y * M_PI;
  vec3 longitude = vec3(sin(theta), 1., -cos(theta));
  vec3 latitude = vec3(sin(phi), -cos(phi), sin(phi));
  vec3 dir = longitude * latitude;
  normalize(dir);
  gl_FragColor = vec4(textureCube(cubemap, dir).rgb, 1.);
}
