import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { EXRLoader, GLTFLoader, GroundedSkybox, RGBELoader } from 'three/examples/jsm/Addons.js'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
scene.add(ambientLight)



const textureLoader = new THREE.TextureLoader()
const wallColorTexture = textureLoader.load('/textures/dark_brick_wall/dark_brick_wall_diff_1k.jpg')
const wallNormalTexture = textureLoader.load('/textures/dark_brick_wall/dark_brick_wall_nor_gl_1k.png')
const wallAORoughnessMetalnessTexture = textureLoader.load('/textures/dark_brick_wall/dark_brick_wall_arm_1k.jpg')
wallColorTexture.colorSpace = THREE.SRGBColorSpace


const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8),
    new THREE.MeshStandardMaterial({
        map: wallColorTexture,
        normalMap: wallNormalTexture,
        aoMap: wallAORoughnessMetalnessTexture,
        roughnessMap: wallAORoughnessMetalnessTexture,
        metalnessMap: wallAORoughnessMetalnessTexture,
    })
)
wall.rotation.x = -Math.PI * 0.5;
// scene.add(wall)


const floorColorTexture = textureLoader.load('/textures/dark_brick_wall/dark_brick_wall_diff_1k.jpg')
const floorNormalTexture = textureLoader.load('/textures/dark_brick_wall/dark_brick_wall_nor_gl_1k.png')
const floorAORoughnessMetalnessTexture = textureLoader.load('/textures/dark_brick_wall/dark_brick_wall_arm_1k.jpg')
floorColorTexture.colorSpace = THREE.SRGBColorSpace


const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8),
    new THREE.MeshStandardMaterial({
        map: floorColorTexture,
        normalMap: floorNormalTexture,
        aoMap: floorAORoughnessMetalnessTexture,
        roughnessMap: floorAORoughnessMetalnessTexture,
        metalnessMap: floorAORoughnessMetalnessTexture,
    })
)
// floor.rotation.x = Math.PI ;
floor.position.set(0, 4, -4)
// scene.add(floor)

const theGroup = new THREE.Group()
theGroup.add(wall, floor)
scene.add(theGroup)
theGroup.rotation.y = -Math.PI / 4

const rgbeLoader = new RGBELoader()

rgbeLoader.load('/envMaps/0/2k.hdr', (env) => {
    env.mapping = THREE.EquirectangularReflectionMapping
    scene.background = env;
    scene.environment = env;
})



const directionalLight = new THREE.DirectionalLight(0xffffff, 11.8)
// directionalLight.castShadow = true
// directionalLight.shadow.mapSize.set(1024, 1024)
// directionalLight.shadow.camera.far = 15
// directionalLight.shadow.camera.left = - 7
// directionalLight.shadow.camera.top = 7
// directionalLight.shadow.camera.right = 7
// directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(-10, 12, 5)
scene.add(directionalLight)
// scene.add(new THREE.DirectionalLightHelper(directionalLight))

gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001);
gui.add(directionalLight.position, 'x').min(-39).max(39).step(0.01);
gui.add(directionalLight.position, 'y').min(-39).max(39).step(0.01);
gui.add(directionalLight.position, 'z').min(-39).max(39).step(0.01);

gui.add(directionalLight.shadow, 'normalBias').min(-0.05).max(0.05).step(0.0001)
directionalLight.shadow.normalBias = 0.05
gui.add(directionalLight.shadow, 'bias').min(-0.05).max(0.05).step(0.0001)
directionalLight.shadow.bias = -0.0016

gui.add(scene, 'environmentIntensity').min(0).max(5)
scene.environmentIntensity = 0.195

directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 20;
// directionalLight.shadow.mapSize.set(512, 512);
// directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.mapSize.set(4096, 4096);

const dirLigCamHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(dirLigCamHelper)


directionalLight.target.position.set(0, 4, 0)
directionalLight.target.updateWorldMatrix()




/**
 * Objects
 */

const burgerTexture = textureLoader.load('/textures/burger/burger.jpg')

burgerTexture.repeat.x = 2
burgerTexture.repeat.y = 3
burgerTexture.wrapS = THREE.MirroredRepeatWrapping
burgerTexture.wrapT = THREE.MirroredRepeatWrapping

// burgerTexture.offset.x = 0.5
// burgerTexture.offset.y = 0.5

const gltfLoader = new GLTFLoader()
gltfLoader.load('./models/custom%20models/my%20burger.gltf', (gltf) => {
    // gltfLoader.load('./models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
    scene.add(gltf.scene)
    gltf.scene.scale.set(0.5, 0.5, 0.5)
    // gltf.scene.rotation.set(0.3, -0.5, 0)
    gltf.scene.position.set(0, 1, 0)
    console.info(gltf.scene);

    scene.traverse((child) => {
        if (child.isMesh && child.material.isMeshStandardMaterial) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    })
})


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})



/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 6, 10)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
// controls.target.y = 3.5;



/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 0.28;

gui.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
})
gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0


const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime



    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
