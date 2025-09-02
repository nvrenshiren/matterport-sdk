precision highp float;
precision highp int;
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;

#ifdef INSTANCED
varying float alpha;
varying vec3 color;
#else
uniform float alpha;
uniform vec3 color;
#endif
uniform sampler2D bg;
uniform sampler2D mask;
varying vec2 vUv;
varying vec4 vMaskRect;
varying float vStrokeWidth;
float ring(vec2 pos, float radius, float thick)
{
  return mix(1., 0., smoothstep(thick, thick + (thick * 0.5), abs(length(vUv - pos) - radius)));
}
vec4 crop(vec4 texColor, vec2 xy, float size)
{
  texColor *= step(size, 1. - xy.x);
  texColor *= step(size, xy.x);
  texColor *= step(size, 1. - xy.y);
  texColor *= step(size, xy.y);
  return texColor;
}
vec2 center = vec2(0.5, 0.5);
void main()
{
  vec4 bgColor = texture2D(bg, vUv);
  if (bgColor.a * alpha < 0.1)
  {
    discard;
  }
  float iconScale = 1.75;
  vec2 maskUV = mix(vMaskRect.xy, vMaskRect.zw, (vUv - 0.5) * iconScale + 0.5);
  vec4 maskColor = texture2D(mask, maskUV);
  maskColor.rgb = vec3(1.);
  float padding = 0.22;
  maskColor = crop(maskColor, vUv, padding);
  vec3 mappedColor = mix(color, maskColor.rgb, maskColor.a);
  const vec3 frameColor = vec3(1., 1., 1.);
  float frame = ring(center, 0.5, vStrokeWidth);
  mappedColor = mix(mappedColor, frameColor, frame);
  gl_FragColor = vec4(mappedColor, bgColor.a * alpha);
}
