import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import { GUI } from 'dat.gui'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.z = 0
camera.position.y = 5


//Light
//Ambient Light
let ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.8); //color, intensity, distance, decay
ambientLight.position.x = camera.position.x; //light follows camera
ambientLight.position.y = camera.position.y;
ambientLight.position.z = camera.position.z;
scene.add(ambientLight);


const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)


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

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
})

//Floor
const planeGeometry = new THREE.PlaneGeometry(40, 50)
const floorTexture = new THREE.TextureLoader().load('img/marmer.jpg')
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(10, 20); // how many times to repeat the texture

const materialFloor = new THREE.MeshPhongMaterial()
materialFloor.map = floorTexture
materialFloor.side = THREE.DoubleSide
const floor = new THREE.Mesh(planeGeometry, materialFloor)

floor.rotation.x = Math.PI / 2; //90 degrees
scene.add(floor)


const artworks = ['a', 'b', 'c']
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
    const artTexture = new THREE.TextureLoader().load('img/artwork/' + artworks[i] + '.jpg')
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

//Ceiling
const ceilingTexture = new THREE.TextureLoader().load('img/textureWall.jpg')
ceilingTexture.wrapS = THREE.RepeatWrapping;
ceilingTexture.wrapT = THREE.RepeatWrapping;
ceilingTexture.repeat.set(20, 25); // how many times to repeat the texture

const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 50),
    new THREE.MeshPhongMaterial({ map: ceilingTexture })
)

ceiling.rotation.x = Math.PI / 2;
ceiling.position.y = 20;

scene.add(ceiling);


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