precision highp float;
precision highp int;
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;
uniform vec3 cameraPosition;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
uniform vec2 resolution;
#ifdef INSTANCED
attribute mat4 instanceMatrix;
attribute vec3 stemVector;
attribute vec4 pinHeadMatrixCol0;
attribute vec4 pinHeadMatrixCol1;
attribute vec4 pinHeadMatrixCol2;
attribute vec4 pinHeadMatrixCol3;
attribute float instanceAlpha;
varying float alpha;
#else
uniform mat4 pinHeadMatrix;
#endif
#define PI  3.1415926538
void main()
{
  #ifdef INSTANCED
  vec3 pos = position * stemVector;
  mat4 modelViewProjMatrix = projectionMatrix * modelViewMatrix * instanceMatrix;
  mat4 pinHeadMatrix = mat4(pinHeadMatrixCol0, pinHeadMatrixCol1, pinHeadMatrixCol2, pinHeadMatrixCol3);
  alpha = instanceAlpha;
#else
  vec3 pos = position;
  mat4 modelViewProjMatrix = projectionMatrix * modelViewMatrix;
#endif
  vec3 fromOrigin = (vec3(0., 0., 0.) - pos);
  if (length(fromOrigin) < 1e-6)
  {
    gl_Position = modelViewProjMatrix * vec4(pos, 1.);
  }
  else
  {
    mat4 noteViewProj = projectionMatrix * viewMatrix * pinHeadMatrix;
    vec4 noteNDC = noteViewProj * vec4(0., 0., 0., 1.);
    noteNDC.xyz /= abs(noteNDC.w);
    vec4 discEdgeNDC = noteViewProj * vec4(0.5, 0., 0., 1.);
    discEdgeNDC.xyz /= abs(discEdgeNDC.w);
    float noteSizeNDC = length(discEdgeNDC.xy - noteNDC.xy);
    vec4 anchorNDC = modelViewProjMatrix * vec4(0., 0., 0., 1.);
    anchorNDC.xyz /= abs(anchorNDC.w);
    vec4 vectorNDC = modelViewProjMatrix * vec4(pos, 1.);
    vectorNDC.xyz /= abs(vectorNDC.w);
    vectorNDC -= anchorNDC;
    float lineLengthNDC = length(vectorNDC.xy);
    float vertDot = abs(dot(normalize(vectorNDC.xy), vec2(0, 1)));
    float angle = acos(vertDot) / (PI / 2.);
    float aspect = mix(resolution.x / resolution.y, 1., angle);
    vec2 vector2d = normalize(vectorNDC.xy) * max(lineLengthNDC - noteSizeNDC * aspect, 0.);
    vectorNDC.xy = vector2d.xy;
    vectorNDC += anchorNDC;
    gl_Position = vec4(vectorNDC.xyz, 1.);
  }
}
