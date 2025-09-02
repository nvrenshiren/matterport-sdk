precision highp float;
precision highp int;
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
vec3 closestPointToRay(vec3 point, vec3 origin, vec3 direction)
{
  vec3 d = point - origin;
  float D = dot(d, direction);
  return origin + D * direction;
}
vec3 rayIntersectsSphere(vec3 origin, float radius, vec3 rayOrigin, vec3 rayDirection)
{
  vec3 chordPoint = closestPointToRay(origin, rayOrigin, rayDirection);
  float D1 = length(rayOrigin - chordPoint);
  float D = length(chordPoint - origin);
  float D2 = sqrt(radius * radius - D * D);
  return rayOrigin + (D1 + D2) * rayDirection;
}

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
