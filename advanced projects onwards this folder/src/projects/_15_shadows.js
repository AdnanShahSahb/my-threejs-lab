import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"

let animationId = null;


const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()


const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshStandardMaterial({color:'gray'}),
)
mesh.castShadow = true;
scene.add(mesh)



const textLoader = new THREE.TextureLoader()
const bakedShadow = textLoader.load('/bakedShadow.png')
const simpleShadow = textLoader.load('/simpleShadow.jpg')

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    new THREE.MeshStandardMaterial(),
)
plane.receiveShadow = true;
scene.add(plane)

plane.rotation.x = -Math.PI * 0.5
plane.position.y = -0.5


const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        transparent: true,
        alphaMap: simpleShadow,
        color: 'black'
    })
)
scene.add(sphereShadow)
sphereShadow.rotation.x = -Math.PI / 2;
sphereShadow.position.y = plane.position.y + 0.01

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


const ambLi = new THREE.AmbientLight(0xffffff, 0.4)
scene.add(ambLi)


const dirLi = new THREE.DirectionalLight(0xffffff, 0.4)
dirLi.position.set(2, 2, -1)
dirLi.castShadow = true;
dirLi.shadow.mapSize.width = 1024;
dirLi.shadow.mapSize.height = 1024;
dirLi.shadow.camera.near = 1;
dirLi.shadow.camera.far = 6;
dirLi.shadow.camera.top = 2;
dirLi.shadow.camera.bottom = -2;
dirLi.shadow.camera.left = -2;
dirLi.shadow.camera.right = 2;
dirLi.shadow.radius = 11;
scene.add(dirLi)

const dirLiCamHelper = new THREE.CameraHelper(dirLi.shadow.camera)
// scene.add(dirLiCamHelper)

const spotLight = new THREE.SpotLight(0xffffff, 4, 20, Math.PI * 0.3)
spotLight.castShadow = true;
spotLight.position.set(0, 2, 2)
spotLight.shadow.camera.fov = 30;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;
// scene.add(spotLight)
// scene.add(spotLight.target)

const spotLiCamHelper = new THREE.CameraHelper(spotLight.shadow.camera)
// scene.add(spotLiCamHelper)


const pointLight = new THREE.PointLight(0xffffff, 3)
pointLight.castShadow = true;
pointLight.position.set(-1, 1, 0)
// scene.add(pointLight)

const pointHelper = new THREE.CameraHelper(pointLight.shadow.camera)
// scene.add(pointHelper)


const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 5
camera.position.y = 3
scene.add(camera)


const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true;


const renderer = new THREE.WebGLRenderer({
    canvas
})


renderer.setSize(sizes.width, sizes.height)

// renderer.shadowMap.enabled = true;

const clock = new THREE.Clock()

const animate = () => {
    const elapsedTime = clock.getElapsedTime();
    // console.info(elapsedTime);
    mesh.position.x = Math.cos(elapsedTime * 3) * 1.5;
    mesh.position.z = Math.sin(elapsedTime * 3) * 1.5;
    mesh.position.y = Math.abs(Math.sin(elapsedTime * 3))

    sphereShadow.position.x = mesh.position.x
    sphereShadow.position.z = mesh.position.z
    sphereShadow.material.opacity = (1 - mesh.position.y) * 0.5;

    controls.update()

    renderer.render(scene, camera)
    animationId = requestAnimationFrame(animate)
}
animate();
