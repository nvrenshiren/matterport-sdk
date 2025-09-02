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
uniform sampler2D gridTexture;
uniform float gridSize;
uniform float cellSize;
uniform float radius;
uniform vec3 center;
varying vec4 vWorldPos;
varying vec2 vUv;
void main()
{
  float lineSize = 0.075;
  float fadeThreshold = radius;
  float fadeLength = 20.;
  float dx = vWorldPos.x - center.x;
  float dz = vWorldPos.z - center.z;
  float dist = sqrt(dx * dx + dz * dz);
  vec2 sampleCoords = vUv * (gridSize / cellSize);
  vec4 texColor = texture2D(gridTexture, sampleCoords);
  float fadeFactor = clamp(1. - (max(dist - fadeThreshold, 0.) / fadeLength), 0., 1.);
  texColor = texColor * fadeFactor;
  gl_FragColor = texColor;
}
