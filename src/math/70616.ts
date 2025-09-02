import { DirectionVector } from "../webgl/vector.const"
import { PerspectiveCamera, Vector3 } from "three"
/**
 * 计算相机到视图边缘的距离
 * @param screenRatio 屏幕尺寸的比例
 * @param camera 透视相机
 * @param screenSize 屏幕的宽度或高度
 * @param offsetZ 沿Z轴的偏移量
 * @returns
 */
export function calculateDistanceToViewEdge(screenRatio: number, camera: PerspectiveCamera, screenSize: number, offsetZ = 0) {
  const worldSpaceDistance = (screenRatio / screenSize) * 2
  const cameraPosition = new Vector3(0, 0, offsetZ).unproject(camera)
  const viewEdgeVector = DirectionVector.RIGHT.clone().multiplyScalar(worldSpaceDistance)
  viewEdgeVector.z = offsetZ
  viewEdgeVector.unproject(camera)
  return viewEdgeVector.sub(cameraPosition).length()
}
