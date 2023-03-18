import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import * as glob from 'glob'

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
let ambientLight = new THREE.AmbientLight(0xffffff, 1.0); //color, intensity, distance, decay
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



//Create the walls
const wallGroup = new THREE.Group(); //create a group to hold the walls
scene.add(wallGroup);

//Front wall
const frontWall = new THREE.Mesh(
    new THREE.BoxGeometry(40, 20, 0.001),
    new THREE.MeshBasicMaterial({ color: '#f2f2f2' })
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
    new THREE.MeshBasicMaterial({ color: '#f9f9f9' })
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