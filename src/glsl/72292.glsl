precision highp float;
uniform float opacity;
uniform float centerSpacing;
uniform float radius;
uniform vec3 color;
void main()
{
  vec2 center = mod(gl_FragCoord.xy, vec2(centerSpacing)) - vec2(centerSpacing * 0.5);
  float polkaDot = 1. - smoothstep(radius - (radius * 0.2), radius, length(center));
  gl_FragColor = vec4(color, opacity * polkaDot);
}
