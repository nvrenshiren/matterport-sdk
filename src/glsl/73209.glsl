precision highp float;
precision highp int;
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
uniform sampler2D map;
uniform float opacity;
uniform vec4 colorOverlay;
varying vec2 vUv;
vec4 white = vec4(0.8, 0.8, 0.8, 1.);
vec4 black = vec4(0., 0., 0., 1.);
void main()
{
  vec4 colorFromTexture = texture2D(map, vUv);
  float whiteness = 1. - smoothstep(0.1, 0.2, opacity);
  colorFromTexture = mix(colorFromTexture, vec4(colorOverlay.rgb, 1.), colorOverlay.a);
  colorFromTexture = mix(colorFromTexture, white, whiteness);
  gl_FragColor = vec4(colorFromTexture.rgb, opacity);
}
