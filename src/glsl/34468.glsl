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
varying vec4 maskPosition;
varying vec4 panoPosition;
uniform samplerCube maskTexture;
uniform samplerCube panoBlurredMap0;
uniform samplerCube panoBlurredMap1;
uniform samplerCube panoBlurredMap2;
uniform samplerCube panoBlurredMap3;
const vec4 SELECTED_OUTLINE_COLOR = vec4(1., 1., 1., 1.);
const vec4 HOVER_COLOR = vec4(1., 1., 1., 1.);
vec4 combineBlurs(vec4 mask, vec4 blurredColor0, vec4 blurredColor1, vec4 blurredColor2, vec4 blurredColor3)
{
  float maskAlpha = mask.r;
  float selectedAlpha = mask.g;
  float hoveredAlpha = mask.b;
  float targetSigma = maskAlpha * (4. * 4. - 1.);
  float blurRatio = log2(1. + targetSigma);
  float panoAlpha = max(1. - abs(blurRatio - 0.) / 1., 0.);
  float blurAlpha0 = max(1. - abs(blurRatio - 1.) / 1., 0.);
  float blurAlpha1 = max(1. - abs(blurRatio - 2.) / 1., 0.);
  float blurAlpha2 = max(1. - abs(blurRatio - 3.) / 1., 0.);
  float blurAlpha3 = max(1. - abs(blurRatio - 4.) / 1., 0.);
  float alpha = blurAlpha0 + blurAlpha1 + blurAlpha2 + blurAlpha3;
  vec4 color = (panoAlpha * blurredColor0 + blurAlpha0 * blurredColor0 + blurAlpha1 * blurredColor1 + blurAlpha2 * blurredColor2 + blurAlpha3 * blurredColor3);
  color.a = alpha;
  float selectedMaskAlpha = smoothstep(0.65, 0.75, selectedAlpha) * (1. - smoothstep(0.85, 0.95, selectedAlpha));
  color = mix(color, SELECTED_OUTLINE_COLOR, selectedMaskAlpha);
  color = mix(color, HOVER_COLOR, hoveredAlpha * 0.3);
  return color;
}
void main()
{
  vec4 mask = textureCube(maskTexture, maskPosition.xyz);
#ifdef DEBUG_BLUR_LEVELS
  mask = vec4(fract(gl_FragCoord.x / 2048.), 0., 0., 1.);
#endif
  vec4 blurredColor0 = textureCube(panoBlurredMap0, panoPosition.xyz);
  vec4 blurredColor1 = textureCube(panoBlurredMap1, panoPosition.xyz);
  vec4 blurredColor2 = textureCube(panoBlurredMap2, panoPosition.xyz);
  vec4 blurredColor3 = textureCube(panoBlurredMap3, panoPosition.xyz);
# ifdef DEBUG_BLUR_LEVELS
  if (gl_FragCoord.y > 2000.)
  {
    blurredColor0 = vec4(1., 0., 0., 1.);
    blurredColor1 = vec4(0., 1., 0., 1.);
    blurredColor2 = vec4(0., 0., 1., 1.);
    blurredColor3 = vec4(0., 1., 1., 1.);
  }
#elif defined(DEBUG_BLUR_COLORS)
  blurredColor0 = vec4(1., 0., 0., 1.);
  blurredColor1 = vec4(0., 1., 0., 1.);
  blurredColor2 = vec4(0., 0., 1., 1.);
  blurredColor3 = vec4(0., 1., 1., 1.);
#endif
  gl_FragColor = combineBlurs(mask, blurredColor0, blurredColor1, blurredColor2, blurredColor3);
}
