import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import { GUI } from 'dat.gui'
import {createInitialRoomLight} from './../components/Light'
import {createRoom, createWall} from "./../components/Room"
import artworks from '../data/artworks';



//scene
const scene = new THREE.Scene();
//camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 0;
camera.position.y = 5;
scene.add(camera);
//renderer

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
renderer.setClearColor(0xffffff, 1); //backgroundColor
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Initial Light
createInitialRoomLight(scene, camera);

// add event listeners for menu
const menuPanel = document.getElementById('menuPanel') as HTMLDivElement
const startButton = document.getElementById('startButton') as HTMLInputElement
startButton.addEventListener(
    'click',
    function () {
        controls.lock()
    },
    false
)
const controls = new PointerLockControls(camera, renderer.domElement)
controls.addEventListener('lock', () => (menuPanel.style.display = 'none'))
controls.addEventListener('unlock', () => (menuPanel.style.display = 'block'))

const floorDimensions = { width: 40, height: 50 };
const {ceiling, floor, walls } = createRoom(floorDimensions);
scene.add(ceiling, floor, walls)

const artworkPlanes = []
let ZCount = -10;


const light = new THREE.SpotLight(0xFF000F, 1, 1, 1, 0.8, 1)
scene.add(light)
//renderer.shadowMap.enabled = true
//renderer.shadowMap.type = THREE.PCFSoftShadowMap
light.position.x = -15
light.position.z = 0
light.position.y = 20

const data = {
    color: light.color.getHex(),
    mapsEnabled: true,
    //shadowMapSizeWidth: 512,
    //shadowMapSizeHeight: 512,
}

const gui = new GUI()
const lightFolder = gui.addFolder('THREE.Light')
lightFolder.addColor(data, 'color').onChange(() => {
    light.color.setHex(Number(data.color.toString().replace('#', '0x')))
})
lightFolder.add(light, 'intensity', 0, 1, 0.01)

const spotLightFolder = gui.addFolder('THREE.SpotLight')
spotLightFolder.add(light, 'distance', 0, 100, 0.01)
spotLightFolder.add(light, 'decay', 0, 4, 0.1)
spotLightFolder.add(light, 'angle', 0, 1, 0.1)
spotLightFolder.add(light, 'penumbra', 0, 1, 0.1)
spotLightFolder.add(light.shadow.camera, "near", 0.1, 100).onChange(() => light.shadow.camera.updateProjectionMatrix())
spotLightFolder.add(light.shadow.camera, "far", 0.1, 100).onChange(() => light.shadow.camera.updateProjectionMatrix())
spotLightFolder.add(light.position, 'x', -50, 50, 0.01)
spotLightFolder.add(light.position, 'y', -50, 50, 0.01)
spotLightFolder.add(light.position, 'z', -50, 50, 0.01)
spotLightFolder.open()


for (let i = 0; i < artworks.length; i++) {

    const planeGeometry = new THREE.BoxGeometry(7, 7, 0.3)
    const artTexture = new THREE.TextureLoader().load(artworks[i].url)
    const artworkMaterial = new THREE.MeshPhongMaterial()
    artworkMaterial.map = artTexture
    const artwork = new THREE.Mesh(planeGeometry, artworkMaterial)
    artwork.position.x = -19;
    artwork.rotation.y = Math.PI / 2;
    artwork.position.z = ZCount;
    artwork.position.y = 7;
    scene.add(artwork)
    ZCount += 12;
    artworkPlanes.push(artwork)
}


const onKeyDown = function (event: KeyboardEvent) {
    switch (event.code) {
        case 'KeyW':
            controls.moveForward(0.25)
            break
        case 'KeyA':
            controls.moveRight(-0.25)
            break
        case 'KeyS':
            controls.moveForward(-0.25)
            break
        case 'KeyD':
            controls.moveRight(0.25)
            break
    }
}
document.addEventListener('keydown', onKeyDown, false)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function animate() {
    requestAnimationFrame(animate)
    render()
}

function render() {
    renderer.render(scene, camera)
}

animate()