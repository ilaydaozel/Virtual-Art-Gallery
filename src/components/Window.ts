import * as THREE from 'three';
import { CSG } from 'three-csg-ts';
import { createDirectionalLightWithTarget } from './Light';

const createHole = (size: THREE.Vector2, position: THREE.Vector3) => {
  const geometry = new THREE.BoxGeometry(size.x, size.y, 1);
  const material = new THREE.MeshLambertMaterial();
  const hole = new THREE.Mesh(geometry, material);
  hole.position.set(position.x, position.y, position.z);
  return hole;
};

const subtractTheHoleFromTheWall = (wall: THREE.Mesh, hole: THREE.Mesh) => {
  wall.updateMatrix();
  hole.updateMatrix();

  // Convert meshes to CSG objects
  const wallCSG = CSG.fromMesh(wall);
  const holeCSG = CSG.fromMesh(hole);

  // Subtract the window from the right wall using CSG
  const wallWithHoleCSG = wallCSG.subtract(holeCSG);
  const wallWithHole = CSG.toMesh(wallWithHoleCSG, wall.matrix, wall.material);
  return wallWithHole;
};

const createFrame = (size: THREE.Vector2, width: number) => {
  let shape = new THREE.Shape([
    new THREE.Vector2(0, 0),
    new THREE.Vector2(size.x, 0),
    new THREE.Vector2(size.x, size.y),
    new THREE.Vector2(0, size.y),
  ]);

  let hole = new THREE.Path([
    new THREE.Vector2(width, width),
    new THREE.Vector2(width, size.y - width),
    new THREE.Vector2(size.x - width, size.y - width),
    new THREE.Vector2(size.x - width, width),
  ]);
  shape.holes.push(hole);
  let shapeGeometry = new THREE.ShapeGeometry(shape);

  var frame = new THREE.Mesh(
    shapeGeometry,
    new THREE.MeshLambertMaterial({ color: 0xebe2d3, side: THREE.DoubleSide })
  );

  return frame;
};

const createGlass = (size: THREE.Vector2) => {
  const iceBlue = '#d3f2f5';
  const glassGeometry = new THREE.BoxGeometry(size.x, size.y, 0.5);
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: iceBlue,
    transparent: true,
    opacity: 0.7,
    transmission: 0.6,
    roughness: 0.6,
    ior: 1.5,
  });

  const glass = new THREE.Mesh(glassGeometry, glassMaterial);
  return glass;
};

const addLightToTheGlass = (
  glass: THREE.Mesh,
  lightDirection: THREE.Vector3
) => {
  createDirectionalLightWithTarget(glass, lightDirection);
};

export const createWindowsInTheWall = (
  wall: THREE.Mesh,
  windows: {
    size: THREE.Vector2;
    position: THREE.Vector3;
    lightDirection: THREE.Vector3;
  }[]
) => {
  let wallWithWindows: THREE.Mesh = wall;

  for (let i = 0; i < windows.length; i++) {
    const { size, position } = windows[i];
    const windowHole = createHole(size, position);
    const wallWithHole = subtractTheHoleFromTheWall(
      wallWithWindows,
      windowHole
    );
    wallWithWindows = wallWithHole;
  }

  for (let i = 0; i < windows.length; i++) {
    const { size, position, lightDirection } = windows[i];
    const glass = createGlass(size);
    glass.position.set(
      position.x - wall.position.x,
      position.y - wall.position.y,
      position.z - wall.position.z - 0.5
    );
    const frameWidth = 2;
    const frameSize = new THREE.Vector2(
      size.x + frameWidth,
      size.y + frameWidth
    );
    const frame = createFrame(frameSize, frameWidth);
    frame.position.set(0 - frameSize.x / 2, 0 - frameSize.y / 2, -0.3);
    glass.add(frame);
    wallWithWindows.add(glass);
    addLightToTheGlass(glass, lightDirection);
  }

  return wallWithWindows;
};
