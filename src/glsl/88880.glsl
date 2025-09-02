precision highp float;
precision highp int;
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
uniform samplerCube map;
uniform vec2 dir;
varying vec3 vWorldPosition;
vec3 sphereToUnit(float x, float y)
{
  return vec3(sin(x) * cos(y), cos(x), sin(x) * sin(y));
}
vec2 unitToSphere(vec3 unit)
{
  return vec2(atan(sqrt(pow(unit.x, 2.) + pow(unit.z, 2.)), unit.y), atan(unit.z, unit.x));
}
void main()
{
  vec2 coord = unitToSphere(vWorldPosition);
  vec4 sum = textureCube(map, sphereToUnit(coord.x - 12. * dir.x, coord.y - 12. * dir.y)) * KERNEL_1;
  sum += textureCube(map, sphereToUnit(coord.x - 11. * dir.x, coord.y - 11. * dir.y)) * KERNEL_2;
  sum += textureCube(map, sphereToUnit(coord.x - 10. * dir.x, coord.y - 10. * dir.y)) * KERNEL_3;
  sum += textureCube(map, sphereToUnit(coord.x - 9. * dir.x, coord.y - 9. * dir.y)) * KERNEL_4;
  sum += textureCube(map, sphereToUnit(coord.x - 8. * dir.x, coord.y - 8. * dir.y)) * KERNEL_5;
  sum += textureCube(map, sphereToUnit(coord.x - 7. * dir.x, coord.y - 7. * dir.y)) * KERNEL_6;
  sum += textureCube(map, sphereToUnit(coord.x - 6. * dir.x, coord.y - 6. * dir.y)) * KERNEL_7;
  sum += textureCube(map, sphereToUnit(coord.x - 5. * dir.x, coord.y - 5. * dir.y)) * KERNEL_8;
  sum += textureCube(map, sphereToUnit(coord.x - 4. * dir.x, coord.y - 4. * dir.y)) * KERNEL_9;
  sum += textureCube(map, sphereToUnit(coord.x - 3. * dir.x, coord.y - 3. * dir.y)) * KERNEL_10;
  sum += textureCube(map, sphereToUnit(coord.x - 2. * dir.x, coord.y - 2. * dir.y)) * KERNEL_11;
  sum += textureCube(map, sphereToUnit(coord.x - 1. * dir.x, coord.y - 1. * dir.y)) * KERNEL_12;
  sum += textureCube(map, sphereToUnit(coord.x, coord.y)) * KERNEL_13;
  sum += textureCube(map, sphereToUnit(coord.x + 1. * dir.x, coord.y + 1. * dir.y)) * KERNEL_14;
  sum += textureCube(map, sphereToUnit(coord.x + 2. * dir.x, coord.y + 2. * dir.y)) * KERNEL_15;
  sum += textureCube(map, sphereToUnit(coord.x + 3. * dir.x, coord.y + 3. * dir.y)) * KERNEL_16;
  sum += textureCube(map, sphereToUnit(coord.x + 4. * dir.x, coord.y + 4. * dir.y)) * KERNEL_17;
  sum += textureCube(map, sphereToUnit(coord.x + 5. * dir.x, coord.y + 5. * dir.y)) * KERNEL_18;
  sum += textureCube(map, sphereToUnit(coord.x + 6. * dir.x, coord.y + 6. * dir.y)) * KERNEL_19;
  sum += textureCube(map, sphereToUnit(coord.x + 7. * dir.x, coord.y + 7. * dir.y)) * KERNEL_20;
  sum += textureCube(map, sphereToUnit(coord.x + 8. * dir.x, coord.y + 8. * dir.y)) * KERNEL_21;
  sum += textureCube(map, sphereToUnit(coord.x + 9. * dir.x, coord.y + 9. * dir.y)) * KERNEL_22;
  sum += textureCube(map, sphereToUnit(coord.x + 10. * dir.x, coord.y + 10. * dir.y)) * KERNEL_23;
  sum += textureCube(map, sphereToUnit(coord.x + 11. * dir.x, coord.y + 11. * dir.y)) * KERNEL_24;
  sum += textureCube(map, sphereToUnit(coord.x + 12. * dir.x, coord.y + 12. * dir.y)) * KERNEL_25;
  gl_FragColor = sum;
}
