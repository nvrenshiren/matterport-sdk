precision highp float;
precision highp int;
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
uniform vec3 topColor;
uniform vec3 bottomColor;
uniform float radius;
varying vec4 worldPosition;
#define SRGB_TO_LINEAR(c)pow((c),vec3(2.2))
#define LINEAR_TO_SRGB(c)pow((c),vec3(1./2.2))
#define USE_DITHER
float gradientNoise(in vec2 uv)
{
  const vec3 magic = vec3(0.06711056, 0.00583715, 52.9829189);
  return fract(magic.z * fract(dot(uv, magic.xy)));
}
void main()
{
  float normalizedHeight = (worldPosition.y + radius) / (radius * 2.);
  float ratio = smoothstep(0., 0.5, normalizedHeight);
  vec3 colorFromGradient = mix(SRGB_TO_LINEAR(bottomColor), SRGB_TO_LINEAR(topColor), ratio);
  vec3 color = LINEAR_TO_SRGB(colorFromGradient);
#if defined (USE_DITHER)
  color += (1. / 255.) * gradientNoise(gl_FragCoord.xy) - (0.5 / 255.);
#endif
  gl_FragColor = vec4(color, 1.);
}
