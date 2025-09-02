precision highp float;
precision highp int;
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
uniform float opacity;
uniform vec3 tint;
uniform float discRadius;
uniform vec3 discNormal;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrixInverse;
uniform mat4 projectionMatrixInverse;
varying vec3 vFragWorldPos;
varying vec3 vCenterWorldPos;

#ifdef USE_TEXTURE
uniform sampler2D texture;
#else
uniform vec2 ringRadii[RING_COUNT];
uniform vec4 ringColors[RING_COUNT];
#endif
float rayDistToPlane(vec3 rayOrigin, vec3 rayDir, vec3 planeOrigin, vec3 planeNormal)
{
  float planeConstant = -dot(planeOrigin, planeNormal);
  float denom = dot(planeNormal, rayDir);
  return denom == 0. ? -1e9 : -(dot(rayOrigin, planeNormal) + planeConstant) / denom;
}
vec4 getColorAtRay(vec3 rayOrigin, vec3 rayDir)
{
  vec4 color = vec4(0.);
  float intersectDist = rayDistToPlane(rayOrigin, rayDir, vCenterWorldPos, discNormal);
  vec3 intersect = rayOrigin + rayDir * intersectDist;
#ifdef USE_TEXTURE
  if (intersectDist > 0.)
  {
    vec3 cameraDir = normalize((viewMatrixInverse * vec4(0., 0., -1., 0.)).xyz);
    vec3 stableDir = abs(dot(cameraDir, discNormal)) > 0.8 ? normalize(cameraDir * vec3(1., 0., 1.)) * sign(discNormal.y) : (viewMatrixInverse * vec4(0., 1., 0., 0.)).xyz;
    vec3 xAxis = normalize(cross(stableDir, discNormal));
    vec3 yAxis = normalize(cross(discNormal, xAxis));
    intersect -= vCenterWorldPos;
    vec2 uv = vec2(dot(xAxis, intersect), dot(yAxis, intersect)) / discRadius / 2. + 0.5;
    if (clamp(uv, vec2(0.), vec2(1.)) == uv)
    {
      color = texture2D(texture, uv);
    }
  }
#else
  float fragRadius = intersectDist > 0. ? distance(intersect, vCenterWorldPos) : 1e9;
  if (fragRadius <= discRadius * 2.)
  {
    for (int i = 0; i < RING_COUNT; i++)
    {
      vec2 radii = ringRadii[i] * discRadius;
      vec4 ringColor = ringColors[i];
      float ringDist = min(fragRadius - radii[0], radii[1] - fragRadius);
#if defined(GL_OES_standard_derivatives) || __VERSION__ >= 300
      float delta = length(vec2(dFdx(fragRadius), dFdy(fragRadius))) * 0.70710678;
      ringColor.a *= smoothstep(-delta, delta, ringDist);
#else
      ringColor.a *= step(0., ringDist);
#endif
      float finalAlpha = color.a + ringColor.a * (1. - color.a);
      color = finalAlpha > 0. ? vec4((color.rgb * color.a + ringColor.rgb * ringColor.a * (1. - color.a)) / finalAlpha, finalAlpha) : color;
    }
  }
#endif
  color.rgb *= tint;
  if (dot(rayDir, discNormal) >= 0.)
  {
    color.a = 0.;
  }
  return color;
}
void main()
{
  vec4 fragNDC = projectionMatrix * viewMatrix * vec4(vFragWorldPos, 1.);
  vec4 nearWorldPos = viewMatrixInverse * projectionMatrixInverse * vec4(fragNDC.xy, -1., 1.);
  nearWorldPos /= nearWorldPos.w;
  gl_FragColor = getColorAtRay(nearWorldPos.xyz, normalize(vFragWorldPos - nearWorldPos.xyz));
  gl_FragColor.a *= opacity;
  if (gl_FragColor.a == 0.)
  {
    discard;
  }
}
