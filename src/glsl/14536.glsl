precision highp float;
uniform vec3 baseColor;
uniform float isDoor;
varying vec3 vPosition;
void main()
{
  const float lineWidth = 0.15;
  if (isDoor > 0.)
  {
    const float startZ = 0.15;
    const float endZ = startZ + lineWidth;
    float alpha = (abs(vPosition.z) > startZ && abs(vPosition.z) < endZ) ? 1. : 0.;
    gl_FragColor = vec4(baseColor, alpha);
  }
  else
  {
    float alpha = (abs(vPosition.z) < lineWidth * 0.5) ? 1. : 0.;
    gl_FragColor = vec4(baseColor, alpha);
  }
}
