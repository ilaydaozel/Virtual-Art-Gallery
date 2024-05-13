import * as THREE from 'three';

export const createBoundingBoxOfGroup = (group: THREE.Group) => {
  const boundingBoxes: THREE.Box3[] = [];
  for (let i = 0; i < group.children.length; i++) {
    const boundingBox = new THREE.Box3().setFromObject(group.children[i]);
    boundingBoxes.push(boundingBox);
  }
  return boundingBoxes;
};

export const checkCollisionWithTheBoundingBox = (
  camera: THREE.Camera,
  boundingBox: THREE.Box3[]
) => {
  const minDistance = 10;
  const playerBoundingBox = new THREE.Box3();
  const roomBoundingBox = boundingBox;
  const cameraWorldPosition = new THREE.Vector3();
  camera.getWorldPosition(cameraWorldPosition);
  playerBoundingBox.setFromCenterAndSize(
    cameraWorldPosition,
    new THREE.Vector3(1, 1, 1)
  );
  for (let i = 0; i < roomBoundingBox.length; i++) {
    const distance = roomBoundingBox[i].distanceToPoint(cameraWorldPosition);
    if (distance < minDistance) {
      return true;
    }
  }
  return false;
};
