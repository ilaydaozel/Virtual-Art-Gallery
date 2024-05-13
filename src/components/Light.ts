import * as THREE from 'three';

export const createInitialRoomLight = (scene: THREE.Scene, camera: THREE.PerspectiveCamera) => {
  let ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.8); //color, intensity, distance, decay
  ambientLight.position.x = camera.position.x; //light follows camera
  ambientLight.position.y = camera.position.y;
  ambientLight.position.z = camera.position.z;
  scene.add(ambientLight);
  //const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
  //scene.add(directionalLight);
};
export const createDirectionalLightWithTarget = (
  target: THREE.Object3D,
  position: THREE.Vector3
) => {
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
  //the position is relative to the glass and also relative to the wall
  directionalLight.position.set(position.x, position.y, position.z);
  directionalLight.target = target;

  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 512;
  directionalLight.shadow.mapSize.height = 512;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 100;
  target.add(directionalLight);
};

export const createSpotlightWithTarget = (
  target: THREE.Object3D,
  position?: THREE.Vector3
) => {
  const { x, z } = target.position;
  let spotlightPosition = new THREE.Vector3(x, 38, z);
  if (position) {
    spotlightPosition = position;
  }

  const spotlight = new THREE.SpotLight(0xffff00, 30);
  spotlight.position.set(
    spotlightPosition.x,
    spotlightPosition.y,
    spotlightPosition.z
  );
  spotlight.target = target;
  spotlight.castShadow = true;
  spotlight.angle = Math.PI / 2;
  spotlight.penumbra = 1;
  spotlight.decay = 1.5;
  spotlight.distance = 50;
  spotlight.shadow.mapSize.width = 1024;
  spotlight.shadow.mapSize.height = 1024;
  return spotlight;
};
