precision highp float;
precision highp int;
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
uniform float borderSize;
uniform float textureSampleScale;
uniform samplerCube panoTexture;
uniform vec4 borderColor;
varying vec2 vUv;
const vec4 transparent = vec4(0., 0., 0., 0.);
const float PI = 3.14159265359;
const float HALF_PI = PI / 2.;
void main()
{
  float fadeDist = 0.1;
  float r = 1.;
  vec2 uv = (vUv * 2.) - vec2(1., 1.);
  float d = length(uv);
  float p = d * PI - HALF_PI;
  float y = sin(p);
  float h = cos(p) * textureSampleScale;
  vec3 sampleVec = vec3(uv.x * h, y, uv.y * h);
  vec4 panoColor = textureCube(panoTexture, sampleVec);
  panoColor.a = clamp(((1. - d) / d) / fadeDist, 0., 1.);
  vec4 outColor = mix(panoColor, transparent, step(1., d));
  float isBorder = max(sign(borderSize), 0.) * step(1. - borderSize, d) * step(d, 1.);
  gl_FragColor = mix(outColor, borderColor, isBorder);
}
