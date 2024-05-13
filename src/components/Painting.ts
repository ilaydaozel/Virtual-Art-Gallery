import { IArtwork } from './../types';
import * as THREE from 'three';

const paintingDepth: number = 0.5;

export const createPainting = (
  url: string,
  dimensions: { width: number; height: number }
) => {
  const paintingTexture = new THREE.TextureLoader().load(url);
  const painting = new THREE.Mesh(
    new THREE.BoxGeometry(dimensions.width, dimensions.height, paintingDepth),
    new THREE.MeshLambertMaterial({ map: paintingTexture })
  );
  painting.castShadow = true;
  painting.receiveShadow = true;
  return painting;
};

export const createAndHangPaintings = (
  artworks: IArtwork[],
  floorDimensions: { width: number; height: number }
) => {
  let distanceBetween = 30;
  let hangingHeight = 20;
  let wallIndex = 0;
  let currentWallLength = 0;
  let positionX = 0;
  let positionZ = 0;
  const floorWidth = floorDimensions.width;
  const floorHeight = floorDimensions.height;
  const paintings: THREE.Mesh[] = [];
  for (let i = 0; i < artworks.length; i++) {
    const artwork: IArtwork = artworks[i];
    const artworkWidth: number = artwork.width ? artwork.width / 5 : 10;
    const artworkHeight: number = artwork.height ? artwork.height / 5 : 10;
    const painting = createPainting(artwork.artworkMedias[0], {
      width: artworkWidth,
      height: artworkHeight,
    });

    if (wallIndex === 0 || wallIndex === 2) {
      if (currentWallLength + artworkWidth + distanceBetween > floorWidth) {
        wallIndex = (wallIndex + 1) % 4;
        currentWallLength = 0;
      }
    } else {
      if (currentWallLength + artworkWidth + distanceBetween > floorHeight) {
        wallIndex = (wallIndex + 1) % 4;
        currentWallLength = 0;
      }
    }

    switch (wallIndex) {
      case 0:
        // Front wall
        positionX = -floorWidth / 2 + currentWallLength + distanceBetween;
        positionZ = -(floorHeight / 2 - paintingDepth);
        break;
      case 1:
        // left wall
        positionZ = -floorHeight / 2 + currentWallLength + distanceBetween;
        positionX = -floorWidth / 2 + paintingDepth;
        painting.rotation.y = Math.PI / 2;
        break;
      case 2:
        // Back wall
        positionX = floorWidth / 2 - currentWallLength - distanceBetween;
        positionZ = floorHeight / 2 - paintingDepth;
        break;
      case 3:
        // right wall
        positionX = floorWidth / 2 - paintingDepth;
        positionZ = -floorHeight / 2 + currentWallLength + distanceBetween;
        painting.rotation.y = -Math.PI / 2;
        break;
    }
    painting.position.set(positionX, hangingHeight, positionZ);
    paintings.push(painting);
    currentWallLength += artworkWidth + distanceBetween; // Update the current wall's length
  }
  return paintings;
};
