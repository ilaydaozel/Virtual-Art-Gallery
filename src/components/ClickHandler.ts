import * as THREE from 'three';

const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

function clickHandling(
  renderer: THREE.Renderer,
  camera: THREE.Camera,
  paintings: THREE.Mesh[]
) {
  renderer.domElement.addEventListener(
    'click',
    (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      onClick(camera, paintings);
    },
    false
  );
}

function onClick(camera: THREE.Camera, paintings: THREE.Mesh[]) {
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(paintings);

  if (intersects.length > 0) {
    const painting = intersects[0].object;
    window.open(painting.userData.info.link, '_blank');
  }
}

export { clickHandling };
