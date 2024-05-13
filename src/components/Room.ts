import * as THREE from 'three';
import { createWindowsInTheWall } from './Window';

const roomHeight = 30;

const createFloor = (width: number, height: number) => {
  const planeGeometry = new THREE.PlaneGeometry(width, height);
  const floorTexture = new THREE.TextureLoader().load(
    'img/marmer.jpg'
  );
  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(width / 10, height / 20);
  const materialFloor = new THREE.MeshPhongMaterial({
    map: floorTexture,
    side: THREE.DoubleSide,
    shininess: 100,
  });
  const floor = new THREE.Mesh(planeGeometry, materialFloor);
  floor.rotation.x = Math.PI / 2; //90 degrees
  floor.rotation.y = -Math.PI; //180 degrees
  floor.position.y = 0;
  floor.receiveShadow = true;
  return floor;
};

const createCeiling = (width: number, height: number) => {
  const ceilingTexture = new THREE.TextureLoader().load(
    'img/textureWall.jpg'
  );
  ceilingTexture.wrapS = THREE.RepeatWrapping;
  ceilingTexture.wrapT = THREE.RepeatWrapping;
  ceilingTexture.repeat.set(width /2, height / 2);
  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshPhongMaterial({ map: ceilingTexture })
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = roomHeight;
  ceiling.receiveShadow = true;
  return ceiling;
};


/*
//Create the walls
const wallGroup = new THREE.Group(); //create a group to hold the walls
scene.add(wallGroup);

//Front wall
const frontWall = new THREE.Mesh(
    new THREE.BoxGeometry(40, 20, 0.001),
    new THREE.MeshLambertMaterial({ color: '#f2f2f2' })
)
frontWall.position.z = -25;
frontWall.position.y = 10;

//Left wall
const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(50, 20, 0.001),
    new THREE.MeshLambertMaterial({ color: '#f9f9f9' })
)

leftWall.position.x = -20;
leftWall.position.y = 10;
leftWall.rotation.y = Math.PI / 2;

//Right wall
const rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(50, 20, 0.001),
    new THREE.MeshLambertMaterial({ color: '#f9f9f9' })
)

rightWall.position.x = 20;
rightWall.rotation.y = Math.PI / 2;
rightWall.position.y = 10;
wallGroup.add(frontWall, leftWall, rightWall);

*/

export const createWall = (wallColor: string, width: number) => {
  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(width, roomHeight, 1),
    new THREE.MeshLambertMaterial({ color: wallColor })
  );
  wall.position.y = roomHeight / 2;
  wall.receiveShadow = true;
  wall.castShadow = true;
  return wall;
};

const createAllWalls = (floorWidth: number, floorHeight: number) => {
  const wallGroup = new THREE.Group();
  const wallColor: string = '#FFFFFF';
  const frontWall = createWall(wallColor, floorWidth);
  frontWall.position.z = -floorHeight / 2;

  const leftWall = createWall(wallColor, floorHeight);
  leftWall.position.x = -floorWidth / 2;
  leftWall.rotation.y = Math.PI / 2;

  let rightWall: THREE.Mesh = createWall('#749091', floorHeight);
  let rightWallWithWindows: THREE.Mesh = createWindowsInTheWall(rightWall, [
    {
      size: new THREE.Vector2(20, 15),
      position: new THREE.Vector3(0, 15, 0),
      lightDirection: new THREE.Vector3(0, 20, 30),
    },
  ]);
  rightWall = rightWallWithWindows;
  
  rightWall.position.x = floorWidth / 2;
  rightWall.rotation.y = Math.PI / 2;

  const backWall = createWall(wallColor, floorWidth);
  backWall.position.z = floorHeight / 2;

  wallGroup.add(leftWall, frontWall, backWall, rightWall);
  return wallGroup;
};

export const createRoom = (floorDimensions: {
  width: number;
  height: number;
}) => {
  const { width, height } = floorDimensions;
  const ceiling = createCeiling(width, height);
  const floor = createFloor(width, height);
  const walls = createAllWalls(width, height);
  return { ceiling, floor , walls};
};
