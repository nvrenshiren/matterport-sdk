precision highp float;
precision highp int;
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
uniform vec3 color;
uniform float opacity;
uniform float maxDistance;
varying vec3 vWorldPosition;
void main()
{
  float distanceToCamera = distance(cameraPosition, vWorldPosition);
  float distanceBucketed = 1. - clamp(distanceToCamera / maxDistance, 0., 1.);
  if (opacity < 1.)
  {
    discard;
  }
  gl_FragColor = vec4(distanceBucketed, distanceBucketed, distanceBucketed, 1.);
}
