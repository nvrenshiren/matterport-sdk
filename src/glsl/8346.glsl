precision highp float;
precision highp int;
varying vec2 vUv;
uniform float progress;
uniform float opacity;
uniform sampler2D tNoHover;
uniform sampler2D tHover;
uniform sampler2D tPortal;
void main()
{
  vec4 noHoverColor = texture2D(tNoHover, vUv);
  vec4 hoverColor = texture2D(tHover, vUv);
  vec4 portalColor = texture2D(tPortal, vUv);
  float xToCtr = 2. * vUv.x - 1.;
  float yToCtr = 2. * vUv.y - 1.;
  float withinRadius = step(xToCtr * xToCtr + yToCtr * yToCtr, 0.9);
  vec4 mixedPortalColor = mix(hoverColor, portalColor, withinRadius);
  mixedPortalColor = mix(mixedPortalColor, hoverColor, hoverColor.a);
  mixedPortalColor = mix(noHoverColor, mixedPortalColor, progress);
  mixedPortalColor.a = min(mixedPortalColor.a, opacity);
  gl_FragColor = mixedPortalColor;
}
